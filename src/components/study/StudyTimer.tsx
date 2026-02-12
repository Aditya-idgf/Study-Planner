import { Play, Pause, RotateCcw } from 'lucide-react';
import { useStudy } from '@/contexts/StudyContext';
import { Button } from '@/components/ui/button';

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const StudyTimer = ({ topicId }: { topicId: string }) => {
  const { timer, startTimer, pauseTimer, resetTimer } = useStudy();
  const isActive = timer.topicId === topicId;
  const isRunning = isActive && timer.isRunning;
  const elapsed = isActive ? timer.elapsed : 0;

  return (
    <div className="glass-card-elevated rounded-2xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-[0.03]" />
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 relative z-10">Study Timer</h3>
      <div className="text-center relative z-10">
        <div className="text-5xl md:text-7xl font-bold text-foreground tabular-nums tracking-tight mb-8">
          {formatTime(elapsed)}
        </div>
        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <Button
              onClick={() => startTimer(topicId)}
              className="gradient-primary text-primary-foreground rounded-2xl gap-2 px-8 py-5 text-base hover:opacity-90 transition-all hover:scale-105 shadow-lg"
            >
              <Play className="w-5 h-5" /> Start
            </Button>
          ) : (
            <Button
              onClick={pauseTimer}
              variant="outline"
              className="rounded-2xl gap-2 px-8 py-5 text-base border-2 border-accent text-accent hover:bg-accent/10"
            >
              <Pause className="w-5 h-5" /> Pause
            </Button>
          )}
          <Button
            onClick={resetTimer}
            variant="outline"
            className="rounded-2xl gap-2 px-8 py-5 text-base"
            disabled={!isActive || elapsed === 0}
          >
            <RotateCcw className="w-5 h-5" /> Reset & Log
          </Button>
        </div>
        {isActive && elapsed > 0 && (
          <p className="text-xs text-muted-foreground mt-4">
            Resetting will log {(elapsed / 3600).toFixed(2)}h to the current day
          </p>
        )}
      </div>
    </div>
  );
};
