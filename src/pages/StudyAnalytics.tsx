import { useStudy } from '@/contexts/StudyContext';
import { AppLayout } from '@/components/study/AppLayout';
import { HeatmapTracker } from '@/components/study/HeatmapTracker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(256, 67%, 59%)', 'hsl(180, 60%, 48%)', 'hsl(30, 95%, 60%)', 'hsl(340, 75%, 55%)', 'hsl(150, 60%, 45%)'];

const StudyAnalytics = () => {
  const { topics, getTopicCompletion } = useStudy();

  const topicHoursData = topics.map(t => ({
    name: t.name.length > 12 ? t.name.slice(0, 12) + '…' : t.name,
    hours: t.totalHoursStudied,
  }));

  const topicCompletionData = topics.map(t => ({
    name: t.name.length > 12 ? t.name.slice(0, 12) + '…' : t.name,
    value: getTopicCompletion(t),
  }));

  const difficultyData = [
    { name: 'Easy', value: topics.filter(t => t.difficulty === 'easy').length },
    { name: 'Medium', value: topics.filter(t => t.difficulty === 'medium').length },
    { name: 'Hard', value: topics.filter(t => t.difficulty === 'hard').length },
  ].filter(d => d.value > 0);

  const difficultyColors = ['hsl(150, 60%, 45%)', 'hsl(40, 95%, 55%)', 'hsl(0, 72%, 55%)'];

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>

        {topics.length === 0 ? (
          <p className="text-muted-foreground">Create some topics to see analytics here.</p>
        ) : (
          <>
            <HeatmapTracker />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hours by topic */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Hours by Topic</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicHoursData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 90%)" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(240, 5%, 46%)" />
                      <YAxis tick={{ fontSize: 11 }} stroke="hsl(240, 5%, 46%)" />
                      <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="hours" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Difficulty distribution */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Difficulty Distribution</h3>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={difficultyData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0} label={({ name, value }) => `${name} (${value})`}>
                        {difficultyData.map((_, i) => (
                          <Cell key={i} fill={difficultyColors[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Completion by topic */}
              <div className="glass-card rounded-2xl p-5 md:col-span-2">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Completion by Topic</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topicCompletionData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 90%)" />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(240, 5%, 46%)" />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} stroke="hsl(240, 5%, 46%)" width={100} />
                      <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="value" fill={COLORS[1]} radius={[0, 6, 6, 0]} name="Completion %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default StudyAnalytics;
