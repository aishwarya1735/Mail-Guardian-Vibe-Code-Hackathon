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

const ScoreBreakdownSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the security check (e.g., "Data Breaches", "2FA Enablement").'
    ),
  score: z.number().describe('The score awarded for this category.'),
  maxScore: z.number().describe('The maximum possible score for this category.'),
  description: z
    .string()
    .describe('A brief explanation of why this score was given.'),
});

const RiskSchema = z.object({
  description: z.string().describe('A description of the identified risk.'),
  source: z
    .string()
    .optional()
    .describe('The source of the risk, if available (e.g., a specific data breach or "Dark Web").'),
});
export type Risk = z.infer<typeof RiskSchema>;

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('A list of possible answers.'),
  correctAnswer: z
    .string()
    .describe('The correct answer from the options list.'),
  explanation: z
    .string()
    .describe('An explanation of why the answer is correct.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const QuizAnswerSchema = z.object({
  question: z.string(),
  selectedAnswer: z.string(),
  correctAnswer: z.string(),
  isCorrect: z.boolean(),
});
export type QuizAnswer = z.infer<typeof QuizAnswerSchema>;


const ScanEmailForSecurityRisksOutputSchema = z.object({
  securityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A security score from 0 to 100, with 100 being the best.'),
  scoreBreakdown: z
    .array(ScoreBreakdownSchema)
    .describe('A detailed breakdown of how the security score was calculated.'),
  risksIdentified: z
    .array(RiskSchema)
    .describe('A list of security risks identified for the email address.'),
  actionableTips: z
    .array(z.string())
    .describe(
      'A list of actionable tips to improve the email address security.'
    ),
  securityQuiz: z
    .array(QuizQuestionSchema)
    .describe('A short quiz with 2-3 security-related questions.'),
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

You will receive an email address as input and should provide a security score, a detailed score breakdown, a list of identified risks, actionable tips, and a security quiz.

Email Address: {{{email}}}

Consider the following factors when determining the security score and risks:
- Data breaches involving the email address or associated services (e.g., Have I Been Pwned).
- Discoveries on the dark web.
- Phishing incidents targeting the email address or associated services.
- Known spam campaigns involving the email address.
- Weak passwords or compromised credentials associated with the email address.
- Security settings and configurations of the email account (e.g., 2FA, recovery options).
- Domain security (e.g., DMARC, SPF records).

Be critical of the timeline; an email address cannot be part of a breach that occurred before it was plausibly created.

Based on your analysis, provide:
1.  A total security score (0-100).
2.  A score breakdown with at least 3 categories explaining how the total score was calculated (e.g., "Data Breaches", "Account Configuration", "Domain Security"). For each category, provide the score awarded, the max possible score, and a short description.
3.  A list of identified risks. For data breaches, if known, include the source of the breach (e.g., 'LinkedIn 2021'). If found on the dark web, set the source to 'Dark Web'.
4.  Actionable tips to improve security.
5.  A security quiz with 2-3 fun and interesting questions about common security traps where a user might be misled. Each question should have multiple-choice options, a single correct answer, and a brief explanation.

Example breakdown category:
- Category: Data Breaches
- Score: 15
- Max Score: 25
- Description: Your email was found in 2 known data breaches.

The sum of all maxScores in the breakdown should equal 100.
The sum of all awarded scores in the breakdown should equal the total securityScore.
`,
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
