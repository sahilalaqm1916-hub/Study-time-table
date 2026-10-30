export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type ActivityCategory =
  | 'coaching'
  | 'school'
  | 'home_study'
  | 'revision'
  | 'test'
  | 'break'
  | 'lunch'
  | 'dinner'
  | 'sleep';

export interface TimetableSession {
  id: string;
  day: DayOfWeek;
  title: string;
  subject: string;
  chapter?: string;
  topic?: string;
  startTime: string; // "HH:MM" 24h
  endTime: string;   // "HH:MM" 24h
  category: ActivityCategory;
  completed: boolean;
  notes?: string;
  isMissed?: boolean;
}

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
  notes?: string;
}

export interface Chapter {
  id: string;
  title: string;
  completed: boolean;
  completionPercentage: number;
  topics: Topic[];
  notes?: string;
  revisionStage: 0 | 1 | 2 | 3;
  lastRevisedAt?: string;
  isWeak?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  iconName: string;
  chapters: Chapter[];
}

export interface JeeChapterItem {
  id: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  chapterName: string;
  pyqsCompleted: number;
  pyqsTarget: number;
  questionsSolvedEasy: number;
  questionsSolvedMedium: number;
  questionsSolvedHard: number;
  revisionStage: 0 | 1 | 2 | 3;
  isWeak?: boolean;
}

export interface JeeMockTest {
  id: string;
  title: string;
  date: string;
  physicsScore: number;
  chemistryScore: number;
  mathsScore: number;
  maxMarks: number; // usually 300
  durationMinutes: number;
  accuracyPercentage: number;
  notes?: string;
}

export interface BiharBoardChapter {
  id: string;
  classLevel: '11' | '12';
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'English' | 'Hindi';
  chapterName: string;
  objectiveTarget: number;
  objectiveDone: number;
  subjectiveTarget: number;
  subjectiveDone: number;
  importantQuestions: string[];
  status: 'pending' | 'in_progress' | 'completed';
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  source: 'coaching' | 'school' | 'self';
  dueDate: string; // YYYY-MM-DD
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  description?: string;
}

export interface StudySessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  durationMinutes: number;
  mode: 'pomodoro' | 'custom' | 'stopwatch';
  notes?: string;
  timestamp: number;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  chapter?: string;
  content: string;
  category: 'note' | 'formula' | 'important_question';
  isBookmarked: boolean;
  updatedAt: string;
}

export interface RevisionScheduleItem {
  id: string;
  subject: string;
  chapter: string;
  stage: 1 | 2 | 3;
  scheduledDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  isWeakTopic: boolean;
}

export interface TestResultItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  weakTopics: string[];
  remarks?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'timetable' | 'homework' | 'revision' | 'test' | 'streak';
  read: boolean;
}

export interface UserProfile {
  name: string;
  classLevel: '11' | '12' | 'Dropper';
  board: 'BSEB' | 'CBSE' | 'Other';
  examGoal: 'JEE Main' | 'Bihar Board' | 'Both' | 'Other';
  theme: 'light' | 'dark';
  language: 'en' | 'hi';
  dailyStudyTargetHours: number;
  streakCount: number;
  lastActiveDate: string;
  reminderSettings: {
    studySessions: boolean;
    homeworkAlerts: boolean;
    revisionAlerts: boolean;
    testAlerts: boolean;
  };
}
