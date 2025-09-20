"use client";

import type { ScanResult } from "./email-scanner-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertTriangle, Crown, KeyRound, ShieldCheck, Users } from "lucide-react";

type CommonBreach = {
    source: string;
    emails: string[];
}

export function GlobalSecurityDashboard({ scanHistory }: { scanHistory: ScanResult[] }) {
    if (scanHistory.length === 0) {
        return null;
    }

    // --- Process Data ---
    const latestScans = new Map<string, ScanResult>();
    scanHistory.forEach(scan => {
        const existing = latestScans.get(scan.email);
        if (!existing || new Date(scan.timestamp) > new Date(existing.timestamp)) {
            latestScans.set(scan.email, scan);
        }
    });
    const latestScansArray = Array.from(latestScans.values());

    // Find highest score
    const champion = latestScansArray.reduce((prev, current) => 
        (prev.data.securityScore > current.data.securityScore) ? prev : current
    );

    // Find common breaches and dark web appearances
    const breachMap = new Map<string, string[]>();
    const darkWebEmails = new Set<string>();

    scanHistory.forEach(scan => {
        scan.data.risksIdentified.forEach(risk => {
            if (risk.source) {
                const source = risk.source;
                if(source.toLowerCase() === 'dark web'){
                    darkWebEmails.add(scan.email);
                    return;
                }

                if (!breachMap.has(source)) {
                    breachMap.set(source, []);
                }
                const emails = breachMap.get(source)!;
                if (!emails.includes(scan.email)) {
                    emails.push(scan.email);
                }
            }
        });
    });

    const commonBreaches: CommonBreach[] = [];
    breachMap.forEach((emails, source) => {
        if (emails.length > 1) {
            commonBreaches.push({ source, emails });
        }
    });
    
    return (
        <div className="space-y-8 mt-12">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">Global Security Dashboard</h2>
                <p className="text-muted-foreground mt-2">An overview of security across all your scanned accounts.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="text-primary" />
                            Top Performer
                        </CardTitle>
                        <CardDescription>The account with the highest security score.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div>
                            <p className="font-bold text-lg">{champion.email}</p>
                            <p className="text-sm text-muted-foreground">Scanned on {new Date(champion.timestamp).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-3xl font-bold text-primary">{champion.data.securityScore}/100</p>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <ShieldCheck className="text-primary"/>
                            Total Scans
                        </CardTitle>
                         <CardDescription>Total number of unique accounts scanned.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{latestScansArray.length}</p>
                        <p className="text-xs text-muted-foreground">unique accounts</p>
                    </CardContent>
                </Card>
            </div>

            {(commonBreaches.length > 0 || darkWebEmails.size > 0) && (
                 <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle />
                            At-Risk Accounts
                        </CardTitle>
                        <CardDescription>Accounts exposed in the same data breaches or found on the dark web.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {darkWebEmails.size > 0 && (
                            <div>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><KeyRound className="h-4 w-4"/> Found on Dark Web</h4>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(darkWebEmails).map(email => (
                                        <Badge key={email} variant="destructive">{email}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        {commonBreaches.map(breach => (
                            <div key={breach.source}>
                                <h4 className="font-semibold flex items-center gap-2 mb-2"><Users className="h-4 w-4"/> Common Breach: {breach.source}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {breach.emails.map(email => (
                                         <Badge key={email} variant="secondary">{email}</Badge>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

        </div>
    );
}
