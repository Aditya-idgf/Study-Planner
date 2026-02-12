import { useStudy } from '@/contexts/StudyContext';
import { cn } from '@/lib/utils';

export const HeatmapTracker = () => {
  const { getStudyHeatmap } = useStudy();
  const heatmap = getStudyHeatmap();

  const today = new Date();
  const weeks: string[][] = [];
  for (let w = 11; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      week.push(date.toISOString().split('T')[0]);
    }
    weeks.push(week);
  }

  const getIntensity = (hours: number) => {
    if (hours === 0) return 'bg-muted';
    if (hours < 1) return 'bg-primary/25';
    if (hours < 2) return 'bg-primary/50';
    if (hours < 4) return 'bg-primary/75';
    return 'bg-primary';
  };

  return (
    <div className="glass-card-elevated rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Study Heatmap</h3>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map(date => (
              <div
                key={date}
                title={`${date}: ${(heatmap[date] || 0).toFixed(1)}h`}
                className={cn(
                  "w-3.5 h-3.5 rounded-sm transition-colors",
                  getIntensity(heatmap[date] || 0)
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-primary/25" />
          <div className="w-3 h-3 rounded-sm bg-primary/50" />
          <div className="w-3 h-3 rounded-sm bg-primary/75" />
          <div className="w-3 h-3 rounded-sm bg-primary" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
};
