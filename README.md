# Sage: Your Multimodal AI Tutor

Sage is an intelligent, multimodal AI-powered homework assistant designed to help students learn more effectively. Built with a cutting-edge tech stack, Sage can understand questions in text, image, or audio format and respond with clear, accurate answers in the best modality—be it text, a generated diagram, a spoken explanation, or a combination of all three.

![Sage Screenshot](https://placehold.co/800x600.png?text=Sage+UI)

## ✨ Features

- **Multimodal Input:** Ask questions by typing, uploading an image (like a photo of a math problem), or recording your voice.
- **Rich, Multimodal Responses:** Get answers that go beyond text. Sage can generate diagrams, charts, and annotated images to explain visual concepts.
- **Text-to-Speech:** Prefer to listen? Sage can provide spoken explanations for its answers.
- **Intelligent Reasoning:** Powered by Gemini, Sage analyzes each question to understand the student's true intent, inferring context and determining the best way to explain the concept.
- **Student-Friendly Interface:** A clean, conversational UI that makes learning interactive and engaging.
- **Powered by Genkit:** Leverages Firebase's Genkit to orchestrate complex AI flows, combining language models, TTS, and image generation.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **AI Orchestration:** [Genkit](https://firebase.google.com/docs/genkit)
- **AI Model:** [Google Gemini](https://deepmind.google/technologies/gemini/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN](https://ui.shadcn.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

## 🏁 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your `GEMINI_API_KEY`.
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Run the Genkit development server (in a separate terminal):**
    ```bash
    npm run genkit:dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
