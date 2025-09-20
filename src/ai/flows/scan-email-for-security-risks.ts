'use server';

/**
 * @fileOverview Scans an email address for security risks against known data breaches and phishing databases.
 *
 * - scanEmailForSecurityRisks - A function that initiates the email security scan.
 * - ScanEmailForSecurityRisksInput - The input type for the scanEmailForSecurityRisks function.
 * - ScanEmailForSecurityRisksOutput - The return type for the scanEmailForSecurityRisks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanEmailForSecurityRisksInputSchema = z.object({
  email: z
    .string()
    .email()
    .describe('The email address to scan for security risks.'),
});
export type ScanEmailForSecurityRisksInput = z.infer<
  typeof ScanEmailForSecurityRisksInputSchema
>;

const ScanEmailForSecurityRisksOutputSchema = z.object({
  securityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A security score from 0 to 100, with 100 being the best.'),
  risksIdentified: z
    .array(z.string())
    .describe('A list of security risks identified for the email address.'),
  actionableTips: z
    .array(z.string())
    .describe(
      'A list of actionable tips to improve the email address security.'
    ),
});
export type ScanEmailForSecurityRisksOutput = z.infer<
  typeof ScanEmailForSecurityRisksOutputSchema
>;

export async function scanEmailForSecurityRisks(
  input: ScanEmailForSecurityRisksInput
): Promise<ScanEmailForSecurityRisksOutput> {
  return scanEmailForSecurityRisksFlow(input);
}

const scanEmailForSecurityRisksPrompt = ai.definePrompt({
  name: 'scanEmailForSecurityRisksPrompt',
  input: {schema: ScanEmailForSecurityRisksInputSchema},
  output: {schema: ScanEmailForSecurityRisksOutputSchema},
  prompt: `You are an AI security assistant that analyzes email addresses for potential security risks.

You will receive an email address as input and should provide a security score, a list of identified risks, and actionable tips to improve security.

Email Address: {{{email}}}

Consider the following factors when determining the security score and risks:

- Data breaches involving the email address or associated services.
- Phishing incidents targeting the email address or associated services.
- Known spam campaigns involving the email address.
- Weak passwords or compromised credentials associated with the email address.
- Security settings and configurations of the email account.

Based on your analysis, provide a security score (0-100), a list of identified risks, and actionable tips to improve security.

Security Score (0-100): 
Risks Identified:
Actionable Tips: `,
});

const scanEmailForSecurityRisksFlow = ai.defineFlow(
  {
    name: 'scanEmailForSecurityRisksFlow',
    inputSchema: ScanEmailForSecurityRisksInputSchema,
    outputSchema: ScanEmailForSecurityRisksOutputSchema,
  },
  async input => {
    const {output} = await scanEmailForSecurityRisksPrompt(input);
    return output!;
  }
);
