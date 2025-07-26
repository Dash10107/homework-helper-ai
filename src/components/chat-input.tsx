'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Paperclip, Mic, Send, X, Loader2, FileAudio, StopCircle } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export type Attachment = {
  file: File;
  type: 'image' | 'audio';
  previewUrl: string;
};

interface ChatInputProps {
  onSubmit: (text: string, attachment: Attachment | null) => void;
  isResponding: boolean;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_AUDIO_DURATION_S = 60;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function ChatInput({ onSubmit, isResponding }: ChatInputProps) {
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'File too large', description: `Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.` });
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
       toast({ variant: 'destructive', title: 'Invalid file type', description: 'Only JPG, PNG, GIF, and WEBP images are accepted.' });
       return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAttachment({ file, type: 'image', previewUrl });
  };
  
  const handleStartRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size > 0) {
          const audioUrl = URL.createObjectURL(audioBlob);
          const audioFile = new File([audioBlob], "recording.webm", { type: "audio/webm" });
          setAttachment({ file: audioFile, type: 'audio', previewUrl: audioUrl });
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      recordingTimerRef.current = setTimeout(handleStopRecording, MAX_AUDIO_DURATION_S * 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast({ variant: 'destructive', title: 'Microphone Error', description: 'Could not access microphone. Please check permissions.' });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearTimeout(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const handleRemoveAttachment = () => {
    if (attachment) {
      URL.revokeObjectURL(attachment.previewUrl);
      setAttachment(null);
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (isResponding || (!text.trim() && !attachment)) return;
    onSubmit(text, attachment);
    setText('');
    setAttachment(null);
  };

  return (
    <form onSubmit={handleSubmitForm} className="relative w-full">
      {attachment && (
        <div className="absolute bottom-full mb-2 w-fit max-w-xs rounded-lg border bg-card p-2 shadow-lg animate-in fade-in-50 slide-in-from-bottom-2">
          <div className="relative">
            {attachment.type === 'image' && (
              <Image src={attachment.previewUrl} alt="Preview" width={100} height={100} className="h-24 w-24 rounded-md object-cover" />
            )}
            {attachment.type === 'audio' && (
              <div className="flex w-48 flex-col items-center gap-2 p-4">
                 <FileAudio className="h-12 w-12 text-primary" />
                 <audio src={attachment.previewUrl} controls className="h-8 w-full" />
              </div>
            )}
            <Button type="button" variant="destructive" size="icon" className="absolute -right-2 -top-2 h-6 w-6 rounded-full" onClick={handleRemoveAttachment}>
              <X size={14} />
            </Button>
          </div>
        </div>
      )}

      <div className="relative flex items-center">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask a question..."
          className="min-h-[52px] w-full resize-none rounded-full border-2 border-input px-5 py-3 pr-32 shadow-sm focus:border-primary focus:ring-primary"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) handleSubmitForm(e);
          }}
          disabled={isResponding}
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <Button type="button" size="icon" variant="ghost" onClick={() => fileInputRef.current?.click()} disabled={isResponding || !!attachment || isRecording} aria-label="Attach image">
            <Paperclip size={20} />
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={ACCEPTED_IMAGE_TYPES.join(',')} className="hidden" />
          
          <Button type="button" size="icon" variant="ghost" className={cn(isRecording && 'text-red-500')} onClick={isRecording ? handleStopRecording : handleStartRecording} disabled={isResponding || !!attachment} aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
            {isRecording ? <StopCircle size={20} className="animate-pulse" /> : <Mic size={20} />}
          </Button>

          <Button type="submit" size="icon" className="rounded-full w-9 h-9" disabled={isResponding || (!text.trim() && !attachment)} aria-label="Send message">
            {isResponding ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </Button>
        </div>
      </div>
    </form>
  );
}
