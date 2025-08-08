'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  text?: string;
  image?: string;
  audio?: string;
  isLoading?: boolean;
};

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, messages[messages.length - 1]?.text]);

  return (
    <ScrollArea className="flex-1" viewportRef={scrollAreaRef}>
      <div className="space-y-6 p-4 md:p-6">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              'flex animate-in fade-in-50 slide-in-from-bottom-2 items-start gap-4 duration-300',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-9 w-9 shrink-0 border">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot size={22} />
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={cn(
                'max-w-xl rounded-lg px-4 py-3 shadow-sm',
                message.role === 'user'
                  ? 'rounded-br-none bg-primary text-primary-foreground'
                  : 'rounded-bl-none bg-card'
              )}
            >
              {message.isLoading ? (
                <div className="flex items-center gap-2 font-medium">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Thinking...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {message.image && (
                    <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
                      <Image
                        src={message.image}
                        alt="Chat attachment"
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  {message.audio && <audio controls src={message.audio} className="h-10 w-full" />}
                  {message.text && (
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                  )}
                </div>
              )}
            </div>

            {message.role === 'user' && (
              <Avatar className="h-9 w-9 shrink-0 border">
                <AvatarFallback>
                  <User size={20} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
         <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
