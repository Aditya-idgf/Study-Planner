import { useState } from 'react';
import { useStudy } from '@/contexts/StudyContext';
import { AppLayout } from '@/components/study/AppLayout';
import { TopicCard } from '@/components/study/TopicCard';
import { CreateTopicDialog } from '@/components/study/CreateTopicDialog';
import { EmptyState } from '@/components/study/EmptyState';
import { HeatmapTracker } from '@/components/study/HeatmapTracker';
import { Plus, Flame, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudyDashboard = () => {
  const { topics, getTotalStreak } = useStudy();
  const [createOpen, setCreateOpen] = useState(false);
  const streak = getTotalStreak();
  const totalHours = topics.reduce((sum, t) => sum + t.totalHoursStudied, 0);
  const avgCompletion = topics.length > 0 ? Math.round(topics.reduce((s, t) => {
    const total = t.days.reduce((a, d) => a + d.subtopics.length, 0);
    const done = t.days.reduce((a, d) => a + d.subtopics.filter(x => x.completed).length, 0);
    return s + (total > 0 ? (done / total) * 100 : 0);
  }, 0) / topics.length) : 0;

  return (
    <AppLayout>
      {topics.length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 pb-24 animate-fade-in">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: BookOpen, label: 'Topics', value: topics.length, color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Clock, label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, color: 'text-secondary', bg: 'bg-secondary/10' },
              { icon: Flame, label: 'Streak', value: `${streak} days`, color: 'text-accent', bg: 'bg-accent/10' },
              { icon: TrendingUp, label: 'Avg Completion', value: `${avgCompletion}%`, color: 'text-primary', bg: 'bg-primary/10' },
            ].map((stat, i) => (
              <div key={i} className="glass-card-elevated rounded-2xl p-4 hover:shadow-xl transition-shadow">
                <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <HeatmapTracker />

          {/* Topics grid */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-3">Your Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map(topic => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      {topics.length > 0 && (
        <Button
          onClick={() => setCreateOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-2xl bg-primary text-primary-foreground shadow-2xl border border-border hover:bg-primary/90 transition-transform hover:scale-110 z-30"
          size="icon"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      <CreateTopicDialog open={createOpen} onOpenChange={setCreateOpen} />
    </AppLayout>
  );
};

export default StudyDashboard;
