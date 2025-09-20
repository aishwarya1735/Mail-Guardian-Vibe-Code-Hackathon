"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type SecurityScoreGaugeProps = {
  score: number;
};

export function SecurityScoreGauge({ score }: SecurityScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const getColor = (s: number) => {
    if (s > 80) return "text-primary";
    if (s > 40) return "text-accent";
    return "text-destructive";
  };

  const getBgColor = (s: number) => {
    if (s > 80) return "stroke-primary/20";
    if (s > 40) return "stroke-accent/20";
    return "stroke-destructive/20";
  };
  
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="relative h-48 w-48 shrink-0">
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle
          className={cn("transform-gpu transition-colors duration-500", getBgColor(score))}
          strokeWidth="8"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="currentColor"
        />
        <circle
          className={cn("transform -rotate-90 transform-origin-center transition-colors duration-500", getColor(score))}
          strokeWidth="8"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("text-5xl font-bold tracking-tighter", getColor(score))}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-sm text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}
