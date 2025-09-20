"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { handleScanEmail } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, CheckCircle, Info, KeyRound, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SecurityScoreGauge } from "./security-score-gauge";
import type { ScanEmailForSecurityRisksOutput } from "@/ai/flows/scan-email-for-security-risks";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

const initialState: {
  data: ScanEmailForSecurityRisksOutput | null;
  error: string | null;
} = {
  data: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          Scan Email
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}

export function EmailScannerForm() {
  const [state, formAction] = useFormState(handleScanEmail, initialState);
  const [showResults, setShowResults] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: state.error,
      });
      setShowResults(false);
    }
    if (state.data) {
      setShowResults(true);
    }
  }, [state, toast]);

  const handleScanAnother = () => {
    setShowResults(false);
    formRef.current?.reset();
    // Reset state manually. A more robust solution might use a key on the component.
    initialState.data = null;
    initialState.error = null;
  };
  
  const getRiskIcon = (risk: string) => {
    const lowerRisk = risk.toLowerCase();
    if (lowerRisk.includes("breach") || lowerRisk.includes("leaked") || lowerRisk.includes("compromised")) {
      return <KeyRound className="h-5 w-5 text-destructive" />;
    }
    if (lowerRisk.includes("phishing") || lowerRisk.includes("spam")) {
      return <ShieldAlert className="h-5 w-5 text-accent" />;
    }
    return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
  };

  if (showResults && state.data) {
    const actionableTips = state.data.actionableTips.filter(tip => !tip.toLowerCase().includes("consider") && !tip.toLowerCase().includes("be wary"));
    const generalTips = state.data.actionableTips.filter(tip => tip.toLowerCase().includes("consider") || tip.toLowerCase().includes("be wary"));

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
            <SecurityScoreGauge score={state.data.securityScore} />
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Your Security Score</h2>
                <p className="text-lg text-muted-foreground mt-1 max-w-md mx-auto">Based on our analysis, here's your email security rating and how to improve it.</p>
            </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="text-primary"/>
                Your Security Checklist
            </CardTitle>
            <CardDescription>Complete these actions to improve your security score.</CardDescription>
          </CardHeader>
          <CardContent>
            {actionableTips.length > 0 ? (
                <div className="space-y-4">
                  {actionableTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <Checkbox id={`tip-${index}`} className="mt-1" />
                      <Label htmlFor={`tip-${index}`} className="flex-1 text-sm font-normal text-foreground">{tip}</Label>
                    </div>
                  ))}
                </div>
            ) : (
                 <div className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary"/>
                    <p>Your security posture is strong. No immediate actions required!</p>
                </div>
            )}
          </CardContent>
        </Card>

        <Separator />

        <div className="space-y-4">
            <div className="text-center">
                <h3 className="text-2xl font-bold">Security Insights</h3>
                <p className="text-muted-foreground">Learn more about the risks we found and other security best practices.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="font-semibold">
                         <div className="flex items-center gap-2">
                            <ShieldAlert className="text-accent"/>
                            Identified Risks
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                         {state.data.risksIdentified.length > 0 ? (
                            <ul className="space-y-3 pt-2">
                            {state.data.risksIdentified.map((risk, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="mt-1">{getRiskIcon(risk)}</div>
                                    <span className="flex-1 text-sm">{risk}</span>
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-3 text-muted-foreground pt-2">
                                <CheckCircle className="h-5 w-5 text-primary"/>
                                <p>No major security risks found. Well done!</p>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="font-semibold">
                        <div className="flex items-center gap-2">
                            <Info className="text-primary"/>
                            General Security Tips
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        {generalTips.length > 0 ? (
                            <ul className="space-y-3 pt-2">
                            {generalTips.map((tip, index) => (
                                <li key={index} className="flex items-start gap-4">
                                <div className="mt-1"><ShieldCheck className="h-5 w-5 text-primary" /></div>
                                <span className="flex-1 text-sm">{tip}</span>
                                </li>
                            ))}
                            </ul>
                        ) : (
                            <div className="flex items-center gap-3 text-muted-foreground pt-2">
                                <CheckCircle className="h-5 w-5 text-primary"/>
                                <p>Your security posture is strong. Keep it up!</p>
                            </div>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>


        <div className="text-center pt-4">
            <Button onClick={handleScanAnother} variant="outline">
                Scan Another Email
            </Button>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          name="email"
          type="email"
          placeholder="your.google.email@gmail.com"
          required
          className="h-12 flex-grow text-base"
        />
        <SubmitButton />
      </div>
    </form>
  );
}
