# **App Name**: Homework Helper AI

## Core Features:

- Text Input: A text input box for homework questions.
- Image Upload: Button to upload images for homework questions. Consider restricting the set of accepted image filetypes.
- Audio Input: Audio input to ask homework questions. Includes start/stop recording buttons and playback control. Limit the length of the accepted audio samples.
- Multimodal Q&A: Use Gemini via Genkit to process user text, image, or audio, and return helpful, accurate answers to the questions asked; Gemini is used as a tool when determining whether to incorporate a provided piece of data into its output.
- Chat UI: A chat interface that displays the back-and-forth conversation with the AI assistant.
- Loading State: Loading indicator displayed while waiting for the response from Gemini.
- Temporary Storage: Temporarily store images and audio inputs using Firebase Storage.

## Style Guidelines:

- Primary color: Indigo (#4B0082) to represent knowledge and intellect.
- Background color: Very light gray (#F0F0F0), close in hue to the primary, to create a calm and clean learning environment.
- Accent color: Violet (#8F00FF), to give CTAs and highlights good contrast, and maintain harmony with the primary color.
- Body and headline font: 'PT Sans', a humanist sans-serif for a modern, readable look suitable for both headers and body text.
- Use simple, clear icons for input methods (text, image, audio) and loading states.
- Clean, responsive layout optimized for various screen sizes.
- Subtle animations for loading states and message transitions.