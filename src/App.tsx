/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  loadAppState,
  saveAppState,
  resetAppStorage,
  AppState,
  defaultState,
} from './utils/storage';
import { Header } from './components/Header';
import { BottomNav, MainTab } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { TimetableScheduleView } from './components/TimetableScheduleView';
import { ExamsHubView } from './components/ExamsHubView';
import { TimerView } from './components/TimerView';
import { MoreHubView } from './components/MoreHubView';
import { SubjectManagementView } from './components/SubjectManagementView';
import { HomeworkManagerView } from './components/HomeworkManagerView';
import { NotesFormulaBookView } from './components/NotesFormulaBookView';
import { RevisionSystemView } from './components/RevisionSystemView';
import { TestExamManagerView } from './components/TestExamManagerView';
import { AnalyticsView } from './components/AnalyticsView';
import { CalendarView } from './components/CalendarView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { NotificationCenterModal } from './components/NotificationCenterModal';
import {
  TimetableSession,
  Subject,
  JeeChapterItem,
  JeeMockTest,
  BiharBoardChapter,
  HomeworkItem,
  StudySessionLog,
  NoteItem,
  RevisionScheduleItem,
  TestResultItem,
  UserProfile,
} from './types';
import { Language } from './utils/translations';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [reschedulingSessionId, setReschedulingSessionId] = useState<string | null>(null);

  // Auto-save state to localStorage
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  // Synchronize dark theme class on <html>
  useEffect(() => {
    if (state.profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.profile.theme]);

  // Theme & Language toggles
  const handleToggleTheme = () => {
    setState((prev) => {
      const nextTheme = prev.profile.theme === 'dark' ? 'light' : 'dark';
      return {
        ...prev,
        profile: { ...prev.profile, theme: nextTheme },
      };
    });
  };

  const handleToggleLanguage = () => {
    setState((prev) => {
      const nextLang: Language = prev.profile.language === 'en' ? 'hi' : 'en';
      return {
        ...prev,
        profile: { ...prev.profile, language: nextLang },
      };
    });
  };

  // Timetable Handlers
  const handleToggleSessionComplete = (sessionId: string) => {
    setState((prev) => ({
      ...prev,
      timetable: prev.timetable.map((s) =>
        s.id === sessionId ? { ...s, completed: !s.completed } : s
      ),
    }));
  };

  const handleAddSession = (session: Omit<TimetableSession, 'id'>) => {
    const newSession: TimetableSession = {
      ...session,
      id: `tt-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      timetable: [...prev.timetable, newSession],
    }));
  };

  const handleUpdateSession = (session: TimetableSession) => {
    setState((prev) => ({
      ...prev,
      timetable: prev.timetable.map((s) => (s.id === session.id ? session : s)),
    }));
  };

  const handleDeleteSession = (sessionId: string) => {
    setState((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((s) => s.id !== sessionId),
    }));
  };

  const handleRescheduleSession = (sessionId: string) => {
    setReschedulingSessionId(sessionId);
    setActiveTab('timetable');
    setActiveSubView(null);
  };

  // JEE & Bihar Board Handlers
  const handleUpdateJeeChapter = (updated: JeeChapterItem) => {
    setState((prev) => ({
      ...prev,
      jeeChapters: prev.jeeChapters.map((c) => (c.id === updated.id ? updated : c)),
    }));
  };

  const handleAddJeeMockTest = (mock: Omit<JeeMockTest, 'id'>) => {
    const newMock: JeeMockTest = { ...mock, id: `mock-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      jeeMockTests: [newMock, ...prev.jeeMockTests],
    }));
  };

  const handleUpdateBiharChapter = (updated: BiharBoardChapter) => {
    setState((prev) => ({
      ...prev,
      biharBoardChapters: prev.biharBoardChapters.map((c) =>
        c.id === updated.id ? updated : c
      ),
    }));
  };

  const handleAddBiharQuestion = (chapterId: string, question: string) => {
    setState((prev) => ({
      ...prev,
      biharBoardChapters: prev.biharBoardChapters.map((c) => {
        if (c.id === chapterId) {
          return {
            ...c,
            importantQuestions: [...c.importantQuestions, question],
          };
        }
        return c;
      }),
    }));
  };

  // Timer & Study Logger
  const handleLogStudySession = (log: Omit<StudySessionLog, 'id'>) => {
    const newLog: StudySessionLog = { ...log, id: `log-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      studyLogs: [...prev.studyLogs, newLog],
    }));
  };

  // Subject Management Handlers
  const handleAddSubject = (subject: Omit<Subject, 'id'>) => {
    const newSubject: Subject = { ...subject, id: `sub-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
    }));
  };

  const handleAddChapter = (subjectId: string, chapterTitle: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: [
              ...sub.chapters,
              {
                id: `chap-${Date.now()}`,
                title: chapterTitle,
                completed: false,
                completionPercentage: 0,
                revisionStage: 0,
                topics: [],
              },
            ],
          };
        }
        return sub;
      }),
    }));
  };

  const handleAddTopic = (subjectId: string, chapterId: string, topicTitle: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: sub.chapters.map((chap) => {
              if (chap.id === chapterId) {
                return {
                  ...chap,
                  topics: [
                    ...chap.topics,
                    {
                      id: `top-${Date.now()}`,
                      title: topicTitle,
                      completed: false,
                    },
                  ],
                };
              }
              return chap;
            }),
          };
        }
        return sub;
      }),
    }));
  };

  const handleToggleTopicComplete = (subjectId: string, chapterId: string, topicId: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: sub.chapters.map((chap) => {
              if (chap.id === chapterId) {
                const nextTopics = chap.topics.map((t) =>
                  t.id === topicId ? { ...t, completed: !t.completed } : t
                );
                const completedCount = nextTopics.filter((t) => t.completed).length;
                const nextPct =
                  nextTopics.length > 0
                    ? Math.round((completedCount / nextTopics.length) * 100)
                    : chap.completionPercentage;
                return {
                  ...chap,
                  topics: nextTopics,
                  completionPercentage: nextPct,
                  completed: nextPct === 100,
                };
              }
              return chap;
            }),
          };
        }
        return sub;
      }),
    }));
  };

  const handleUpdateChapterPercentage = (
    subjectId: string,
    chapterId: string,
    percentage: number
  ) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            chapters: sub.chapters.map((chap) => {
              if (chap.id === chapterId) {
                return {
                  ...chap,
                  completionPercentage: percentage,
                  completed: percentage === 100,
                };
              }
              return chap;
            }),
          };
        }
        return sub;
      }),
    }));
  };

  // Homework Handlers
  const handleAddHomework = (item: Omit<HomeworkItem, 'id'>) => {
    const newHw: HomeworkItem = { ...item, id: `hw-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      homework: [newHw, ...prev.homework],
    }));
  };

  const handleToggleHomeworkComplete = (id: string) => {
    setState((prev) => ({
      ...prev,
      homework: prev.homework.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      ),
    }));
  };

  const handleDeleteHomework = (id: string) => {
    setState((prev) => ({
      ...prev,
      homework: prev.homework.filter((h) => h.id !== id),
    }));
  };

  // Notes & Formula Handlers
  const handleAddNote = (note: Omit<NoteItem, 'id' | 'updatedAt'>) => {
    const newNote: NoteItem = {
      ...note,
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
  };

  const handleUpdateNote = (note: NoteItem) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === note.id ? note : n)),
    }));
  };

  const handleDeleteNote = (id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  };

  const handleToggleBookmarkNote = (id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, isBookmarked: !n.isBookmarked } : n
      ),
    }));
  };

  // Revision Handlers
  const handleAddRevisionSchedule = (item: Omit<RevisionScheduleItem, 'id'>) => {
    const newRev: RevisionScheduleItem = { ...item, id: `rev-${Date.now()}` };
    setState((prev) => ({
      ...prev,
      revisionSchedule: [...prev.revisionSchedule, newRev],
    }));
  };

  const handleMarkRevised = (id: string) => {
    setState((prev) => ({
      ...prev,
      revisionSchedule: prev.revisionSchedule.map((r) =>
        r.id === id
          ? {
              ...r,
              completed: true,
              completedAt: new Date().toISOString().split('T')[0],
            }
          : r
      ),
    }));
  };

  // Test Result Handlers
  const handleAddTestResult = (item: Omit<TestResultItem, 'id' | 'percentage'>) => {
    const pct = Math.round((item.marksObtained / (item.totalMarks || 100)) * 100);
    const newRes: TestResultItem = {
      ...item,
      id: `res-${Date.now()}`,
      percentage: pct,
    };
    setState((prev) => ({
      ...prev,
      testResults: [newRes, ...prev.testResults],
    }));
  };

  const handleDeleteTestResult = (id: string) => {
    setState((prev) => ({
      ...prev,
      testResults: prev.testResults.filter((t) => t.id !== id),
    }));
  };

  // Profile update
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setState((prev) => ({
      ...prev,
      profile: newProfile,
    }));
  };

  // Restore & Reset
  const handleRestoreState = (newState: AppState) => {
    setState(newState);
  };

  const handleResetData = () => {
    resetAppStorage();
    setState(defaultState);
  };

  // Notifications
  const handleMarkAllNotificationsAsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const handleToggleReminderSetting = (key: keyof UserProfile['reminderSettings']) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        reminderSettings: {
          ...prev.profile.reminderSettings,
          [key]: !prev.profile.reminderSettings[key],
        },
      },
    }));
  };

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setActiveSubView(null);
  };

  const handleNavigateSubView = (view: string) => {
    setActiveSubView(view);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header
        language={state.profile.language}
        onToggleLanguage={handleToggleLanguage}
        theme={state.profile.theme}
        onToggleTheme={handleToggleTheme}
        streakCount={state.profile.streakCount}
        notifications={state.notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {/* Sub-view Back Bar (if navigated into a specific module) */}
        {activeSubView && (
          <div className="px-4 sm:px-6 pt-3 pb-1 max-w-5xl mx-auto">
            <button
              onClick={() => setActiveSubView(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </button>
          </div>
        )}

        {/* View Router */}
        {activeSubView === 'subjects' ? (
          <SubjectManagementView
            language={state.profile.language}
            subjects={state.subjects}
            onAddSubject={handleAddSubject}
            onAddChapter={handleAddChapter}
            onAddTopic={handleAddTopic}
            onToggleTopicComplete={handleToggleTopicComplete}
            onUpdateChapterPercentage={handleUpdateChapterPercentage}
          />
        ) : activeSubView === 'homework' ? (
          <HomeworkManagerView
            language={state.profile.language}
            homework={state.homework}
            onAddHomework={handleAddHomework}
            onToggleComplete={handleToggleHomeworkComplete}
            onDeleteHomework={handleDeleteHomework}
          />
        ) : activeSubView === 'notes' ? (
          <NotesFormulaBookView
            language={state.profile.language}
            notes={state.notes}
            subjects={state.subjects}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onToggleBookmark={handleToggleBookmarkNote}
          />
        ) : activeSubView === 'revision' ? (
          <RevisionSystemView
            language={state.profile.language}
            revisionItems={state.revisionSchedule}
            subjects={state.subjects}
            onAddRevisionSchedule={handleAddRevisionSchedule}
            onMarkRevised={handleMarkRevised}
          />
        ) : activeSubView === 'tests' ? (
          <TestExamManagerView
            language={state.profile.language}
            testResults={state.testResults}
            subjects={state.subjects}
            onAddTestResult={handleAddTestResult}
            onDeleteTestResult={handleDeleteTestResult}
          />
        ) : activeSubView === 'analytics' ? (
          <AnalyticsView state={state} language={state.profile.language} />
        ) : activeSubView === 'calendar' ? (
          <CalendarView state={state} language={state.profile.language} />
        ) : activeSubView === 'settings' ? (
          <ProfileSettingsView
            profile={state.profile}
            appState={state}
            language={state.profile.language}
            onUpdateProfile={handleUpdateProfile}
            onToggleTheme={handleToggleTheme}
            onToggleLanguage={handleToggleLanguage}
            onRestoreState={handleRestoreState}
            onResetData={handleResetData}
          />
        ) : activeTab === 'dashboard' ? (
          <DashboardView
            state={state}
            language={state.profile.language}
            onNavigateTab={handleTabChange}
            onNavigateSubView={handleNavigateSubView}
            onToggleSessionComplete={handleToggleSessionComplete}
            onRescheduleSession={handleRescheduleSession}
          />
        ) : activeTab === 'timetable' ? (
          <TimetableScheduleView
            sessions={state.timetable}
            language={state.profile.language}
            onAddSession={handleAddSession}
            onUpdateSession={handleUpdateSession}
            onDeleteSession={handleDeleteSession}
            onToggleComplete={handleToggleSessionComplete}
            reschedulingSessionId={reschedulingSessionId}
            onClearRescheduling={() => setReschedulingSessionId(null)}
          />
        ) : activeTab === 'exams' ? (
          <ExamsHubView
            language={state.profile.language}
            jeeChapters={state.jeeChapters}
            jeeMockTests={state.jeeMockTests}
            biharChapters={state.biharBoardChapters}
            onUpdateJeeChapter={handleUpdateJeeChapter}
            onAddJeeMockTest={handleAddJeeMockTest}
            onUpdateBiharChapter={handleUpdateBiharChapter}
            onAddBiharQuestion={handleAddBiharQuestion}
          />
        ) : activeTab === 'timer' ? (
          <TimerView
            language={state.profile.language}
            subjects={state.subjects}
            studyLogs={state.studyLogs}
            onLogStudySession={handleLogStudySession}
          />
        ) : (
          <MoreHubView
            language={state.profile.language}
            state={state}
            onNavigateSubView={handleNavigateSubView}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeSubView ? 'more' : activeTab}
        onChangeTab={handleTabChange}
        language={state.profile.language}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={state.notifications}
        profile={state.profile}
        language={state.profile.language}
        onMarkAllAsRead={handleMarkAllNotificationsAsRead}
        onToggleReminderSetting={handleToggleReminderSetting}
      />
    </div>
  );
}
