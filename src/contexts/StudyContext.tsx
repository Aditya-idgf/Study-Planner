import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Subtopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface StudyDay {
  day: number;
  subtopics: Subtopic[];
  hoursStudied: number;
  completed: boolean;
  date?: string;
}

export interface Topic {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  days: StudyDay[];
  createdAt: string;
  totalHoursStudied: number;
  streak: number;
  lastStudiedDate?: string;
}

export interface TimerState {
  topicId: string | null;
  isRunning: boolean;
  elapsed: number; // seconds
}

interface StudyContextType {
  topics: Topic[];
  timer: TimerState;
  createTopic: (name: string, difficulty: Topic['difficulty'], days: { subtopics: string[] }[]) => void;
  deleteTopic: (id: string) => void;
  toggleSubtopic: (topicId: string, dayIndex: number, subtopicId: string) => void;
  logHours: (topicId: string, dayIndex: number, hours: number) => void;
  startTimer: (topicId: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  getTopicCompletion: (topic: Topic) => number;
  getStudyHeatmap: () => Record<string, number>;
  getTotalStreak: () => number;
}

const StudyContext = createContext<StudyContextType | null>(null);

const STORAGE_KEY = 'ai-study-planner-data';
const TIMER_KEY = 'ai-study-planner-timer';

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [topics, setTopics] = useState<Topic[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [timer, setTimer] = useState<TimerState>(() => {
    const saved = localStorage.getItem(TIMER_KEY);
    return saved ? JSON.parse(saved) : { topicId: null, isRunning: false, elapsed: 0 };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
  }, [topics]);

  useEffect(() => {
    localStorage.setItem(TIMER_KEY, JSON.stringify(timer));
  }, [timer]);

  // Timer tick
  useEffect(() => {
    if (!timer.isRunning) return;
    const interval = setInterval(() => {
      setTimer(prev => ({ ...prev, elapsed: prev.elapsed + 1 }));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer.isRunning]);

  const createTopic = useCallback((name: string, difficulty: Topic['difficulty'], days: { subtopics: string[] }[]) => {
    const topic: Topic = {
      id: crypto.randomUUID(),
      name,
      difficulty,
      days: days.map((d, i) => ({
        day: i + 1,
        subtopics: d.subtopics.map(s => ({
          id: crypto.randomUUID(),
          name: s,
          completed: false,
        })),
        hoursStudied: 0,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
      totalHoursStudied: 0,
      streak: 0,
    };
    setTopics(prev => [...prev, topic]);
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setTopics(prev => prev.filter(t => t.id !== id));
    setTimer(prev => prev.topicId === id ? { topicId: null, isRunning: false, elapsed: 0 } : prev);
  }, []);

  const toggleSubtopic = useCallback((topicId: string, dayIndex: number, subtopicId: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t;
      const days = t.days.map((d, i) => {
        if (i !== dayIndex) return d;
        const subtopics = d.subtopics.map(s =>
          s.id === subtopicId ? { ...s, completed: !s.completed } : s
        );
        return { ...d, subtopics, completed: subtopics.every(s => s.completed) };
      });
      return { ...t, days, lastStudiedDate: new Date().toISOString().split('T')[0] };
    }));
  }, []);

  const logHours = useCallback((topicId: string, dayIndex: number, hours: number) => {
    setTopics(prev => prev.map(t => {
      if (t.id !== topicId) return t;
      const days = t.days.map((d, i) =>
        i === dayIndex ? { ...d, hoursStudied: d.hoursStudied + hours, date: new Date().toISOString().split('T')[0] } : d
      );
      return { ...t, days, totalHoursStudied: t.totalHoursStudied + hours, lastStudiedDate: new Date().toISOString().split('T')[0] };
    }));
  }, []);

  const startTimer = useCallback((topicId: string) => {
    setTimer({ topicId, isRunning: true, elapsed: timer.topicId === topicId ? timer.elapsed : 0 });
  }, [timer]);

  const pauseTimer = useCallback(() => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    // Log hours before reset
    if (timer.topicId && timer.elapsed > 0) {
      const hours = Math.round((timer.elapsed / 3600) * 100) / 100;
      if (hours > 0) {
        const topic = topics.find(t => t.id === timer.topicId);
        if (topic) {
          const activeDayIdx = topic.days.findIndex(d => !d.completed);
          if (activeDayIdx >= 0) {
            logHours(timer.topicId, activeDayIdx, hours);
          }
        }
      }
    }
    setTimer({ topicId: null, isRunning: false, elapsed: 0 });
  }, [timer, topics, logHours]);

  const getTopicCompletion = useCallback((topic: Topic): number => {
    const total = topic.days.reduce((sum, d) => sum + d.subtopics.length, 0);
    if (total === 0) return 0;
    const done = topic.days.reduce((sum, d) => sum + d.subtopics.filter(s => s.completed).length, 0);
    return Math.round((done / total) * 100);
  }, []);

  const getStudyHeatmap = useCallback((): Record<string, number> => {
    const map: Record<string, number> = {};
    topics.forEach(t => {
      t.days.forEach(d => {
        if (d.date && d.hoursStudied > 0) {
          map[d.date] = (map[d.date] || 0) + d.hoursStudied;
        }
      });
    });
    return map;
  }, [topics]);

  const getTotalStreak = useCallback((): number => {
    const allDates = new Set<string>();
    topics.forEach(t => {
      t.days.forEach(d => {
        if (d.date && d.hoursStudied > 0) allDates.add(d.date);
      });
    });
    if (allDates.size === 0) return 0;
    
    const sorted = Array.from(allDates).sort().reverse();
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sorted.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().split('T')[0];
      if (sorted[i] === expectedStr) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [topics]);

  return (
    <StudyContext.Provider value={{
      topics, timer, createTopic, deleteTopic, toggleSubtopic,
      logHours, startTimer, pauseTimer, resetTimer,
      getTopicCompletion, getStudyHeatmap, getTotalStreak,
    }}>
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used within StudyProvider');
  return ctx;
};
