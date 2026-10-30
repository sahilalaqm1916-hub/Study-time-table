import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Timer,
  GraduationCap,
  ListTodo,
  FileText,
  RotateCw,
  Flame,
} from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { AppState } from '../utils/storage';
import {
  getTodayDayName,
  getCurrentTimeMinutes,
  findActiveAndUpcomingSession,
  formatTime12,
  calculateDailyStudyHours,
  timeToMinutes,
  MOTIVATIONAL_QUOTES,
} from '../utils/timetableHelper';
import { MainTab } from './BottomNav';

interface DashboardViewProps {
  state: AppState;
  language: Language;
  onNavigateTab: (tab: MainTab) => void;
  onNavigateSubView: (viewName: string) => void;
  onToggleSessionComplete: (sessionId: string) => void;
  onRescheduleSession: (sessionId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  language,
  onNavigateTab,
  onNavigateSubView,
  onToggleSessionComplete,
  onRescheduleSession,
}) => {
  const t = translations[language];
  const todayDay = getTodayDayName();
  const [currentMinutes, setCurrentMinutes] = useState(getCurrentTimeMinutes());
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Update clock minutes every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinutes(getCurrentTimeMinutes());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const todaySessions = state.timetable
    .filter((s) => s.day === todayDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const completedCount = todaySessions.filter((s) => s.completed).length;
  const pendingCount = todaySessions.filter((s) => !s.completed).length;
  const totalCount = todaySessions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const todayStudyHours = calculateDailyStudyHours(state.timetable, todayDay);

  const { activeSession, upcomingSession } = findActiveAndUpcomingSession(
    state.timetable,
    todayDay,
    currentMinutes
  );

  // Detect missed tasks: past start/end time today and not marked completed
  const missedTasks = todaySessions.filter((s) => {
    const endMin = timeToMinutes(s.endTime);
    return !s.completed && endMin < currentMinutes && s.category !== 'sleep';
  });

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Welcome & Student Hero Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 text-blue-100 text-xs uppercase tracking-wider font-semibold">
            <span>{t.days[todayDay]}</span>
            <span>·</span>
            <span>Class {state.profile.classLevel} ({state.profile.board})</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
            {language === 'hi' ? `नमस्ते, ${state.profile.name}` : `Welcome back, ${state.profile.name}!`}
          </h2>
          <p className="text-sm text-blue-100/90 mt-0.5">
            {language === 'hi'
              ? `आज का लक्ष्य: ${state.profile.dailyStudyTargetHours} घंटे अध्ययन · लक्ष्य: ${state.profile.examGoal}`
              : `Goal: ${state.profile.dailyStudyTargetHours}h study today · Focus: ${state.profile.examGoal}`}
          </p>
        </div>

        {/* Big circular progress indicator */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 self-start sm:self-auto shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-white"
                strokeDasharray={`${progressPercent}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute font-mono font-bold text-sm tabular-nums">
              {progressPercent}%
            </span>
          </div>
          <div className="text-left">
            <div className="text-xs text-blue-200 uppercase font-semibold">
              {t.dashboard.dailyProgress}
            </div>
            <div className="text-sm font-bold">
              {completedCount} / {totalCount} {language === 'hi' ? 'टास्क पूर्ण' : 'tasks done'}
            </div>
          </div>
        </div>
      </div>

      {/* Missed Tasks Alert Banner */}
      {missedTasks.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-xs sm:text-sm font-medium truncate">
              {language === 'hi'
                ? `आपके ${missedTasks.length} अध्ययन टास्क छूट गए हैं!`
                : `You have ${missedTasks.length} missed study tasks today!`}
            </div>
          </div>
          <button
            onClick={() => onRescheduleSession(missedTasks[0].id)}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold whitespace-nowrap transition-colors"
          >
            {t.timetable.reschedule}
          </button>
        </div>
      )}

      {/* KPI Cards: Study Hours & Tasks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {t.dashboard.studyHours}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {todayStudyHours}h
            </span>
            <span className="text-xs text-slate-500 font-mono">
              / {state.profile.dailyStudyTargetHours}h
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (todayStudyHours / (state.profile.dailyStudyTargetHours || 8)) * 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {t.dashboard.tasksDone}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
              {completedCount}
            </span>
            <span className="text-xs text-slate-500">completed</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{progressPercent}% accomplished</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            {t.dashboard.tasksPending}
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
              {pendingCount}
            </span>
            <span className="text-xs text-slate-500">remaining</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {totalCount} total scheduled
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
            Study Streak
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-mono tabular-nums text-orange-600 dark:text-orange-400">
              {state.profile.streakCount}
            </span>
            <span className="text-xs text-slate-500">days active</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-orange-600 dark:text-orange-400 font-medium">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>Consistent learning!</span>
          </div>
        </div>
      </div>

      {/* Active Session (Happening Now) & Upcoming Next Task */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Session */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-500/40 dark:border-blue-500/30 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              <span>{t.dashboard.activeNow}</span>
            </div>
            {activeSession && (
              <span className="font-mono tabular-nums">
                {formatTime12(activeSession.startTime)} - {formatTime12(activeSession.endTime)}
              </span>
            )}
          </div>

          {activeSession ? (
            <div className="mt-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {activeSession.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="font-medium text-blue-600 dark:text-blue-400">{activeSession.subject}</span>
                {activeSession.chapter && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{activeSession.chapter}</span>
                  </>
                )}
                {activeSession.topic && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="italic">{activeSession.topic}</span>
                  </>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onToggleSessionComplete(activeSession.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    activeSession.completed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{activeSession.completed ? t.timetable.completed : t.timetable.markComplete}</span>
                </button>
                <button
                  onClick={() => onNavigateTab('timer')}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Timer className="w-4 h-4" />
                  <span>{t.dashboard.startPomodoro}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {language === 'hi'
                ? 'अभी कोई सेशन सक्रिय नहीं है। आप आराम कर सकते हैं या स्व-अध्ययन शुरू कर सकते हैं।'
                : 'No session actively ongoing at this minute. Free time or self-study.'}
            </div>
          )}
        </div>

        {/* Next Up Session */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <span>{t.dashboard.upcomingTask}</span>
            {upcomingSession && (
              <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                {formatTime12(upcomingSession.startTime)}
              </span>
            )}
          </div>

          {upcomingSession ? (
            <div className="mt-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {upcomingSession.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">{upcomingSession.subject}</span>
                {upcomingSession.chapter && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{upcomingSession.chapter}</span>
                  </>
                )}
              </div>
              <div className="mt-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {t.categories[upcomingSession.category]}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {t.dashboard.noUpcoming}
            </div>
          )}
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t.dashboard.quoteTitle}</span>
          </div>
          <button
            onClick={nextQuote}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Next Quote"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="mt-2 text-sm sm:text-base italic text-slate-800 dark:text-slate-200 font-medium">
          &ldquo;{language === 'hi' ? currentQuote.hi : currentQuote.quote}&rdquo;
        </p>
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 text-right">
          — {currentQuote.author}
        </div>
      </div>

      {/* Quick Access Tools */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
          {t.dashboard.quickActions}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          <button
            onClick={() => onNavigateTab('timetable')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 flex flex-col items-center justify-center text-center gap-1.5 transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
              {t.tabs.timetable}
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('timer')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 flex flex-col items-center justify-center text-center gap-1.5 transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Timer className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
              {t.tabs.timer}
            </span>
          </button>

          <button
            onClick={() => onNavigateTab('exams')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 flex flex-col items-center justify-center text-center gap-1.5 transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
              {t.dashboard.jeePrep}
            </span>
          </button>

          <button
            onClick={() => onNavigateSubView('homework')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 flex flex-col items-center justify-center text-center gap-1.5 transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ListTodo className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
              {t.dashboard.viewHomework}
            </span>
          </button>

          <button
            onClick={() => onNavigateSubView('notes')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-400 flex flex-col items-center justify-center text-center gap-1.5 transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
              {t.dashboard.notes}
            </span>
          </button>

          <button
            onClick={() => onNavigateSubView('subjects')}
            className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 flex flex-col items-center justify-center text-center gap-1.5 transition-colors group shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate w-full">
              {language === 'hi' ? 'विषय' : 'Subjects'}
            </span>
          </button>
        </div>
      </div>

      {/* Today's Full Schedule Timeline */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              {t.dashboard.todaySchedule}
            </h3>
            <p className="text-xs text-slate-500">
              {t.days[todayDay]} · {todaySessions.length} total sessions
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('timetable')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>{language === 'hi' ? 'पूरा टाइमटेबल' : 'View Full Week'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todaySessions.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            {t.timetable.noSessions}
          </div>
        ) : (
          <div className="space-y-2.5">
            {todaySessions.map((session) => {
              const isActive = activeSession?.id === session.id;
              const isPast = timeToMinutes(session.endTime) < currentMinutes;
              const isMissed = isPast && !session.completed && session.category !== 'sleep';

              return (
                <div
                  key={session.id}
                  className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    isActive
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500 shadow-sm'
                      : isMissed
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
                      : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onToggleSessionComplete(session.id)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 shrink-0"
                      title={session.completed ? 'Mark pending' : 'Mark done'}
                    >
                      {session.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-blue-500" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-semibold truncate ${
                            session.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {session.title}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                            ● Now
                          </span>
                        )}
                        {isMissed && (
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                            (Missed)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {session.subject}
                        </span>
                        {session.chapter && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="truncate">{session.chapter}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="text-[11px] font-normal text-slate-400">
                          {t.categories[session.category]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                      {formatTime12(session.startTime)}
                    </div>
                    <div className="text-[11px] font-mono tabular-nums text-slate-400">
                      {formatTime12(session.endTime)}
                    </div>
                    {isMissed && (
                      <button
                        onClick={() => onRescheduleSession(session.id)}
                        className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                      >
                        Reschedule
                      </button>
                    )}
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
