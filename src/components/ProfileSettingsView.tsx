import React, { useState } from 'react';
import {
  User,
  Settings,
  Moon,
  Sun,
  Languages,
  Download,
  Upload,
  RotateCcw,
  Printer,
  ShieldAlert,
  CheckCircle,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';
import { Language, translations } from '../utils/translations';
import { exportBackupJson, importBackupJson, AppState } from '../utils/storage';

interface ProfileSettingsViewProps {
  profile: UserProfile;
  appState: AppState;
  language: Language;
  onUpdateProfile: (profile: UserProfile) => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onRestoreState: (state: AppState) => void;
  onResetData: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  appState,
  language,
  onUpdateProfile,
  onToggleTheme,
  onToggleLanguage,
  onRestoreState,
  onResetData,
}) => {
  const t = translations[language];
  const [name, setName] = useState(profile.name);
  const [classLevel, setClassLevel] = useState(profile.classLevel);
  const [board, setBoard] = useState(profile.board);
  const [examGoal, setExamGoal] = useState(profile.examGoal);
  const [targetHours, setTargetHours] = useState(profile.dailyStudyTargetHours);
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name: name.trim(),
      classLevel,
      board,
      examGoal,
      dailyStudyTargetHours: Number(targetHours),
    });
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoreError(null);
    importBackupJson(
      file,
      (newState) => {
        onRestoreState(newState);
        alert('App state restored successfully!');
      },
      (err) => {
        setRestoreError(err);
      }
    );
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 sm:px-6 pt-4">
      {/* Top Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          {t.settings.title}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalize academic targets, board preferences, appearance & data backup
        </p>
      </div>

      {isSavedAlert && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile preferences saved successfully!</span>
        </div>
      )}

      {/* Student Profile Form */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <span>{t.settings.studentProfile}</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.settings.name}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.settings.classLevel}
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value as '11' | '12' | 'Dropper')}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
                <option value="Dropper">Target / Dropper</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.settings.board}
              </label>
              <select
                value={board}
                onChange={(e) => setBoard(e.target.value as 'BSEB' | 'CBSE' | 'Other')}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="BSEB">Bihar Board (BSEB)</option>
                <option value="CBSE">CBSE Board</option>
                <option value="Other">Other State Board</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t.settings.goal}
              </label>
              <select
                value={examGoal}
                onChange={(e) => setExamGoal(e.target.value as 'JEE Main' | 'Bihar Board' | 'Both' | 'Other')}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
              >
                <option value="Both">Both (JEE Main + Board)</option>
                <option value="JEE Main">JEE Main Focus</option>
                <option value="Bihar Board">Board Exam Focus</option>
                <option value="Other">General / Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.settings.dailyHoursTarget}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={2}
                max={16}
                value={targetHours}
                onChange={(e) => setTargetHours(Number(e.target.value))}
                className="w-24 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono font-bold"
              />
              <span className="text-xs text-slate-500">hours recommended per day</span>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            {t.common.save}
          </button>
        </form>
      </div>

      {/* Appearance & Language */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          {t.settings.appearance}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Theme card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                {profile.theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t.settings.theme}
                </span>
                <span className="text-[11px] text-slate-500">
                  {profile.theme === 'dark' ? t.settings.dark : t.settings.light}
                </span>
              </div>
            </div>

            <button
              onClick={onToggleTheme}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Toggle
            </button>
          </div>

          {/* Language card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <Languages className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t.settings.language}
                </span>
                <span className="text-[11px] text-slate-500">
                  {language === 'en' ? 'English (Current)' : 'हिन्दी (सक्रिय)'}
                </span>
              </div>
            </div>

            <button
              onClick={onToggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {language === 'en' ? 'स्विच हिन्दी' : 'Switch EN'}
            </button>
          </div>
        </div>
      </div>

      {/* Data Management & Backup / Restore */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          {t.settings.dataManagement}
        </h3>

        {restoreError && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {restoreError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export JSON */}
          <button
            onClick={() => exportBackupJson(appState)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 text-left transition-colors group"
          >
            <Download className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {t.settings.backupData}
            </span>
            <span className="text-[11px] text-slate-500">Download complete study records</span>
          </button>

          {/* Import JSON */}
          <label className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 text-left transition-colors cursor-pointer group block">
            <Upload className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {t.settings.restoreData}
            </span>
            <span className="text-[11px] text-slate-500">Restore state from JSON backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Export Timetable as PDF / Print */}
          <button
            onClick={() => window.print()}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 text-left transition-colors group"
          >
            <Printer className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Export Timetable (PDF)
            </span>
            <span className="text-[11px] text-slate-500">Save printable weekly timetable</span>
          </button>
        </div>

        {/* Reset App Data */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-600 dark:text-red-400 block">
              {t.settings.resetData}
            </span>
            <span className="text-[11px] text-slate-400">
              Clear local storage and reset to default curriculum state
            </span>
          </div>
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold">Reset Confirmation</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {t.settings.resetConfirm}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  onResetData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
