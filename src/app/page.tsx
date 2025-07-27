'use client';

import { useState } from 'react';
import { ChatInput, type Attachment } from '@/components/chat-input';
import { ChatMessages, type Message } from '@/components/chat-messages';
import {
  generateMultimodalResponse,
  type GenerateMultimodalResponseInput,
} from '@/ai/flows/generate-multimodal-response';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const fileToDataURI = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const [userPrefersAudio, setUserPrefersAudio] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (text: string, attachment: Attachment | null) => {
    if (!text.trim() && !attachment) return;

    setIsResponding(true);

    const userMessageId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      text,
      ...(attachment?.type === 'image' && { image: attachment.previewUrl }),
      ...(attachment?.type === 'audio' && { audio: attachment.previewUrl }),
    };

    const loadingMessageId = `assistant-${Date.now()}`;
    setMessages(prev => [
      ...prev,
      userMessage,
      { id: loadingMessageId, role: 'assistant', isLoading: true },
    ]);

    try {
      const aiInput: GenerateMultimodalResponseInput = {
        questionText: text,
        userPrefersAudioReply: userPrefersAudio,
      };

      if (attachment) {
        const dataUri = await fileToDataURI(attachment.file);
        if (attachment.type === 'image') {
          aiInput.questionImage = dataUri;
        } else if (attachment.type === 'audio') {
          aiInput.questionAudio = dataUri;
        }
      }

      const response = await generateMultimodalResponse(aiInput);

      const assistantMessage: Message = {
        id: loadingMessageId,
        role: 'assistant',
        text: response.textResponse,
        image: response.imageResponse,
        audio: response.audioResponse,
      };

      setMessages(prev => prev.map(msg => (msg.id === loadingMessageId ? assistantMessage : msg)));
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to get a response from the AI. Please try again.',
      });
      const errorMessage: Message = {
        id: loadingMessageId,
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => prev.map(msg => (msg.id === loadingMessageId ? errorMessage : msg)));
    } finally {
      setIsResponding(false);
    }
  };

  return (
    <main className="flex h-screen flex-col items-center bg-background p-4">
      <Card className="flex h-full w-full max-w-4xl flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl text-primary">Homework Helper AI</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="audio-preference" checked={userPrefersAudio} onCheckedChange={setUserPrefersAudio} disabled={isResponding}/>
            <Label htmlFor="audio-preference" className="text-sm font-medium">Prefer Audio Responses</Label>
          </div>
        </CardHeader>
        <div className="flex flex-1 flex-col overflow-hidden">
          <ChatMessages messages={messages} />
          <div className="border-t bg-card p-4">
            <ChatInput onSubmit={handleSubmit} isResponding={isResponding} />
          </div>
        </div>
      </Card>
    </main>
  );
}
