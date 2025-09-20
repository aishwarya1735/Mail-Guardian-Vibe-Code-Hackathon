
'use server';

import {
  scanEmailForSecurityRisks,
  type ScanEmailForSecurityRisksOutput,
} from '@/ai/flows/scan-email-for-security-risks';
import { z } from 'zod';

const emailSchema = z
  .string()
  .email({ message: 'Please enter a valid email address.' });

export async function handleScanEmail(
  prevState: any,
  formData: FormData
): Promise<{
  data: ScanEmailForSecurityRisksOutput | null;
  error: string | null;
  email?: string;
}> {
  const email = formData.get('email');

  const validation = emailSchema.safeParse(email);

  if (!validation.success) {
    return { data: null, error: validation.error.errors[0].message };
  }

  try {
    // Add a small delay to simulate scanning time and show loading animations.
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await scanEmailForSecurityRisks({ email: validation.data });
    return { data: result, error: null, email: validation.data };
  } catch (error) {
    console.error('Error scanning email:', error);
    return {
      data: null,
      error:
        'Failed to scan email. The AI model might be unavailable. Please try again later.',
    };
  }
}
