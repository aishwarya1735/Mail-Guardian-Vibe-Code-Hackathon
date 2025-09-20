// This is a server-side file.
'use server';

/**
 * @fileOverview Generates tailored, actionable tips for improving email security using an LLM.
 *
 * - generateActionableTips - A function that generates security tips.
 * - GenerateActionableTipsInput - The input type for the generateActionableTips function.
 * - GenerateActionableTipsOutput - The return type for the generateActionableTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateActionableTipsInputSchema = z.object({
  emailConfiguration: z
    .string()
    .describe('The email configuration details of the user.'),
  recentBreachActivity: z
    .string()
    .optional()
    .describe(
      'Details of recent breach activity related to the user\u0027s domain, if available.'
    ),
});
export type GenerateActionableTipsInput = z.infer<
  typeof GenerateActionableTipsInputSchema
>;

const GenerateActionableTipsOutputSchema = z.object({
  securityTips: z
    .array(z.string())
    .describe(
      'A list of tailored, actionable tips for improving email security.'
    ),
});
export type GenerateActionableTipsOutput = z.infer<
  typeof GenerateActionableTipsOutputSchema
>;

export async function generateActionableTips(
  input: GenerateActionableTipsInput
): Promise<GenerateActionableTipsOutput> {
  return generateActionableTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionableTipsPrompt',
  input: {schema: GenerateActionableTipsInputSchema},
  output: {schema: GenerateActionableTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide users with actionable tips for improving their email security.

  Based on the following information, generate a list of tailored security tips:

  Email Configuration: {{{emailConfiguration}}}

  Recent Breach Activity: {{{recentBreachActivity}}}

  Please provide clear, concise, and actionable tips that the user can easily implement to enhance their email security.
  The tips should be specific to the user's email configuration and any recent breach activity related to their domain.
  Do not include any disclaimers or caveats, just the raw tips.
  Do not start the tips with "Tip #1", just list the tips.
  Each tip should be less than 40 words.
  The tips should be in the format of a list, one tip per line.
  Do not include any introductory or concluding statements.
  Do not include any tips that the user can't action (e.g. "use a strong password" is bad, but "enable 2FA" is actionable).
  Return at least 3 tips.
  `,
});

const generateActionableTipsFlow = ai.defineFlow(
  {
    name: 'generateActionableTipsFlow',
    inputSchema: GenerateActionableTipsInputSchema,
    outputSchema: GenerateActionableTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
