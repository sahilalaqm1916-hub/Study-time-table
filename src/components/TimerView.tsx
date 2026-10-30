import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Flag,
  Coffee,
  CheckCircle,
  Timer as TimerIcon,
} from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { StudySessionLog, Subject } from '../types';
import { playChimeSound } from '../utils/audioChime';

interface TimerViewProps {
  language: Language;
  subjects: Subject[];
  studyLogs: StudySessionLog[];
  onLogStudySession: (log: Omit<StudySessionLog, 'id'>) => void;
}

type TimerMode = 'pomodoro' | 'custom' | 'stopwatch';
type PomodoroStage = 'work' | 'short_break' | 'long_break';

export const TimerView: React.FC<TimerViewProps> = ({
  language,
  subjects,
  studyLogs,
  onLogStudySession,
}) => {
  const t = translations[language];

  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.name || 'Physics');
  const [pomodoroStage, setPomodoroStage] = useState<PomodoroStage>('work');
  const [customMinutes, setCustomMinutes] = useState<number>(45);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Time remaining in seconds for countdown modes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [initialDuration, setInitialDuration] = useState<number>(25 * 60);

  // Stopwatch state
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [laps, setLaps] = useState<number[]>([]);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate today's logged study minutes
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLogs = studyLogs.filter((l) => l.date === todayStr);
  const todayMinutesLogged = todayLogs.reduce((acc, l) => acc + l.durationMinutes, 0);

  // Set duration when mode or pomodoro stage changes
  useEffect(() => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      let seconds = 25 * 60;
      if (pomodoroStage === 'short_break') seconds = 5 * 60;
      if (pomodoroStage === 'long_break') seconds = 15 * 60;
      setTimeLeft(seconds);
      setInitialDuration(seconds);
    } else if (mode === 'custom') {
      const seconds = customMinutes * 60;
      setTimeLeft(seconds);
      setInitialDuration(seconds);
    } else if (mode === 'stopwatch') {
      setStopwatchSeconds(0);
      setLaps([]);
    }
  }, [mode, pomodoroStage, customMinutes]);

  // Main ticker interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setStopwatchSeconds((prev) => prev + 1);
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, pomodoroStage, initialDuration, selectedSubject, soundEnabled]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (soundEnabled) {
      playChimeSound();
    }

    // If it was a focus/work session, log it
    if (mode === 'pomodoro' && pomodoroStage === 'work') {
      const minutesSpent = Math.round(initialDuration / 60);
      onLogStudySession({
        date: todayStr,
        subject: selectedSubject,
        durationMinutes: minutesSpent,
        mode: 'pomodoro',
        notes: `Pomodoro 25-min study session completed for ${selectedSubject}`,
        timestamp: Date.now(),
      });
      setPomodoroStage('short_break');
    } else if (mode === 'custom') {
      onLogStudySession({
        date: todayStr,
        subject: selectedSubject,
        durationMinutes: customMinutes,
        mode: 'custom',
        notes: `Custom ${customMinutes}-min focus session for ${selectedSubject}`,
        timestamp: Date.now(),
      });
    }
  };

  const toggleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'stopwatch') {
      if (stopwatchSeconds > 60) {
        // Option to log stopwatch time
        const mins = Math.round(stopwatchSeconds / 60);
        onLogStudySession({
          date: todayStr,
          subject: selectedSubject,
          durationMinutes: mins,
          mode: 'stopwatch',
          notes: `Stopwatch session for ${selectedSubject}`,
          timestamp: Date.now(),
        });
      }
      setStopwatchSeconds(0);
      setLaps([]);
    } else {
      setTimeLeft(initialDuration);
    }
  };

  const handleLap = () => {
    if (mode === 'stopwatch') {
      setLaps((prev) => [stopwatchSeconds, ...prev]);
    }
  };

  // Formatting helpers
  const formatSeconds = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatStopwatch = (sec: number): string => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentDisplayTime = mode === 'stopwatch' ? formatStopwatch(stopwatchSeconds) : formatSeconds(timeLeft);

  // Circular progress calculation
  const progressRatio =
    mode === 'stopwatch'
      ? (stopwatchSeconds % 60) / 60
      : initialDuration > 0
      ? (initialDuration - timeLeft) / initialDuration
      : 0;

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.timer.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'पोमोडोरो, कस्टम टाइमर एवं स्टॉपवॉच के साथ एकाग्रता से अध्ययन करें'
              : 'Maximize deep focus, track exact study minutes per subject'}
          </p>
        </div>

        {/* Audio Chime Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto ${
            soundEnabled
              ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
              : 'border-slate-200 dark:border-slate-800 text-slate-500'
          }`}
          title="Toggle completion sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Chime ON' : 'Chime Muted'}</span>
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 self-center max-w-md mx-auto">
        {(['pomodoro', 'custom', 'stopwatch'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === m
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {m === 'pomodoro' ? t.timer.pomodoro : m === 'custom' ? t.timer.custom : t.timer.stopwatch}
          </button>
        ))}
      </div>

      {/* Pomodoro Stage Sub-tabs (Work vs Short Break vs Long Break) */}
      {mode === 'pomodoro' && (
        <div className="flex items-center justify-center gap-2 text-xs">
          <button
            onClick={() => setPomodoroStage('work')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              pomodoroStage === 'work'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Study Focus (25m)
          </button>
          <button
            onClick={() => setPomodoroStage('short_break')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              pomodoroStage === 'short_break'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => setPomodoroStage('long_break')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-colors ${
              pomodoroStage === 'long_break'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Long Break (15m)
          </button>
        </div>
      )}

      {/* Custom Duration Selector */}
      {mode === 'custom' && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Duration:</span>
          {[15, 30, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              onClick={() => setCustomMinutes(mins)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                customMinutes === mins
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      )}

      {/* Subject Selector for Study Logging */}
      <div className="max-w-xs mx-auto text-center">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5">
          {t.timer.selectSubject}
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold text-center"
        >
          {subjects.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name} ({s.code})
            </option>
          ))}
          <option value="General Study">General / Revision</option>
        </select>
      </div>

      {/* Big Circular Timer Display */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center relative max-w-sm mx-auto">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Background circle */}
          <svg className="w-64 h-64 -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-100 dark:text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
            />
            {/* Animated Progress circle */}
            <circle
              className={
                mode === 'pomodoro' && pomodoroStage !== 'work'
                  ? 'text-emerald-500'
                  : 'text-blue-600 dark:text-blue-400'
              }
              strokeWidth="6"
              strokeDasharray={276.46}
              strokeDashoffset={276.46 * (1 - progressRatio)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="44"
              cx="50"
              cy="50"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100 tracking-tight">
              {currentDisplayTime}
            </span>
            <span className="text-xs uppercase font-semibold text-slate-400 mt-1">
              {mode === 'stopwatch'
                ? 'Stopwatch'
                : pomodoroStage === 'work'
                ? selectedSubject
                : 'Break Time'}
            </span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleStartPause}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
            }`}
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
          </button>

          {mode === 'stopwatch' && (
            <button
              onClick={handleLap}
              disabled={!isRunning}
              className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
              title="Record Lap"
            >
              <Flag className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Laps List for Stopwatch */}
      {mode === 'stopwatch' && laps.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-sm mx-auto">
          <span className="text-xs font-bold uppercase text-slate-400 mb-2 block">
            Lap Records
          </span>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {laps.map((lapSec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs font-mono py-1 border-b border-slate-100 dark:border-slate-800"
              >
                <span className="text-slate-400">Lap {laps.length - idx}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {formatStopwatch(lapSec)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Logged Summary & Recent Logs */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t.timer.studyTimeLogged}
            </h3>
            <p className="text-xs text-slate-500">
              {Math.floor(todayMinutesLogged / 60)}h {todayMinutesLogged % 60}m recorded today
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <TimerIcon className="w-5 h-5" />
          </div>
        </div>

        {todayLogs.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            No focus sessions logged yet today. Complete a session to start tracking!
          </p>
        ) : (
          <div className="space-y-2 pt-2">
            {todayLogs.slice(-4).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {log.subject}
                  </span>
                  <span className="text-slate-400 ml-2 capitalize">({log.mode})</span>
                  {log.notes && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{log.notes}</p>
                  )}
                </div>
                <span className="font-mono tabular-nums font-bold text-blue-600 dark:text-blue-400">
                  +{log.durationMinutes} min
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
