// src/ai/flows/identify-relevant-concepts.ts
'use server';

/**
 * @fileOverview Identifies relevant concepts from user input (text, image, or audio).
 *
 * - identifyRelevantConcepts - A function that identifies the relevant concepts.
 * - IdentifyRelevantConceptsInput - The input type for the identifyRelevantConcepts function.
 * - IdentifyRelevantConceptsOutput - The return type for the identifyRelevantConcepts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyRelevantConceptsInputSchema = z.object({
  input: z.string().describe('The user input, which can be text, an image data URI, or an audio data URI.'),
});
export type IdentifyRelevantConceptsInput = z.infer<typeof IdentifyRelevantConceptsInputSchema>;

const IdentifyRelevantConceptsOutputSchema = z.object({
  concepts: z.array(z.string()).describe('A list of relevant concepts or topics covered in the input.'),
});
export type IdentifyRelevantConceptsOutput = z.infer<typeof IdentifyRelevantConceptsOutputSchema>;

export async function identifyRelevantConcepts(input: IdentifyRelevantConceptsInput): Promise<IdentifyRelevantConceptsOutput> {
  return identifyRelevantConceptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyRelevantConceptsPrompt',
  input: {schema: IdentifyRelevantConceptsInputSchema},
  output: {schema: IdentifyRelevantConceptsOutputSchema},
  prompt: `You are an AI assistant helping students identify the relevant concepts in their homework questions.

  Analyze the following input and extract the key concepts or topics discussed. Return a list of these concepts.

  Input: {{{input}}}

  Concepts:`, //Crucially important:  The AI must return JSON format
});

const identifyRelevantConceptsFlow = ai.defineFlow(
  {
    name: 'identifyRelevantConceptsFlow',
    inputSchema: IdentifyRelevantConceptsInputSchema,
    outputSchema: IdentifyRelevantConceptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
