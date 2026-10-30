import React from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  BookOpen,
  ListTodo,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { AppState } from '../utils/storage';
import { Language, translations } from '../utils/translations';
import { calculateDailyStudyHours, DAYS_OF_WEEK } from '../utils/timetableHelper';

interface AnalyticsViewProps {
  state: AppState;
  language: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ state, language }) => {
  const t = translations[language];

  // Calculate 7 days study hours (Mon through Sun from timetable + logged study)
  const daysStudy = DAYS_OF_WEEK.map((day) => {
    const timetableHours = calculateDailyStudyHours(state.timetable, day);
    return {
      day,
      short: t.daysShort[day],
      hours: timetableHours,
    };
  });

  const maxHours = Math.max(10, ...daysStudy.map((d) => d.hours));

  // Subject-wise study time distribution from logged sessions
  const subjectDistribution: Record<string, number> = {};
  for (const log of state.studyLogs) {
    subjectDistribution[log.subject] = (subjectDistribution[log.subject] || 0) + log.durationMinutes;
  }
  const totalLoggedMinutes = Object.values(subjectDistribution).reduce((a, b) => a + b, 0) || 1;

  // Chapter completion stats
  let totalChapters = 0;
  let completedChapters = 0;
  for (const sub of state.subjects) {
    for (const c of sub.chapters) {
      totalChapters++;
      if (c.completionPercentage === 100) completedChapters++;
    }
  }
  const chapterRate = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

  // Homework completion stats
  const totalHw = state.homework.length;
  const completedHw = state.homework.filter((h) => h.completed).length;
  const hwRate = totalHw > 0 ? Math.round((completedHw / totalHw) * 100) : 0;

  // Weekly total study hours
  const weeklyTotalHours = daysStudy.reduce((acc, d) => acc + d.hours, 0);

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.analytics.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Weekly study reports, subject distribution & milestone completion rates
        </p>
      </div>

      {/* High-level KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Weekly Hours</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
              {weeklyTotalHours.toFixed(1)}h
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Scheduled this week</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Study Streak</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-orange-600">
              {state.profile.streakCount}
            </span>
            <span className="text-xs text-slate-500">days</span>
          </div>
          <span className="text-[11px] text-orange-600 font-medium mt-1 flex items-center gap-1">
            <Flame className="w-3 h-3 fill-orange-500" />
            <span>Active streak</span>
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Syllabus Covered</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {chapterRate}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {completedChapters}/{totalChapters} chapters done
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Homework Done</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
              {hwRate}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {completedHw}/{totalHw} assignments
          </span>
        </div>
      </div>

      {/* 7-Day Study Hours Bar Chart */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{t.analytics.weeklyTrend}</span>
            </h3>
            <p className="text-xs text-slate-500">Daily study hours breakdown vs 8h target benchmark</p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600">
            Avg: {(weeklyTotalHours / 7).toFixed(1)}h/day
          </span>
        </div>

        <div className="h-52 flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
          {daysStudy.map((d) => {
            const heightPercent = Math.min(100, (d.hours / maxHours) * 100);
            const isTargetMet = d.hours >= (state.profile.dailyStudyTargetHours || 8);

            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[11px] font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300 opacity-90 group-hover:scale-110 transition-transform">
                  {d.hours}h
                </span>
                <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 h-full rounded-t-xl overflow-hidden flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      isTargetMet
                        ? 'bg-blue-600 dark:bg-blue-500'
                        : 'bg-blue-400 dark:bg-blue-700'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {d.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-Wise Time Distribution */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          {t.analytics.subjectBreakdown} (Focus Timer Logs)
        </h3>

        {Object.keys(subjectDistribution).length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            Use the Study Timer to record focus sessions per subject and view distribution charts!
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(subjectDistribution).map(([subName, mins]) => {
              const pct = Math.round((mins / totalLoggedMinutes) * 100);
              const hrs = (mins / 60).toFixed(1);

              return (
                <div key={subName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{subName}</span>
                    <span className="font-mono text-slate-500">
                      {hrs} hrs ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
