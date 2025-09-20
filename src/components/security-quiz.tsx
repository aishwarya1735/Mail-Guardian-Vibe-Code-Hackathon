"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type SecurityQuizProps = {
  questions: QuizQuestion[];
};

export function SecurityQuiz({ questions }: SecurityQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsSubmitted(true);
    }
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  };
  
  const getOptionStyle = (option: string) => {
    if (!isSubmitted) return "";
    if (option === currentQuestion.correctAnswer) return "text-primary font-semibold";
    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) return "text-destructive font-semibold";
    return "text-muted-foreground";
  }

  return (
    <Card className="mt-4 border-dashed">
      <CardContent className="p-6">
        <p className="font-semibold text-lg mb-4">{currentQuestionIndex + 1}. {currentQuestion.question}</p>
        
        <RadioGroup
          value={selectedAnswer ?? undefined}
          onValueChange={(value) => !isSubmitted && setSelectedAnswer(value)}
          className="space-y-3 mb-6"
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <RadioGroupItem value={option} id={`q${currentQuestionIndex}-option-${index}`} disabled={isSubmitted}/>
              <Label htmlFor={`q${currentQuestionIndex}-option-${index}`} className={`flex-1 ${getOptionStyle(option)}`}>
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
                    {currentQuestionIndex === questions.length - 1 ? "Start Over" : "Next Question"}
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
