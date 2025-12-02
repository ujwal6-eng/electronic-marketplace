import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { AISupportChat } from './AISupportChat';

export const FloatingActionButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <Button
        size="icon"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full gradient-secondary shadow-2xl hover:shadow-xl transition-all z-50 border-0 hover:scale-110"
        aria-label="AI Chat Support"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
      
      <AISupportChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
