"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Repeat, XCircle } from 'lucide-react';
import { Progress } from './ui/progress';

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type SecurityQuizProps = {
  questions: QuizQuestion[];
};

type Answer = {
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
};

export function SecurityQuiz({ questions }: SecurityQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [view, setView] = useState<'question' | 'summary' | 'review'>('question');

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const score = answers.filter(a => a.isCorrect).length;

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    setAnswers([
        ...answers,
        {
            question: currentQuestion.question,
            selectedAnswer: selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect: isCorrect,
        }
    ]);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsSubmitted(false);
    } else {
        setView('summary');
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
                <h3 className="text-xl font-bold mb-4 text-center">Your Answers</h3>
                <div className="space-y-6">
                    {answers.map((answer, index) => (
                        <div key={index}>
                            <p className="font-semibold">{index + 1}. {answer.question}</p>
                             <div className="mt-2 space-y-2 text-sm">
                                {questions[index].options.map(option => (
                                    <div key={option} className={`flex items-start gap-3 ${getOptionStyle(option, questions[index], true, answer.selectedAnswer)}`}>
                                      <span>
                                          {option === answer.selectedAnswer && !answer.isCorrect && <XCircle className="h-5 w-5 text-destructive" />}
                                          {option === answer.correctAnswer && <CheckCircle className="h-5 w-5 text-primary" />}
                                      </span>
                                      <span className="flex-1">{option}</span>
                                    </div>
                                ))}
                            </div>
                            {!answer.isCorrect && (
                                <p className="text-xs text-muted-foreground mt-2">{questions[index].explanation}</p>
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
