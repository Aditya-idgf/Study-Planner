import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Topic, useStudy } from '@/contexts/StudyContext';
import { Trash2, Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-success/15 text-success border-success/30',
  medium: 'bg-warning/15 text-warning-foreground border-warning/30',
  hard: 'bg-destructive/15 text-destructive border-destructive/30',
};

export const TopicCard = ({ topic }: { topic: Topic }) => {
  const navigate = useNavigate();
  const { getTopicCompletion, deleteTopic } = useStudy();
  const completion = getTopicCompletion(topic);

  const chartData = [
    { name: 'Done', value: completion },
    { name: 'Remaining', value: 100 - completion },
  ];

  return (
    <div
      onClick={() => navigate(`/topic/${topic.id}`)}
      className="group glass-card-elevated rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 hover:border-primary/30 relative overflow-hidden"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full gradient-primary opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-500" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-secondary opacity-[0.05] group-hover:opacity-[0.1] transition-opacity duration-500" />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn("text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border", DIFFICULTY_COLORS[topic.difficulty])}>
              {topic.difficulty}
            </span>
          </div>
          <h3 className="text-lg font-bold text-card-foreground truncate">{topic.name}</h3>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{topic.days.length} days</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{topic.totalHoursStudied.toFixed(1)}h</span>
          </div>
        </div>

        <div className="w-20 h-20 relative flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={22} outerRadius={34} dataKey="value" strokeWidth={0}>
                <Cell fill="hsl(var(--primary))" />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-card-foreground">
            {completion}%
          </span>
        </div>
      </div>

      {/* Delete btn */}
      <button
        onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}
        className="absolute bottom-3 right-3 p-1.5 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Delete topic"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
