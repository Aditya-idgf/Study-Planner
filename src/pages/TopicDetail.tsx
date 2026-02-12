import { useParams, useNavigate } from 'react-router-dom';
import { useStudy } from '@/contexts/StudyContext';
import { AppLayout } from '@/components/study/AppLayout';
import { StudyTimer } from '@/components/study/StudyTimer';
import { TopicCharts } from '@/components/study/TopicCharts';
import { DailyLog } from '@/components/study/DailyLog';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

const DIFFICULTY_BADGES: Record<string, string> = {
  easy: 'bg-success/15 text-success',
  medium: 'bg-warning/15 text-warning-foreground',
  hard: 'bg-destructive/15 text-destructive',
};

const TopicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { topics } = useStudy();
  const topic = topics.find(t => t.id === id);

  if (!topic) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground mb-4">Topic not found</p>
          <button onClick={() => navigate('/')} className="text-primary hover:underline">Go back</button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{topic.name}</h1>
            <span className={cn("text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full", DIFFICULTY_BADGES[topic.difficulty])}>
              {topic.difficulty}
            </span>
          </div>
        </div>

        {/* Timer */}
        <StudyTimer topicId={topic.id} />

        {/* Charts */}
        <TopicCharts topic={topic} />

        {/* Daily Log */}
        <DailyLog topic={topic} />
      </div>
    </AppLayout>
  );
};

export default TopicDetail;
