import { BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EmptyState = ({ onCreate }: { onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-fade-in">
    <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center mb-8 shadow-2xl relative">
      <BookOpen className="w-11 h-11 text-primary-foreground" />
      <div className="absolute -inset-2 rounded-3xl gradient-primary opacity-20 blur-xl" />
    </div>
    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
      No study topics yet
    </h2>
    <p className="text-muted-foreground max-w-sm mb-10 text-base">
      Create your first study topic to start tracking your progress and building study streaks.
    </p>
    <Button
      onClick={onCreate}
      size="lg"
      className="gradient-primary text-primary-foreground font-semibold gap-2.5 rounded-2xl px-10 py-6 text-base hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
    >
      <Sparkles className="w-5 h-5" />
      Create Your First Topic
    </Button>
  </div>
);
