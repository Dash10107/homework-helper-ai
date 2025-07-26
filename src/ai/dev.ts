import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-homework-context.ts';
import '@/ai/flows/identify-relevant-concepts.ts';
import '@/ai/flows/generate-hints.ts';
import '@/ai/flows/generate-multimodal-response.ts';
