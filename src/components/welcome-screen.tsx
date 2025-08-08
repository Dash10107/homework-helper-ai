'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, BookOpen, Code, FlaskConical } from 'lucide-react';

interface WelcomeScreenProps {
    onExampleClick: (prompt: string) => void;
}

const examplePrompts = [
    {
        icon: <BookOpen className="h-5 w-5" />,
        text: 'Explain the main themes in "To Kill a Mockingbird".',
    },
    {
        icon: <FlaskConical className="h-5 w-5" />,
        text: 'Show me a diagram of the water cycle.',
    },
    {
        icon: <Code className="h-5 w-5" />,
        text: 'Write a python function to find prime numbers in a list.',
    },
    {
        icon: <Lightbulb className="h-5 w-5" />,
        text: 'What is the Pythagorean theorem?',
    },
];

export function WelcomeScreen({ onExampleClick }: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-gray-50 p-8 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-4">
        <Lightbulb className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mb-2 text-3xl font-bold text-primary">Hello! I'm Sage.</h2>
      <p className="mb-8 max-w-lg text-lg text-gray-600">
        Your multimodal AI Tutor. Ask me anything, upload a problem, or record a question. I'm here to help you learn.
      </p>
      <div className="w-full max-w-2xl">
        <h3 className="mb-4 text-md font-semibold text-gray-700">Try an example:</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {examplePrompts.map((prompt, index) => (
            <Card
              key={index}
              onClick={() => onExampleClick(prompt.text)}
              className="cursor-pointer text-left transition-all hover:bg-primary/5 hover:shadow-md"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="text-primary">{prompt.icon}</div>
                <p className="flex-1 text-sm font-medium text-gray-800">{prompt.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
