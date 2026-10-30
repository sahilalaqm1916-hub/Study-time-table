import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Plus,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  X,
  Target,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Language, translations } from '../utils/translations';
import { JeeChapterItem, JeeMockTest, BiharBoardChapter } from '../types';

interface ExamsHubViewProps {
  language: Language;
  jeeChapters: JeeChapterItem[];
  jeeMockTests: JeeMockTest[];
  biharChapters: BiharBoardChapter[];
  onUpdateJeeChapter: (updated: JeeChapterItem) => void;
  onAddJeeMockTest: (mock: Omit<JeeMockTest, 'id'>) => void;
  onUpdateBiharChapter: (updated: BiharBoardChapter) => void;
  onAddBiharQuestion: (chapterId: string, question: string) => void;
}

export const ExamsHubView: React.FC<ExamsHubViewProps> = ({
  language,
  jeeChapters,
  jeeMockTests,
  biharChapters,
  onUpdateJeeChapter,
  onAddJeeMockTest,
  onUpdateBiharChapter,
  onAddBiharQuestion,
}) => {
  const t = translations[language];
  const [activeExam, setActiveExam] = useState<'jee' | 'bihar'>('jee');

  // JEE Tab state
  const [jeeSubject, setJeeSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics'>('Physics');
  const [isAddMockModalOpen, setIsAddMockModalOpen] = useState(false);
  const [mockTitle, setMockTitle] = useState('');
  const [mockDate, setMockDate] = useState(new Date().toISOString().split('T')[0]);
  const [mockPhy, setMockPhy] = useState(70);
  const [mockChem, setMockChem] = useState(75);
  const [mockMath, setMockMath] = useState(60);
  const [mockDuration, setMockDuration] = useState(180);
  const [mockAccuracy, setMockAccuracy] = useState(80);
  const [mockNotes, setMockNotes] = useState('');

  // Bihar Board state
  const [biharClass, setBiharClass] = useState<'11' | '12'>('12');
  const [biharSubject, setBiharSubject] = useState<string>('All');
  const [selectedBiharChapterForQ, setSelectedBiharChapterForQ] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState('');

  // Countdown to Bihar Board Exam (typically 1st Feb)
  const examDate = new Date('2027-02-01T09:30:00');
  const now = new Date();
  const diffMs = Math.max(0, examDate.getTime() - now.getTime());
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);

  // JEE stats calculation
  const filteredJee = jeeChapters.filter((c) => c.subject === jeeSubject);
  const totalPyqsTarget = filteredJee.reduce((acc, c) => acc + c.pyqsTarget, 0);
  const totalPyqsDone = filteredJee.reduce((acc, c) => acc + c.pyqsCompleted, 0);
  const pyqPercent = totalPyqsTarget > 0 ? Math.round((totalPyqsDone / totalPyqsTarget) * 100) : 0;

  const totalMockTests = jeeMockTests.length;
  const avgMockScore =
    totalMockTests > 0
      ? Math.round(
          jeeMockTests.reduce(
            (acc, m) => acc + (m.physicsScore + m.chemistryScore + m.mathsScore),
            0
          ) / totalMockTests
        )
      : 0;
  const bestMockScore =
    totalMockTests > 0
      ? Math.max(
          ...jeeMockTests.map((m) => m.physicsScore + m.chemistryScore + m.mathsScore)
        )
      : 0;

  // Bihar chapters filter
  const filteredBihar = biharChapters.filter(
    (c) => c.classLevel === biharClass && (biharSubject === 'All' ? true : c.subject === biharSubject)
  );

  const handleSaveMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mockTitle.trim()) return;
    onAddJeeMockTest({
      title: mockTitle.trim(),
      date: mockDate,
      physicsScore: Number(mockPhy),
      chemistryScore: Number(mockChem),
      mathsScore: Number(mockMath),
      maxMarks: 300,
      durationMinutes: Number(mockDuration),
      accuracyPercentage: Number(mockAccuracy),
      notes: mockNotes.trim(),
    });
    setIsAddMockModalOpen(false);
    setMockTitle('');
    setMockNotes('');
  };

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || !selectedBiharChapterForQ) return;
    onAddBiharQuestion(selectedBiharChapterForQ, newQuestionText.trim());
    setNewQuestionText('');
    setSelectedBiharChapterForQ(null);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header & Exam Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {activeExam === 'jee' ? t.jee.title : t.bihar.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeExam === 'jee' ? t.jee.subtitle : t.bihar.subtitle}
          </p>
        </div>

        {/* Primary Exam Selector Tab Bar */}
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveExam('jee')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeExam === 'jee'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>JEE Main 2026/27</span>
          </button>
          <button
            onClick={() => setActiveExam('bihar')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeExam === 'bihar'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Bihar Board (BSEB)</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* ===================== JEE MAIN SECTION ======================= */}
      {/* ============================================================== */}
      {activeExam === 'jee' && (
        <div className="space-y-6">
          {/* JEE KPI Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                {t.jee.pyqs} ({jeeSubject})
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                  {totalPyqsDone}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ {totalPyqsTarget}</span>
              </div>
              <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${pyqPercent}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                {t.jee.mockTests}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-slate-100">
                  {totalMockTests}
                </span>
                <span className="text-xs text-slate-500">tests taken</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Full 300 Marks pattern
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                {t.jee.avgScore}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
                  {avgMockScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 300</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-500">
                Percentile range: ~96-98%ile
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                {t.jee.bestScore}
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {bestMockScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">/ 300</span>
              </div>
              <div className="mt-2 text-[11px] text-emerald-600 font-medium">
                Peak performance
              </div>
            </div>
          </div>

          {/* Subject Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            {(['Physics', 'Chemistry', 'Mathematics'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => setJeeSubject(sub)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  jeeSubject === sub
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                {t.jee[sub.toLowerCase() as 'physics' | 'chemistry' | 'maths']}
              </button>
            ))}
          </div>

          {/* Chapter-Wise JEE Tracker */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              {jeeSubject} Chapter-Wise PYQ & Difficulty Tracker
            </h3>

            {filteredJee.map((item) => {
              const pyqRatio = Math.round((item.pyqsCompleted / (item.pyqsTarget || 1)) * 100);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {item.chapterName}
                        </h4>
                        {item.isWeak && (
                          <span className="text-[10px] font-semibold text-red-600 dark:text-red-400">
                            (Weak Area)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span>
                          PYQs: {item.pyqsCompleted} / {item.pyqsTarget}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{pyqRatio}% target achieved</span>
                      </div>
                    </div>

                    {/* Revision stage button */}
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span className="text-[11px] text-slate-400 mr-1">Revision:</span>
                      {[0, 1, 2, 3].map((stg) => (
                        <button
                          key={stg}
                          onClick={() =>
                            onUpdateJeeChapter({
                              ...item,
                              revisionStage: stg as 0 | 1 | 2 | 3,
                            })
                          }
                          className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-colors ${
                            item.revisionStage === stg
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                          }`}
                          title={`Revision Stage ${stg}`}
                        >
                          R{stg}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          onUpdateJeeChapter({
                            ...item,
                            isWeak: !item.isWeak,
                          })
                        }
                        className={`ml-2 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                          item.isWeak
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/50'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {item.isWeak ? 'Weak' : 'Mark Weak'}
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, pyqRatio)}%` }}
                    />
                  </div>

                  {/* Difficulty counters */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center gap-4">
                      {/* Easy */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Easy:
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              onUpdateJeeChapter({
                                ...item,
                                questionsSolvedEasy: Math.max(0, item.questionsSolvedEasy - 1),
                              })
                            }
                            className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono tabular-nums font-semibold w-6 text-center">
                            {item.questionsSolvedEasy}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateJeeChapter({
                                ...item,
                                questionsSolvedEasy: item.questionsSolvedEasy + 1,
                              })
                            }
                            className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Medium */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          Medium:
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              onUpdateJeeChapter({
                                ...item,
                                questionsSolvedMedium: Math.max(0, item.questionsSolvedMedium - 1),
                              })
                            }
                            className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono tabular-nums font-semibold w-6 text-center">
                            {item.questionsSolvedMedium}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateJeeChapter({
                                ...item,
                                questionsSolvedMedium: item.questionsSolvedMedium + 1,
                              })
                            }
                            className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Hard */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-rose-600 dark:text-rose-400 font-semibold">
                          Hard:
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              onUpdateJeeChapter({
                                ...item,
                                questionsSolvedHard: Math.max(0, item.questionsSolvedHard - 1),
                              })
                            }
                            className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold"
                          >
                            -
                          </button>
                          <span className="font-mono tabular-nums font-semibold w-6 text-center">
                            {item.questionsSolvedHard}
                          </span>
                          <button
                            onClick={() =>
                              onUpdateJeeChapter({
                                ...item,
                                questionsSolvedHard: item.questionsSolvedHard + 1,
                              })
                            }
                            className="w-5 h-5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Quick increment PYQ */}
                    <button
                      onClick={() =>
                        onUpdateJeeChapter({
                          ...item,
                          pyqsCompleted: item.pyqsCompleted + 5,
                        })
                      }
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      +5 PYQs Done
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* JEE Mock Test Tracker */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {t.jee.mockTests}
                </h3>
                <p className="text-xs text-slate-500">
                  Track full-length 300 marks tests and accuracy percentages
                </p>
              </div>
              <button
                onClick={() => setIsAddMockModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t.jee.addMock}</span>
              </button>
            </div>

            <div className="space-y-3">
              {jeeMockTests.map((mock) => {
                const total = mock.physicsScore + mock.chemistryScore + mock.mathsScore;
                return (
                  <div
                    key={mock.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {mock.title}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {mock.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300 mt-1">
                        <span>Phy: <strong className="font-mono">{mock.physicsScore}</strong></span>
                        <span>Chem: <strong className="font-mono">{mock.chemistryScore}</strong></span>
                        <span>Math: <strong className="font-mono">{mock.mathsScore}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Accuracy: <strong className="font-mono">{mock.accuracyPercentage}%</strong></span>
                      </div>
                      {mock.notes && (
                        <p className="text-xs text-slate-500 italic mt-1">&ldquo;{mock.notes}&rdquo;</p>
                      )}
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
                        {total} / {mock.maxMarks}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {((total / mock.maxMarks) * 100).toFixed(1)}% Marks
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* =================== BIHAR BOARD SECTION ====================== */}
      {/* ============================================================== */}
      {activeExam === 'bihar' && (
        <div className="space-y-6">
          {/* BSEB Countdown Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase font-bold tracking-wider text-indigo-200">
                {t.bihar.bsebCountdown}
              </div>
              <h3 className="text-lg sm:text-xl font-bold mt-0.5">
                Bihar Board Intermediate (12th / 11th) Annual Examination
              </h3>
              <p className="text-xs text-indigo-100 mt-1">
                Objective (50 marks OMR) + Subjective 50 marks pattern. Focus on NCERT & model sets.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
              <Clock className="w-5 h-5 text-indigo-200" />
              <div className="text-center">
                <span className="text-xl font-bold font-mono tabular-nums">{diffDays}</span>
                <span className="text-[10px] uppercase block text-indigo-200">Days Left</span>
              </div>
              <span className="text-indigo-300 font-bold">:</span>
              <div className="text-center">
                <span className="text-xl font-bold font-mono tabular-nums">{diffHours}</span>
                <span className="text-[10px] uppercase block text-indigo-200">Hours</span>
              </div>
            </div>
          </div>

          {/* Class 11 vs 12 and Subject Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Class selector */}
            <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 self-start sm:self-auto">
              <button
                onClick={() => setBiharClass('12')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  biharClass === '12'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.bihar.class12}
              </button>
              <button
                onClick={() => setBiharClass('11')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  biharClass === '11'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {t.bihar.class11}
              </button>
            </div>

            {/* Subject filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              {['All', 'Physics', 'Chemistry', 'Mathematics', 'Hindi', 'English'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setBiharSubject(sub)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                    biharSubject === sub
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Bihar Board Chapter List */}
          <div className="space-y-4">
            {filteredBihar.map((item) => {
              const objPercent = Math.round((item.objectiveDone / (item.objectiveTarget || 1)) * 100);
              const subjPercent = Math.round((item.subjectiveDone / (item.subjectiveTarget || 1)) * 100);

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                >
                  {/* Title & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                          {item.subject}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-xs text-slate-500">Class {item.classLevel}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                        {item.chapterName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          onUpdateBiharChapter({
                            ...item,
                            status: e.target.value as 'pending' | 'in_progress' | 'completed',
                          })
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ${
                          item.status === 'completed'
                            ? 'text-emerald-600'
                            : item.status === 'in_progress'
                            ? 'text-indigo-600'
                            : 'text-slate-500'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Objective & Subjective Practice Dual Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Objective OMR Tracker */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {t.bihar.objectivePractice}
                        </span>
                        <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {item.objectiveDone} / {item.objectiveTarget}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, objPercent)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-slate-400">{objPercent}% done</span>
                        <button
                          onClick={() =>
                            onUpdateBiharChapter({
                              ...item,
                              objectiveDone: Math.min(item.objectiveTarget, item.objectiveDone + 5),
                            })
                          }
                          className="text-indigo-600 hover:underline font-semibold"
                        >
                          +5 Done
                        </button>
                      </div>
                    </div>

                    {/* Subjective Short & Long Tracker */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-purple-600 dark:text-purple-400">
                          {t.bihar.subjectivePractice}
                        </span>
                        <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">
                          {item.subjectiveDone} / {item.subjectiveTarget}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, subjPercent)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-slate-400">{subjPercent}% done</span>
                        <button
                          onClick={() =>
                            onUpdateBiharChapter({
                              ...item,
                              subjectiveDone: Math.min(item.subjectiveTarget, item.subjectiveDone + 2),
                            })
                          }
                          className="text-purple-600 hover:underline font-semibold"
                        >
                          +2 Done
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Important Questions Section */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                        {t.bihar.importantQuestions} ({item.importantQuestions.length})
                      </span>
                      <button
                        onClick={() => setSelectedBiharChapterForQ(item.id)}
                        className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{t.bihar.addQuestion}</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {item.importantQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg"
                        >
                          <span className="text-indigo-500 font-bold font-mono">Q{idx + 1}.</span>
                          <span className="leading-relaxed">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Record Mock Test Modal */}
      {isAddMockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {t.jee.addMock}
              </h3>
              <button
                onClick={() => setIsAddMockModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMock} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Test Title *
                </label>
                <input
                  type="text"
                  required
                  value={mockTitle}
                  onChange={(e) => setMockTitle(e.target.value)}
                  placeholder="e.g. Allen Mock #3, Full Test 2026"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={mockDate}
                  onChange={(e) => setMockDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Physics (/100)
                  </label>
                  <input
                    type="number"
                    min={-20}
                    max={100}
                    value={mockPhy}
                    onChange={(e) => setMockPhy(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Chemistry (/100)
                  </label>
                  <input
                    type="number"
                    min={-20}
                    max={100}
                    value={mockChem}
                    onChange={(e) => setMockChem(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Maths (/100)
                  </label>
                  <input
                    type="number"
                    min={-20}
                    max={100}
                    value={mockMath}
                    onChange={(e) => setMockMath(Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={mockDuration}
                    onChange={(e) => setMockDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Accuracy %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={mockAccuracy}
                    onChange={(e) => setMockAccuracy(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Analysis Notes / Mistakes
                </label>
                <textarea
                  rows={2}
                  value={mockNotes}
                  onChange={(e) => setMockNotes(e.target.value)}
                  placeholder="Need faster calculus speed, silly mistake in coordination compounds..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMockModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Important Question Modal */}
      {selectedBiharChapterForQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add Important Question for BSEB
              </h3>
              <button
                onClick={() => setSelectedBiharChapterForQ(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Question Description & Marks (e.g., 2 Marks / 5 Marks)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="e.g. प्रकाश के व्यतिकरण के लिए आवश्यक शर्तें लिखिए (2 Marks)"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedBiharChapterForQ(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
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
