import React, { useState } from 'react';
import {
  Award,
  Plus,
  Trash2,
  TrendingUp,
  AlertCircle,
  Calendar,
  X,
  CheckCircle,
} from 'lucide-react';
import { TestResultItem, Subject } from '../types';
import { Language, translations } from '../utils/translations';

interface TestExamManagerViewProps {
  language: Language;
  testResults: TestResultItem[];
  subjects: Subject[];
  onAddTestResult: (item: Omit<TestResultItem, 'id' | 'percentage'>) => void;
  onDeleteTestResult: (id: string) => void;
}

export const TestExamManagerView: React.FC<TestExamManagerViewProps> = ({
  language,
  testResults,
  subjects,
  onAddTestResult,
  onDeleteTestResult,
}) => {
  const t = translations[language];
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [marksObtained, setMarksObtained] = useState(75);
  const [totalMarks, setTotalMarks] = useState(100);
  const [weakTopicsStr, setWeakTopicsStr] = useState('');
  const [remarks, setRemarks] = useState('');

  // Performance calculations
  const totalTests = testResults.length;
  const avgPercentage =
    totalTests > 0
      ? Math.round(testResults.reduce((acc, t) => acc + t.percentage, 0) / totalTests)
      : 0;

  // Identify weak subjects by averaging scores per subject
  const subjectScores: Record<string, { totalPct: number; count: number }> = {};
  for (const item of testResults) {
    if (!subjectScores[item.subject]) {
      subjectScores[item.subject] = { totalPct: 0, count: 0 };
    }
    subjectScores[item.subject].totalPct += item.percentage;
    subjectScores[item.subject].count += 1;
  }

  let weakestSubject = 'None';
  let minAvg = 101;
  for (const sub of Object.keys(subjectScores)) {
    const avg = subjectScores[sub].totalPct / subjectScores[sub].count;
    if (avg < minAvg) {
      minAvg = avg;
      weakestSubject = `${sub} (${Math.round(avg)}%)`;
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || totalMarks <= 0) return;

    const weakTopics = weakTopicsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onAddTestResult({
      title: title.trim(),
      subject,
      date,
      marksObtained: Number(marksObtained),
      totalMarks: Number(totalMarks),
      weakTopics,
      remarks: remarks.trim(),
    });

    setTitle('');
    setWeakTopicsStr('');
    setRemarks('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.tests.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log school tests, coaching tests & JEE mock marks with percentage analysis
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.tests.addResult}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {t.tests.totalTests}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
              {totalTests}
            </span>
            <span className="text-xs text-slate-500">recorded</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {t.tests.avgPercentage}
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
              {avgPercentage}%
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            {t.tests.weakAreas}
          </span>
          <div className="mt-1 text-sm font-bold text-rose-600 dark:text-rose-400 truncate">
            {weakestSubject}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Priority focus recommended</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">
            Pass Consistency
          </span>
          <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-600">
            {testResults.filter((t) => t.percentage >= 60).length} / {totalTests}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">&gt;60% distinction marks</span>
        </div>
      </div>

      {/* Visual Performance Trend Chart (Interactive Bars) */}
      {testResults.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Score Trajectory & Percentages</span>
            </h3>
            <span className="text-xs text-slate-400">Benchmark: 75% target</span>
          </div>

          <div className="h-44 flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {testResults.slice(-6).map((item) => (
              <div key={item.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[11px] font-mono tabular-nums font-bold text-slate-700 dark:text-slate-300 opacity-90 group-hover:scale-110 transition-transform">
                  {item.percentage}%
                </span>
                <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 h-full rounded-t-xl overflow-hidden flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      item.percentage >= 80
                        ? 'bg-emerald-500'
                        : item.percentage >= 65
                        ? 'bg-blue-600'
                        : 'bg-amber-500'
                    }`}
                    style={{ height: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 truncate w-full text-center">
                  {item.subject.slice(0, 4)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results History List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          {t.tests.recentTests}
        </h3>

        {testResults.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">
            No test scores recorded yet. Tap &quot;Record Test Score&quot; above to track exams!
          </p>
        ) : (
          <div className="space-y-3">
            {testResults.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      ({item.subject})
                    </span>
                    <span className="text-xs text-slate-400 font-mono">· {item.date}</span>
                  </div>

                  {item.weakTopics.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-1 text-xs text-slate-500">
                      <span className="text-rose-600 font-semibold">Identified Weak Areas:</span>
                      {item.weakTopics.map((w, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px]"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.remarks && (
                    <p className="text-xs text-slate-500 italic mt-1">&ldquo;{item.remarks}&rdquo;</p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                      {item.marksObtained} / {item.totalMarks}
                    </div>
                    <div
                      className={`text-xs font-bold font-mono ${
                        item.percentage >= 80
                          ? 'text-emerald-600'
                          : item.percentage >= 60
                          ? 'text-blue-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {item.percentage}% ({item.percentage >= 80 ? 'Grade A' : item.percentage >= 60 ? 'Grade B' : 'Grade C'})
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTestResult(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Test Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.tests.addResult}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Test / Exam Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekly Coaching Physics Test, Mid-term Math"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marks Obtained
                  </label>
                  <input
                    type="number"
                    required
                    value={marksObtained}
                    onChange={(e) => setMarksObtained(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Total Marks
                  </label>
                  <input
                    type="number"
                    required
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Identified Weak Topics (comma separated)
                </label>
                <input
                  type="text"
                  value={weakTopicsStr}
                  onChange={(e) => setWeakTopicsStr(e.target.value)}
                  placeholder="e.g. Potentiometer, King Rule, Faraday Laws"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Teacher / Personal Remarks
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Need faster speed in Section B..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
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
