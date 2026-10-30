import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';
import { Subject, Chapter, Topic } from '../types';
import { Language, translations } from '../utils/translations';

interface SubjectManagementViewProps {
  language: Language;
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onAddChapter: (subjectId: string, chapterTitle: string) => void;
  onAddTopic: (subjectId: string, chapterId: string, topicTitle: string) => void;
  onToggleTopicComplete: (subjectId: string, chapterId: string, topicId: string) => void;
  onUpdateChapterPercentage: (subjectId: string, chapterId: string, percentage: number) => void;
}

export const SubjectManagementView: React.FC<SubjectManagementViewProps> = ({
  language,
  subjects,
  onAddSubject,
  onAddChapter,
  onAddTopic,
  onToggleTopicComplete,
  onUpdateChapterPercentage,
}) => {
  const t = translations[language];
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [expandedChapterIds, setExpandedChapterIds] = useState<Set<string>>(new Set());

  // Add Subject Modal
  const [isAddSubjectModalOpen, setIsAddSubjectModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubColor, setNewSubColor] = useState('#3B82F6');

  // Add Chapter Modal
  const [isAddChapterModalOpen, setIsAddChapterModalOpen] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  // Add Topic Modal
  const [selectedChapterForTopic, setSelectedChapterForTopic] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const toggleChapterExpand = (chapterId: string) => {
    const next = new Set(expandedChapterIds);
    if (next.has(chapterId)) {
      next.delete(chapterId);
    } else {
      next.add(chapterId);
    }
    setExpandedChapterIds(next);
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    onAddSubject({
      name: newSubName.trim(),
      code: newSubCode.trim().toUpperCase() || newSubName.slice(0, 3).toUpperCase(),
      color: newSubColor,
      iconName: 'BookOpen',
      chapters: [],
    });
    setNewSubName('');
    setNewSubCode('');
    setIsAddSubjectModalOpen(false);
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim() || !currentSubject) return;
    onAddChapter(currentSubject.id, newChapterTitle.trim());
    setNewChapterTitle('');
    setIsAddChapterModalOpen(false);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !currentSubject || !selectedChapterForTopic) return;
    onAddTopic(currentSubject.id, selectedChapterForTopic, newTopicTitle.trim());
    setNewTopicTitle('');
    setSelectedChapterForTopic(null);
  };

  const totalChapters = currentSubject?.chapters.length || 0;
  const completedChapters = currentSubject?.chapters.filter((c) => c.completionPercentage === 100).length || 0;
  const avgCompletion =
    totalChapters > 0
      ? Math.round(
          currentSubject!.chapters.reduce((acc, c) => acc + c.completionPercentage, 0) / totalChapters
        )
      : 0;

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.menuSections.subjects}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'अध्याय, टॉपिक, नोट्स और पाठ्यक्रम पूर्णता प्रतिशत प्रबंधित करें'
              : 'Manage syllabus, chapters, topic checklists & mastery levels'}
          </p>
        </div>

        <button
          onClick={() => setIsAddSubjectModalOpen(true)}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'hi' ? 'नया विषय जोड़ें' : 'Add Subject'}</span>
        </button>
      </div>

      {/* Subject horizontal pill tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {subjects.map((sub) => {
          const isSelected = sub.id === currentSubject?.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: sub.color }}
              />
              <span>{sub.name}</span>
              <span className="text-[10px] opacity-70">({sub.chapters.length})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Overview Card */}
      {currentSubject && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentSubject.color }}
                />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {currentSubject.name} Syllabus
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {completedChapters} of {totalChapters} chapters 100% completed · Average Mastery: {avgCompletion}%
              </p>
            </div>

            <button
              onClick={() => setIsAddChapterModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'hi' ? 'नया अध्याय जोड़ें' : 'Add Chapter'}</span>
            </button>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${avgCompletion}%` }}
            />
          </div>

          {/* Chapters Accordion List */}
          <div className="space-y-3 pt-2">
            {currentSubject.chapters.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No chapters added for {currentSubject.name} yet. Tap &quot;Add Chapter&quot; above to get started!
              </p>
            ) : (
              currentSubject.chapters.map((chapter) => {
                const isExpanded = expandedChapterIds.has(chapter.id);
                const completedTopics = chapter.topics.filter((t) => t.completed).length;

                return (
                  <div
                    key={chapter.id}
                    className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden"
                  >
                    {/* Chapter Header row */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div
                        onClick={() => toggleChapterExpand(chapter.id)}
                        className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                      >
                        <button className="text-slate-400 hover:text-slate-600">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                              {chapter.title}
                            </span>
                            {chapter.isWeak && (
                              <span className="text-[10px] text-red-500 font-semibold">(Weak)</span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {completedTopics} / {chapter.topics.length} topics done · Revision Stage {chapter.revisionStage}
                          </div>
                        </div>
                      </div>

                      {/* Percentage slider & Quick Topic Add */}
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={chapter.completionPercentage}
                            onChange={(e) =>
                              onUpdateChapterPercentage(
                                currentSubject.id,
                                chapter.id,
                                Number(e.target.value)
                              )
                            }
                            className="w-24 sm:w-32 accent-blue-600 h-1.5 rounded-lg cursor-pointer"
                          />
                          <span className="font-mono text-xs tabular-nums font-bold text-slate-700 dark:text-slate-300 w-10 text-right">
                            {chapter.completionPercentage}%
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedChapterForTopic(chapter.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800"
                          title="Add Topic"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Topics List */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase">
                          <span>Topic Checklist</span>
                          <button
                            onClick={() => setSelectedChapterForTopic(chapter.id)}
                            className="text-blue-600 hover:underline capitalize"
                          >
                            + Add Topic
                          </button>
                        </div>

                        {chapter.topics.length === 0 ? (
                          <p className="text-xs text-slate-400 py-2 italic">
                            No specific topics added. Tap &quot;+ Add Topic&quot; to break this chapter down.
                          </p>
                        ) : (
                          chapter.topics.map((topic) => (
                            <div
                              key={topic.id}
                              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <button
                                  onClick={() =>
                                    onToggleTopicComplete(currentSubject.id, chapter.id, topic.id)
                                  }
                                  className="text-slate-400 hover:text-blue-600 shrink-0"
                                >
                                  {topic.completed ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                                  )}
                                </button>
                                <span
                                  className={`truncate ${
                                    topic.completed
                                      ? 'line-through text-slate-400'
                                      : 'text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  {topic.title}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {isAddSubjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add New Subject
              </h3>
              <button
                onClick={() => setIsAddSubjectModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  required
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="e.g. Biology, Computer Science"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Short Code (e.g. BIO, CS)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="e.g. BIO"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tag Color
                </label>
                <div className="flex items-center gap-2">
                  {['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4', '#64748B'].map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setNewSubColor(c)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          newSubColor === c ? 'scale-110 border-slate-900 dark:border-white' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectModalOpen(false)}
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

      {/* Add Chapter Modal */}
      {isAddChapterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add Chapter to {currentSubject?.name}
              </h3>
              <button
                onClick={() => setIsAddChapterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChapter} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chapter Title *
                </label>
                <input
                  type="text"
                  required
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="e.g. Wave Optics, Thermodynamics"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddChapterModalOpen(false)}
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

      {/* Add Topic Modal */}
      {selectedChapterForTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add Sub-Topic
              </h3>
              <button
                onClick={() => setSelectedChapterForTopic(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="e.g. Young's Double Slit Experiment"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedChapterForTopic(null)}
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
