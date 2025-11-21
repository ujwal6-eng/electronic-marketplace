import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

export const FloatingActionButton = () => {
  return (
    <Button
      size="icon"
      className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
      aria-label="AI Chat Support"
    >
      <MessageCircle className="h-6 w-6" />
    </Button>
  );
};
