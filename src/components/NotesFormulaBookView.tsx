import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Edit2,
  X,
  Sigma,
  HelpCircle,
} from 'lucide-react';
import { NoteItem, Subject } from '../types';
import { Language, translations } from '../utils/translations';

interface NotesFormulaBookViewProps {
  language: Language;
  notes: NoteItem[];
  subjects: Subject[];
  onAddNote: (note: Omit<NoteItem, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onToggleBookmark: (id: string) => void;
}

export const NotesFormulaBookView: React.FC<NotesFormulaBookViewProps> = ({
  language,
  notes,
  subjects,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onToggleBookmark,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'all' | 'formula' | 'note' | 'important_question'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Physics');
  const [chapter, setChapter] = useState('');
  const [category, setCategory] = useState<'note' | 'formula' | 'important_question'>('formula');
  const [content, setContent] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  const openAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setSubject('Physics');
    setChapter('');
    setCategory('formula');
    setContent('');
    setIsBookmarked(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NoteItem) => {
    setEditingNote(item);
    setTitle(item.title);
    setSubject(item.subject);
    setChapter(item.chapter || '');
    setCategory(item.category);
    setContent(item.content);
    setIsBookmarked(item.isBookmarked);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title: title.trim(),
        subject,
        chapter: chapter.trim(),
        category,
        content: content.trim(),
        isBookmarked,
        updatedAt: new Date().toISOString().split('T')[0],
      });
    } else {
      onAddNote({
        title: title.trim(),
        subject,
        chapter: chapter.trim(),
        category,
        content: content.trim(),
        isBookmarked,
      });
    }
    setIsModalOpen(false);
  };

  const filteredNotes = notes
    .filter((n) => (activeTab === 'all' ? true : n.category === activeTab))
    .filter((n) => (subjectFilter === 'All' ? true : n.subject === subjectFilter))
    .filter((n) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        (n.chapter && n.chapter.toLowerCase().includes(q)) ||
        n.subject.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (b.isBookmarked ? 1 : 0) - (a.isBookmarked ? 1 : 0));

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {t.notes.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Formulas, short summaries, theorems & important question repository
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.notes.addNew}</span>
        </button>
      </div>

      {/* Category Tabs: All, Formulas, Notes, Important Questions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center gap-1 text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {t.notes.all}
          </button>
          <button
            onClick={() => setActiveTab('formula')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'formula'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sigma className="w-3.5 h-3.5" />
            <span>{t.notes.formulas}</span>
          </button>
          <button
            onClick={() => setActiveTab('note')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'note'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.notes.notesTab}</span>
          </button>
          <button
            onClick={() => setActiveTab('important_question')}
            className={`px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'important_question'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.notes.questionsTab}</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.notes.searchPlaceholder}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
        <button
          onClick={() => setSubjectFilter('All')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            subjectFilter === 'All'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          All Subjects
        </button>
        {subjects.map((s) => (
          <button
            key={s.id}
            onClick={() => setSubjectFilter(s.name)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              subjectFilter === s.name
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No notes or formulas found matching your filter.
          </p>
          <button
            onClick={openAddModal}
            className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{t.notes.addNew}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-3 relative group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                        {note.subject}
                      </span>
                      {note.chapter && (
                        <>
                          <span aria-hidden="true" className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500 truncate">{note.chapter}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {note.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => onToggleBookmark(note.id)}
                    className="text-slate-400 hover:text-amber-500 transition-colors p-1"
                    title={note.isBookmarked ? 'Bookmarked' : 'Add bookmark'}
                  >
                    {note.isBookmarked ? (
                      <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Content block: styled monospace for formulas */}
                <div className="mt-3 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </div>
              </div>

              {/* Bottom footer: date & edit/delete */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <span>Updated: {note.updatedAt}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(note)}
                    className="p-1 hover:text-blue-600 rounded"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="p-1 hover:text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {editingNote ? 'Edit Note / Formula' : t.notes.addNew}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lens Maker Formula, King Rule Properties"
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
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as 'note' | 'formula' | 'important_question')
                    }
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="formula">Formula Sheet</option>
                    <option value="note">Study Note / Theory</option>
                    <option value="important_question">Important Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chapter (Optional)
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="e.g. Optics, Electrochemistry, Integrals"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Formula / Content (Monospace Mathematical Markdown supported) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="1. 1/f = (μ - 1) * (1/R1 - 1/R2)&#10;2. Power P = 1/f"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bmk"
                  checked={isBookmarked}
                  onChange={(e) => setIsBookmarked(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="bmk" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Bookmark as favorite / pin to top
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
