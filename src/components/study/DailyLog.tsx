import { Topic, useStudy } from '@/contexts/StudyContext';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export const DailyLog = ({ topic }: { topic: Topic }) => {
  const { toggleSubtopic } = useStudy();

  return (
    <div className="glass-card-elevated rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Daily Log</h3>
      <div className="space-y-3">
        {topic.days.map((day, dayIdx) => {
          const dayCompleted = day.subtopics.every(s => s.completed);
          return (
            <div
              key={day.day}
              className={cn(
                "p-4 rounded-xl border transition-all",
                dayCompleted ? "bg-success/10 border-success/30" : "bg-card border-border"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground flex items-center gap-2">
                  {dayCompleted && <CheckCircle2 className="w-4 h-4 text-success" />}
                  Day {day.day}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {day.hoursStudied.toFixed(1)}h
                </span>
              </div>
              <div className="space-y-1.5">
                {day.subtopics.map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => toggleSubtopic(topic.id, dayIdx, sub.id)}
                    className={cn(
                      "w-full flex items-center gap-2 text-left text-sm py-1.5 px-2 rounded-lg transition-all hover:bg-muted/50",
                      sub.completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                  >
                    {sub.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    )}
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
