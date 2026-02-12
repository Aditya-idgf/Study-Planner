import { LayoutDashboard, BarChart3, BookOpen, Flame, X } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useStudy } from '@/contexts/StudyContext';
import { cn } from '@/lib/utils';

interface StudySidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
];

export const StudySidebar = ({ open, onClose }: StudySidebarProps) => {
  const location = useLocation();
  const { getTotalStreak, topics } = useStudy();
  const streak = getTotalStreak();

  return (
    <>
      {/* Overlay - mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col overflow-hidden transition-all duration-300 ease-out bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
          open
            ? "translate-x-0 w-72 shadow-2xl"
            : "-translate-x-full w-0 lg:w-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">
                StudyPlan
              </h1>
              <p className="text-xs text-primary-foreground/70">AI Study Planner</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-primary-foreground/70 hover:text-primary-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold text-primary-foreground">{streak} day streak!</span>
            </div>
            <p className="text-xs text-primary-foreground/60 mt-1">Keep going strong 💪</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-4 mt-6 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary-foreground text-primary shadow-md"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer stats */}
        <div className="p-6 pt-2">
          <div className="p-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20">
            <p className="text-xs text-primary-foreground/60 uppercase tracking-wider font-medium">Topics</p>
            <p className="text-2xl font-bold text-primary-foreground mt-1">{topics.length}</p>
          </div>
        </div>
      </aside>
    </>
  );
};
