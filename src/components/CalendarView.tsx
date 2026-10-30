import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ListTodo,
  Award,
} from 'lucide-react';
import { AppState } from '../utils/storage';
import { Language, translations } from '../utils/translations';
import { formatTime12 } from '../utils/timetableHelper';

interface CalendarViewProps {
  state: AppState;
  language: Language;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ state, language }) => {
  const t = translations[language];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month (0 = Sun, 1 = Mon...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Find events for selected date
  // Tests on selected date
  const selectedTests = state.testResults.filter((r) => r.date === selectedDateStr);
  const selectedMockTests = state.jeeMockTests.filter((m) => m.date === selectedDateStr);
  const selectedHomework = state.homework.filter((h) => h.dueDate === selectedDateStr);
  const selectedRevisions = state.revisionSchedule.filter((r) => r.scheduledDate === selectedDateStr);

  // Determine day of week for selected date
  const selectedDateObj = new Date(selectedDateStr + 'T00:00:00');
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const selectedDayName = dayNames[selectedDateObj.getDay()];
  const selectedDaySessions = state.timetable.filter((s) => s.day === selectedDayName);

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.calendar.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Monthly overview of scheduled study sessions, homework deadlines, and mock tests
        </p>
      </div>

      {/* Calendar Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            <span>
              {monthNames[month]} {year}
            </span>
          </h3>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid cells */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before month start */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 sm:h-20 rounded-xl bg-slate-50/40 dark:bg-slate-800/20" />
          ))}

          {/* Days of month */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDateStr;
            const isToday = dateStr === new Date().toISOString().split('T')[0];

            // Events on this date
            const hasHw = state.homework.some((h) => h.dueDate === dateStr);
            const hasTest = state.testResults.some((t) => t.date === dateStr) || state.jeeMockTests.some((m) => m.date === dateStr);
            const hasRev = state.revisionSchedule.some((r) => r.scheduledDate === dateStr);

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDateStr(dateStr)}
                className={`h-14 sm:h-20 p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 ring-1 ring-blue-600'
                    : isToday
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs font-mono font-bold ${
                      isSelected
                        ? 'text-blue-600 dark:text-blue-400'
                        : isToday
                        ? 'text-amber-600 font-extrabold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  )}
                </div>

                {/* Event dots indicator */}
                <div className="flex items-center gap-1 mt-auto">
                  {hasHw && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Homework Due" />}
                  {hasTest && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Test/Exam" />}
                  {hasRev && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Revision" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details Panel */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {t.calendar.selectedDateEvents}: <span className="font-mono text-blue-600">{selectedDateStr}</span> ({selectedDayName})
          </h3>
          <span className="text-xs text-slate-400">
            {selectedDaySessions.length} regular sessions
          </span>
        </div>

        {/* Tests & Exams on Date */}
        {(selectedTests.length > 0 || selectedMockTests.length > 0) && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Exams & Tests on this Date</span>
            </span>
            {selectedTests.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs flex items-center justify-between"
              >
                <span className="font-bold text-slate-900 dark:text-slate-100">{t.title}</span>
                <span className="font-mono font-bold text-rose-600">{t.percentage}% Score</span>
              </div>
            ))}
            {selectedMockTests.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs flex items-center justify-between"
              >
                <span className="font-bold text-slate-900 dark:text-slate-100">{m.title}</span>
                <span className="font-mono font-bold text-blue-600">
                  {m.physicsScore + m.chemistryScore + m.mathsScore} / {m.maxMarks} Marks
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Homework Due on Date */}
        {selectedHomework.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <ListTodo className="w-3.5 h-3.5" />
              <span>Homework Due</span>
            </span>
            {selectedHomework.map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs flex items-center justify-between"
              >
                <span className="font-bold text-slate-900 dark:text-slate-100">{h.title}</span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold uppercase">{h.priority}</span>
              </div>
            ))}
          </div>
        )}

        {/* Scheduled Timetable Sessions for this Day */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Regular Timetable Sessions ({selectedDayName})</span>
          </span>
          {selectedDaySessions.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No study sessions scheduled for this day of week.</p>
          ) : (
            <div className="space-y-1.5">
              {selectedDaySessions.map((s) => (
                <div
                  key={s.id}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{s.title}</span>
                    <span className="text-slate-400 ml-2">({s.subject})</span>
                  </div>
                  <span className="font-mono text-slate-500">
                    {formatTime12(s.startTime)} - {formatTime12(s.endTime)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
