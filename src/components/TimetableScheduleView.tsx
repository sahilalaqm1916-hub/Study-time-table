import React, { useState } from 'react';
import {
  Plus,
  Clock,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Printer,
  Calendar,
  X,
  RefreshCw,
} from 'lucide-react';
import { DayOfWeek, TimetableSession, ActivityCategory } from '../types';
import { Language, translations } from '../utils/translations';
import {
  DAYS_OF_WEEK,
  getTodayDayName,
  getCurrentTimeMinutes,
  isSessionActiveNow,
  formatTime12,
  timeToMinutes,
  detectConflicts,
  calculateDailyStudyHours,
} from '../utils/timetableHelper';

interface TimetableScheduleViewProps {
  sessions: TimetableSession[];
  language: Language;
  onAddSession: (session: Omit<TimetableSession, 'id'>) => void;
  onUpdateSession: (session: TimetableSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onToggleComplete: (sessionId: string) => void;
  reschedulingSessionId: string | null;
  onClearRescheduling: () => void;
}

export const TimetableScheduleView: React.FC<TimetableScheduleViewProps> = ({
  sessions,
  language,
  onAddSession,
  onUpdateSession,
  onDeleteSession,
  onToggleComplete,
  reschedulingSessionId,
  onClearRescheduling,
}) => {
  const t = translations[language];
  const todayDay = getTodayDayName();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayDay);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<TimetableSession | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('Physics');
  const [formChapter, setFormChapter] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formStartTime, setFormStartTime] = useState('06:00');
  const [formEndTime, setFormEndTime] = useState('07:30');
  const [formCategory, setFormCategory] = useState<ActivityCategory>('home_study');
  const [formNotes, setFormNotes] = useState('');

  const currentMinutes = getCurrentTimeMinutes();
  const conflictsMap = detectConflicts(sessions);
  const dailyStudyHours = calculateDailyStudyHours(sessions, selectedDay);
  const isOverScheduled = dailyStudyHours > 10;

  // Filter sessions for selected day
  const daySessions = sessions
    .filter((s) => s.day === selectedDay)
    .filter((s) => (categoryFilter === 'all' ? true : s.category === categoryFilter))
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  const openAddModal = () => {
    setEditingSession(null);
    setFormTitle('');
    setFormSubject('Physics');
    setFormChapter('');
    setFormTopic('');
    setFormStartTime('16:00');
    setFormEndTime('17:30');
    setFormCategory('home_study');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (session: TimetableSession) => {
    setEditingSession(session);
    setFormTitle(session.title);
    setFormSubject(session.subject);
    setFormChapter(session.chapter || '');
    setFormTopic(session.topic || '');
    setFormStartTime(session.startTime);
    setFormEndTime(session.endTime);
    setFormCategory(session.category);
    setFormNotes(session.notes || '');
    setIsModalOpen(true);
  };

  // If prompted from reschedule button elsewhere
  React.useEffect(() => {
    if (reschedulingSessionId) {
      const found = sessions.find((s) => s.id === reschedulingSessionId);
      if (found) {
        openEditModal(found);
      }
    }
  }, [reschedulingSessionId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingSession) {
      onUpdateSession({
        ...editingSession,
        title: formTitle.trim(),
        subject: formSubject,
        chapter: formChapter.trim(),
        topic: formTopic.trim(),
        startTime: formStartTime,
        endTime: formEndTime,
        category: formCategory,
        notes: formNotes.trim(),
      });
    } else {
      onAddSession({
        day: selectedDay,
        title: formTitle.trim(),
        subject: formSubject,
        chapter: formChapter.trim(),
        topic: formTopic.trim(),
        startTime: formStartTime,
        endTime: formEndTime,
        category: formCategory,
        completed: false,
        notes: formNotes.trim(),
      });
    }
    setIsModalOpen(false);
    onClearRescheduling();
  };

  const categoriesList: ActivityCategory[] = [
    'home_study',
    'coaching',
    'school',
    'revision',
    'test',
    'break',
    'lunch',
    'dinner',
    'sleep',
  ];

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.timetable.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.timetable.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors no-print"
            title="Print / Save PDF Timetable"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{t.timetable.exportPdf}</span>
          </button>
          <button
            onClick={openAddModal}
            className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.timetable.addNew}</span>
          </button>
        </div>
      </div>

      {/* Warnings bar */}
      <div className="space-y-2">
        {conflictsMap.size > 0 && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              {t.timetable.overlapWarning} ({conflictsMap.size} session{conflictsMap.size > 1 ? 's' : ''} conflicting)
            </span>
          </div>
        )}

        {isOverScheduled && (
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t.timetable.heavyScheduleWarning}</span>
          </div>
        )}
      </div>

      {/* Day Selector (Mon - Sun) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDay === day;
          const isToday = todayDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex flex-col items-center min-w-[62px] ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80'
              }`}
            >
              <span>{t.daysShort[day]}</span>
              {isToday && (
                <span
                  className={`text-[9px] uppercase font-bold mt-0.5 ${
                    isSelected ? 'text-blue-100' : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
            categoryFilter === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          {t.timetable.filterAll}
        </button>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {t.categories[cat]}
          </button>
        ))}
      </div>

      {/* Daily Study Summary Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2">
        <span>
          {t.days[selectedDay]} · {daySessions.length} sessions
        </span>
        <span className="font-mono tabular-nums font-semibold text-blue-600 dark:text-blue-400">
          Total Study: {dailyStudyHours} hours
        </span>
      </div>

      {/* Sessions Timeline Cards */}
      {daySessions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t.timetable.noSessions}
          </p>
          <button
            onClick={openAddModal}
            className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.timetable.addNew}</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {daySessions.map((session) => {
            const isActive = isSessionActiveNow(session, todayDay, currentMinutes) && selectedDay === todayDay;
            const hasConflict = conflictsMap.has(session.id);
            const isPast = selectedDay === todayDay && timeToMinutes(session.endTime) < currentMinutes;
            const isMissed = isPast && !session.completed && session.category !== 'sleep';

            return (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500'
                    : hasConflict
                    ? 'bg-red-50/40 dark:bg-red-950/20 border-red-300 dark:border-red-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Left info & checkbox */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => onToggleComplete(session.id)}
                    className="mt-1 text-slate-400 hover:text-blue-600 shrink-0"
                    title={session.completed ? 'Mark incomplete' : 'Mark completed'}
                  >
                    {session.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-blue-500" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-base font-bold truncate ${
                          session.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {session.title}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                          ● {t.timetable.currentActive}
                        </span>
                      )}
                      {hasConflict && (
                        <span className="text-[10px] font-semibold text-red-600 dark:text-red-400 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Conflict</span>
                        </span>
                      )}
                      {isMissed && (
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          (Missed)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {session.subject}
                      </span>
                      {session.chapter && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{session.chapter}</span>
                        </>
                      )}
                      {session.topic && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="italic">{session.topic}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500">
                        {t.categories[session.category]}
                      </span>
                    </div>

                    {session.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                        {session.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right time & controls */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-xs font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {formatTime12(session.startTime)} – {formatTime12(session.endTime)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {isMissed && (
                      <button
                        onClick={() => openEditModal(session)}
                        className="px-2 py-1 rounded-md text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 flex items-center gap-1"
                        title="Reschedule session"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Reschedule</span>
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(session)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingSession ? t.timetable.editSession : t.timetable.addNew}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  onClearRescheduling();
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              {/* Day selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Day of Week
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {t.days[d]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Physics Numericals, Coaching Class"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Subject & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.common.subject}
                  </label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="School">School</option>
                    <option value="General">General / Routine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.common.category}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ActivityCategory)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    {categoriesList.map((cat) => (
                      <option key={cat} value={cat}>
                        {t.categories[cat]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Chapter & Topic */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.common.chapter} (Optional)
                  </label>
                  <input
                    type="text"
                    value={formChapter}
                    onChange={(e) => setFormChapter(e.target.value)}
                    placeholder="e.g. Electrostatics"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.common.topic} (Optional)
                  </label>
                  <input
                    type="text"
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="e.g. Gauss Law"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Start & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.common.startTime}
                  </label>
                  <input
                    type="time"
                    required
                    value={formStartTime}
                    onChange={(e) => setFormStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.common.endTime}
                  </label>
                  <input
                    type="time"
                    required
                    value={formEndTime}
                    onChange={(e) => setFormEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Personal Notes / Focus Plan
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Key problems to solve or coaching doubts..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    onClearRescheduling();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
