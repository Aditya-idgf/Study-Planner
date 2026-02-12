import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Topic, useStudy } from '@/contexts/StudyContext';

export const TopicCharts = ({ topic }: { topic: Topic }) => {
  const { getTopicCompletion } = useStudy();
  const completion = getTopicCompletion(topic);

  const barData = topic.days.map(d => ({
    name: `Day ${d.day}`,
    hours: d.hoursStudied,
  }));

  const lineData = topic.days.map((d, i) => ({
    name: `Day ${d.day}`,
    planned: i + 1,
    actual: topic.days.slice(0, i + 1).filter(x => x.hoursStudied > 0 || x.completed).length,
  }));

  const donutData = [
    { name: 'Completed', value: completion },
    { name: 'Remaining', value: 100 - completion },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="glass-card-elevated rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Hours Studied</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'hsl(var(--card))' }} />
              <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card-elevated rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Days Progress</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', background: 'hsl(var(--card))' }} />
              <Line type="monotone" dataKey="planned" stroke="hsl(var(--muted))" strokeWidth={2} dot={false} name="Planned" />
              <Line type="monotone" dataKey="actual" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ fill: 'hsl(var(--secondary))', r: 3 }} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card-elevated rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Completion</h4>
        <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" strokeWidth={0}>
                <Cell fill="hsl(var(--primary))" />
                <Cell fill="hsl(var(--muted))" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{completion}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
