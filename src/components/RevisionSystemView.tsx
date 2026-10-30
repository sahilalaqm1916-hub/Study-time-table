import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Calendar,
  Sparkles,
  X,
  Clock,
} from 'lucide-react';
import { RevisionScheduleItem, Subject } from '../types';
import { Language, translations } from '../utils/translations';

interface RevisionSystemViewProps {
  language: Language;
  revisionItems: RevisionScheduleItem[];
  subjects: Subject[];
  onAddRevisionSchedule: (item: Omit<RevisionScheduleItem, 'id'>) => void;
  onMarkRevised: (id: string) => void;
}

export const RevisionSystemView: React.FC<RevisionSystemViewProps> = ({
  language,
  revisionItems,
  subjects,
  onAddRevisionSchedule,
  onMarkRevised,
}) => {
  const t = translations[language];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [isWeakTopic, setIsWeakTopic] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Group items
  const dueToday = revisionItems.filter((r) => !r.completed && r.scheduledDate <= todayStr);
  const upcoming = revisionItems.filter((r) => !r.completed && r.scheduledDate > todayStr);
  const completed = revisionItems.filter((r) => r.completed);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chapter.trim()) return;

    // Calculate scheduled date based on stage:
    // Stage 1: +1 day
    // Stage 2: +7 days
    // Stage 3: +21 days
    let daysToAdd = 1;
    if (stage === 2) daysToAdd = 7;
    if (stage === 3) daysToAdd = 21;

    const scheduledDate = new Date(Date.now() + daysToAdd * 86400000)
      .toISOString()
      .split('T')[0];

    onAddRevisionSchedule({
      subject,
      chapter: chapter.trim(),
      stage,
      scheduledDate,
      completed: false,
      isWeakTopic,
    });

    setChapter('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.revision.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.revision.subtitle}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Revision</span>
        </button>
      </div>

      {/* Spaced Interval Concept Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>{t.revision.rev1}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            24 hours after learning. Stops the initial Ebbinghaus forgetting curve drop.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>{t.revision.rev2}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            7 days later. Solidifies formulas, derivations and reaction mechanisms.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>{t.revision.rev3}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            21 days later. Converts understanding into permanent long-term memory.
          </p>
        </div>
      </div>

      {/* Due Today Priority Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-500/40 dark:border-amber-500/30 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>{t.revision.dueForRevision} ({dueToday.length})</span>
          </div>
          <span className="text-xs text-slate-400">Action Required</span>
        </div>

        {dueToday.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">
            All caught up! No spaced revisions due today. Excellent retention work.
          </p>
        ) : (
          <div className="space-y-2.5">
            {dueToday.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.subject}
                    </span>
                    <span aria-hidden="true" className="text-slate-400">·</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      {item.chapter}
                    </span>
                    {item.isWeakTopic && (
                      <span className="text-[10px] font-semibold text-rose-600">
                        (Weak Topic)
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                    Stage {item.stage} Spaced Revision · Due today ({item.scheduledDate})
                  </div>
                </div>

                <button
                  onClick={() => onMarkRevised(item.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.revision.markRevised}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Revisions */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          Upcoming Scheduled Revisions ({upcoming.length})
        </h3>

        {upcoming.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            No upcoming revisions scheduled. Tap &quot;Schedule Revision&quot; to queue chapters.
          </p>
        ) : (
          <div className="space-y-2">
            {upcoming.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.subject}</span>
                  <span className="mx-2 text-slate-300">·</span>
                  <span className="text-slate-600 dark:text-slate-400">{item.chapter}</span>
                  {item.isWeakTopic && (
                    <span className="ml-2 text-rose-500 font-semibold">(Weak)</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500">{item.scheduledDate}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold">
                    R{item.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Revision Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Queue Spaced Revision
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chapter / Topic Name *
                </label>
                <input
                  type="text"
                  required
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Current Electricity, Aldehydes"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Stage Interval
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(Number(e.target.value) as 1 | 2 | 3)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value={1}>Stage 1 (+1 Day)</option>
                  <option value={2}>Stage 2 (+7 Days)</option>
                  <option value={3}>Stage 3 (+21 Days)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="weak"
                  checked={isWeakTopic}
                  onChange={(e) => setIsWeakTopic(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="weak" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Flag as weak topic (extra focus required)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
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
