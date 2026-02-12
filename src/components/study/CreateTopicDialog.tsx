import { useState } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'border-emerald-400 bg-emerald-50 text-emerald-700 data-[active=true]:bg-emerald-500 data-[active=true]:text-white data-[active=true]:border-emerald-500' },
  { value: 'medium', label: 'Medium', color: 'border-amber-400 bg-amber-50 text-amber-700 data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500' },
  { value: 'hard', label: 'Hard', color: 'border-red-400 bg-red-50 text-red-700 data-[active=true]:bg-red-500 data-[active=true]:text-white data-[active=true]:border-red-500' },
];

export const CreateTopicDialog = ({ open, onOpenChange }: CreateTopicDialogProps) => {
  const { createTopic } = useStudy();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [days, setDays] = useState<{ subtopics: string[] }[]>([{ subtopics: [''] }]);

  const addDay = () => setDays(prev => [...prev, { subtopics: [''] }]);
  const removeDay = (i: number) => setDays(prev => prev.filter((_, idx) => idx !== i));

  const addSubtopic = (dayIdx: number) => {
    setDays(prev => prev.map((d, i) =>
      i === dayIdx ? { ...d, subtopics: [...d.subtopics, ''] } : d
    ));
  };

  const updateSubtopic = (dayIdx: number, subIdx: number, value: string) => {
    setDays(prev => prev.map((d, i) =>
      i === dayIdx ? { ...d, subtopics: d.subtopics.map((s, j) => j === subIdx ? value : s) } : d
    ));
  };

  const removeSubtopic = (dayIdx: number, subIdx: number) => {
    setDays(prev => prev.map((d, i) =>
      i === dayIdx ? { ...d, subtopics: d.subtopics.filter((_, j) => j !== subIdx) } : d
    ));
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const cleanDays = days
      .map(d => ({ subtopics: d.subtopics.filter(s => s.trim()) }))
      .filter(d => d.subtopics.length > 0);
    if (cleanDays.length === 0) return;
    createTopic(name.trim(), difficulty, cleanDays);
    setName('');
    setDifficulty('medium');
    setDays([{ subtopics: [''] }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-['Space_Grotesk']">
            <Sparkles className="w-5 h-5 text-primary" />
            Create Study Topic
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Topic Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Linear Algebra, React Hooks..."
              className="h-11"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  data-active={difficulty === opt.value}
                  onClick={() => setDifficulty(opt.value)}
                  className={cn(
                    "flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200",
                    opt.color
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Study Days & Subtopics</label>
            <div className="space-y-3">
              {days.map((day, dayIdx) => (
                <div key={dayIdx} className="p-4 rounded-xl bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">Day {dayIdx + 1}</span>
                    {days.length > 1 && (
                      <button onClick={() => removeDay(dayIdx)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    {day.subtopics.map((sub, subIdx) => (
                      <div key={subIdx} className="flex gap-2">
                        <Input
                          value={sub}
                          onChange={e => updateSubtopic(dayIdx, subIdx, e.target.value)}
                          placeholder={`Subtopic ${subIdx + 1}`}
                          className="h-9 text-sm"
                        />
                        {day.subtopics.length > 1 && (
                          <button onClick={() => removeSubtopic(dayIdx, subIdx)} className="text-muted-foreground hover:text-destructive px-1">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addSubtopic(dayIdx)}
                      className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 mt-1"
                    >
                      <Plus className="w-3 h-3" /> Add subtopic
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={addDay} variant="outline" size="sm" className="mt-2 w-full">
              <Plus className="w-4 h-4 mr-1" /> Add Day
            </Button>
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} className="w-full h-11 gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Create Topic
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
