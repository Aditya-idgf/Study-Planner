import { useState, useEffect } from 'react';
import { StudySidebar } from './StudySidebar';
import { Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return true;
    return false;
  });

  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('study-theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('study-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="flex min-h-screen w-full bg-background gradient-mesh">
      <StudySidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-muted"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </Button>
            <h1 className="text-lg font-bold text-foreground lg:hidden">StudyPlan</h1>
          </div>
          <Button
            onClick={() => setDark(!dark)}
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-muted"
          >
            {dark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-foreground" />}
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
