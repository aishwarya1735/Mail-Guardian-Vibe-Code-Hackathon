"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Repeat, XCircle } from 'lucide-react';
import { Progress } from './ui/progress';
import { QuizQuestion, QuizAnswer } from '@/ai/flows/scan-email-for-security-risks';


type SecurityQuizProps = {
  questions: QuizQuestion[];
  initialAnswers?: QuizAnswer[];
  onQuizComplete: (answers: QuizAnswer[]) => void;
};


export function SecurityQuiz({ questions, initialAnswers, onQuizComplete }: SecurityQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>(initialAnswers || []);
  
  const isReviewMode = !!initialAnswers;
  const [view, setView] = useState<'question' | 'summary' | 'review'>(isReviewMode ? 'review' : 'question');

  useEffect(() => {
    if (initialAnswers && initialAnswers.length > 0) {
      setView('review');
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const score = answers.filter(a => a.isCorrect).length;

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const newAnswer: QuizAnswer = {
        question: currentQuestion.question,
        selectedAnswer: selectedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: isCorrect,
    };

    setAnswers([...answers, newAnswer]);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsSubmitted(false);
    } else {
        setView('summary');
        onQuizComplete([...answers, {
            question: currentQuestion.question,
            selectedAnswer: selectedAnswer!,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: isCorrect,
        }]);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setAnswers([]);
    setView('question');
  };

  const getOptionStyle = (option: string, question: QuizQuestion, submitted: boolean, selected: string | null) => {
    if (!submitted) return "";
    if (option === question.correctAnswer) return "text-primary font-semibold";
    if (option === selected && option !== question.correctAnswer) return "text-destructive font-semibold";
    return "text-muted-foreground";
  }
  
  const getReviewOptionStyle = (option: string, answer: QuizAnswer) => {
      if (option === answer.correctAnswer) return "text-primary font-semibold";
      if (option === answer.selectedAnswer && !answer.isCorrect) return "text-destructive font-semibold";
      return "text-muted-foreground";
  };

  if (view === 'summary') {
    return (
        <Card className="mt-4 border-dashed">
            <CardContent className="p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-muted-foreground mb-4">You scored</p>
                <p className="text-4xl font-bold mb-4">{score} / {questions.length}</p>
                <Progress value={(score / questions.length) * 100} className="mb-6"/>
                <div className="flex justify-center gap-2">
                    <Button onClick={handleRestart} variant="outline"><Repeat className="mr-2 h-4 w-4"/> Try Again</Button>
                    <Button onClick={() => setView('review')}>Review Answers</Button>
                </div>
            </CardContent>
        </Card>
    )
  }

  if (view === 'review') {
    return (
        <Card className="mt-4 border-dashed">
            <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Quiz Review</h3>
                <div className="space-y-6">
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <p className="font-semibold">{index + 1}. {answer.question}</p>
                             <div className="mt-2 space-y-2 text-sm">
                                {questions[index].options.map(option => (
                                    <div key={option} className={`flex items-start gap-3 ${getReviewOptionStyle(option, answer)}`}>
                                      <span className="w-5 h-5 flex-shrink-0">
                                          {option === answer.selectedAnswer && !answer.isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
                                          {option === answer.correctAnswer && <CheckCircle className="h-5 w-5 text-primary" />}
                                      </span>
                                      <span className="flex-1">{option}</span>
                                    </div>
                                ))}
                            </div>
                            {!answer.isCorrect && (
                                <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded-md">{questions[index].explanation}</p>
                            )}
                        </div>
                    ))}
                </div>
                 <div className="text-center mt-6">
                    <Button onClick={handleRestart}><Repeat className="mr-2 h-4 w-4"/> Restart Quiz</Button>
                </div>
            </CardContent>
        </Card>
    )
  }


  return (
    <Card className="mt-4 border-dashed">
      <CardContent className="p-6">
        <p className="font-semibold text-lg mb-1">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
        <p className="text-sm text-muted-foreground mb-4">Question {currentQuestionIndex + 1} of {questions.length}</p>
        
        <RadioGroup
          value={selectedAnswer ?? undefined}
          onValueChange={(value) => !isSubmitted && setSelectedAnswer(value)}
          className="space-y-3 mb-6"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <RadioGroupItem value={option} id={`q${currentQuestionIndex}-option-${index}`} disabled={isSubmitted}/>
              <Label htmlFor={`q${currentQuestionIndex}-option-${index}`} className={`flex-1 ${getOptionStyle(option, currentQuestion, isSubmitted, selectedAnswer)}`}>
                {option}
                {isSubmitted && option === currentQuestion.correctAnswer && <CheckCircle className="inline-block ml-2 h-5 w-5 text-primary" />}
                {isSubmitted && option === selectedAnswer && option !== currentQuestion.correctAnswer && <XCircle className="inline-block ml-2 h-5 w-5 text-destructive" />}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {isSubmitted && (
          <div className={`p-4 rounded-md mb-4 animate-in fade-in duration-300 ${isCorrect ? 'bg-primary/10' : 'bg-destructive/10'}`}>
            <p className={`font-bold ${isCorrect ? 'text-primary' : 'text-destructive'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect'}
            </p>
            <p className="text-sm mt-1">{currentQuestion.explanation}</p>
          </div>
        )}

        <div className="flex justify-end gap-2">
            {!isSubmitted ? (
                <Button onClick={handleSubmit} disabled={!selectedAnswer}>Submit</Button>
            ) : (
                <Button onClick={handleNext}>
                    {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
