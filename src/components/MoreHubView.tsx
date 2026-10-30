import React from 'react';
import {
  BookOpen,
  ListTodo,
  RotateCcw,
  FileText,
  Award,
  TrendingUp,
  Calendar,
  Settings,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { AppState } from '../utils/storage';

interface MoreHubViewProps {
  language: Language;
  state: AppState;
  onNavigateSubView: (view: string) => void;
}

export const MoreHubView: React.FC<MoreHubViewProps> = ({
  language,
  state,
  onNavigateSubView,
}) => {
  const t = translations[language];

  const pendingHw = state.homework.filter((h) => !h.completed).length;
  const dueRevisions = state.revisionSchedule.filter((r) => !r.completed).length;
  const totalNotes = state.notes.length;
  const totalTests = state.testResults.length;

  const menuItems = [
    {
      id: 'subjects',
      title: t.menuSections.subjects,
      desc: 'Physics, Chemistry, Maths, Hindi & English syllabi',
      icon: BookOpen,
      color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
      badge: `${state.subjects.length} Subjects`,
    },
    {
      id: 'homework',
      title: t.menuSections.homework,
      desc: 'Coaching homework, school assignments & due dates',
      icon: ListTodo,
      color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
      badge: pendingHw > 0 ? `${pendingHw} Pending` : 'All Done',
    },
    {
      id: 'revision',
      title: t.menuSections.revision,
      desc: '1st (Day 1), 2nd (Day 7), 3rd (Day 21) spaced repetition',
      icon: RotateCcw,
      color: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
      badge: dueRevisions > 0 ? `${dueRevisions} Due` : 'Clear',
    },
    {
      id: 'notes',
      title: t.menuSections.notes,
      desc: 'Important formulas, derivations & bookmark repository',
      icon: FileText,
      color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
      badge: `${totalNotes} Saved`,
    },
    {
      id: 'tests',
      title: t.menuSections.tests,
      desc: 'Exam score cards, percentages & weak subject identification',
      icon: Award,
      color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
      badge: `${totalTests} Logged`,
    },
    {
      id: 'analytics',
      title: t.menuSections.analytics,
      desc: '7-day study hours bar chart, subject split & streak',
      icon: TrendingUp,
      color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
      badge: `${state.profile.streakCount}d Streak`,
    },
    {
      id: 'calendar',
      title: t.menuSections.calendar,
      desc: 'Monthly view of study sessions, exams & homework',
      icon: Calendar,
      color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
      badge: 'Monthly View',
    },
    {
      id: 'settings',
      title: t.menuSections.profile,
      desc: 'Student profile, board targets, JSON backup & reset',
      icon: Settings,
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
      badge: 'Profile & App',
    },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          All Features & Academics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Quick access to all study management tools, formula sheets & reports
        </p>
      </div>

      {/* Grid of Menu Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigateSubView(item.id)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 flex items-center justify-between gap-3 text-left transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md hidden sm:inline">
                  {item.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
