'use server';
/**
 * @fileOverview Summarizes lengthy homework context (text, image, or audio) for quick understanding.
 *
 * - summarizeHomeworkContext - A function that summarizes homework context.
 * - SummarizeHomeworkContextInput - The input type for the summarizeHomeworkContext function.
 * - SummarizeHomeworkContextOutput - The return type for the summarizeHomeworkContext function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeHomeworkContextInputSchema = z.object({
  context: z.string().describe('The homework context to summarize. Can be text, an image data URI, or an audio data URI.'),
});
export type SummarizeHomeworkContextInput = z.infer<typeof SummarizeHomeworkContextInputSchema>;

const SummarizeHomeworkContextOutputSchema = z.object({
  summary: z.string().describe('A short summary of the homework context.'),
  progress: z.string().describe('A message indicating the progress of the summarization.'),
});
export type SummarizeHomeworkContextOutput = z.infer<typeof SummarizeHomeworkContextOutputSchema>;

export async function summarizeHomeworkContext(input: SummarizeHomeworkContextInput): Promise<SummarizeHomeworkContextOutput> {
  return summarizeHomeworkContextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeHomeworkContextPrompt',
  input: {schema: SummarizeHomeworkContextInputSchema},
  output: {schema: SummarizeHomeworkContextOutputSchema},
  prompt: `You are an expert summarizer, able to condense information into its most essential parts.

  Please summarize the following homework context:

  Context: {{{context}}}

  Summary:`, 
});

const summarizeHomeworkContextFlow = ai.defineFlow(
  {
    name: 'summarizeHomeworkContextFlow',
    inputSchema: SummarizeHomeworkContextInputSchema,
    outputSchema: SummarizeHomeworkContextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      progress: 'Generated a short, one-sentence summary of the homework context.',
    };
  }
);
