import {
  UserProfile,
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
  NotificationItem,
} from '../types';

export interface AppState {
  profile: UserProfile;
  timetable: TimetableSession[];
  subjects: Subject[];
  jeeChapters: JeeChapterItem[];
  jeeMockTests: JeeMockTest[];
  biharBoardChapters: BiharBoardChapter[];
  homework: HomeworkItem[];
  studyLogs: StudySessionLog[];
  notes: NoteItem[];
  revisionSchedule: RevisionScheduleItem[];
  testResults: TestResultItem[];
  notifications: NotificationItem[];
}

const STORAGE_KEY = 'smart_study_planner_state_v1';

export const initialProfile: UserProfile = {
  name: 'Aarav Kumar',
  classLevel: '12',
  board: 'BSEB',
  examGoal: 'Both',
  theme: 'light',
  language: 'en',
  dailyStudyTargetHours: 8,
  streakCount: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  reminderSettings: {
    studySessions: true,
    homeworkAlerts: true,
    revisionAlerts: true,
    testAlerts: true,
  },
};

export const initialSubjects: Subject[] = [
  {
    id: 'sub-phy',
    name: 'Physics',
    code: 'PHY',
    color: '#3B82F6', // Blue
    iconName: 'Atom',
    chapters: [
      {
        id: 'phy-c1',
        title: 'Electrostatics & Electric Potential',
        completed: true,
        completionPercentage: 100,
        revisionStage: 3,
        lastRevisedAt: '2026-10-25',
        topics: [
          { id: 't1', title: "Coulomb's Law & Electric Field", completed: true },
          { id: 't2', title: "Gauss's Theorem & Applications", completed: true },
          { id: 't3', title: 'Capacitance & Dielectrics', completed: true },
        ],
      },
      {
        id: 'phy-c2',
        title: 'Current Electricity & Circuits',
        completed: false,
        completionPercentage: 75,
        revisionStage: 2,
        lastRevisedAt: '2026-10-27',
        topics: [
          { id: 't4', title: "Ohm's Law, Drift Velocity & Resistivity", completed: true },
          { id: 't5', title: "Kirchhoff's Laws & Wheatstone Bridge", completed: true },
          { id: 't6', title: 'Potentiometer & Meter Bridge', completed: false },
        ],
      },
      {
        id: 'phy-c3',
        title: 'Magnetic Effects of Current & Magnetism',
        completed: false,
        completionPercentage: 40,
        revisionStage: 1,
        isWeak: true,
        topics: [
          { id: 't7', title: 'Biot-Savart Law & Ampere Circuital Law', completed: true },
          { id: 't8', title: 'Moving Coil Galvanometer', completed: false },
          { id: 't9', title: 'Earth Magnetism & Magnetic Materials', completed: false },
        ],
      },
      {
        id: 'phy-c4',
        title: 'Ray Optics and Optical Instruments',
        completed: false,
        completionPercentage: 20,
        revisionStage: 0,
        topics: [
          { id: 't10', title: 'Refraction through Spherical Surfaces and Lenses', completed: true },
          { id: 't11', title: 'Prism Dispersion & Scattering', completed: false },
          { id: 't12', title: 'Microscope and Astronomical Telescope', completed: false },
        ],
      },
    ],
  },
  {
    id: 'sub-chem',
    name: 'Chemistry',
    code: 'CHEM',
    color: '#10B981', // Emerald
    iconName: 'FlaskConical',
    chapters: [
      {
        id: 'chem-c1',
        title: 'Solutions & Colligative Properties',
        completed: true,
        completionPercentage: 100,
        revisionStage: 3,
        topics: [
          { id: 'ct1', title: "Raoult's Law & Ideal Solutions", completed: true },
          { id: 'ct2', title: 'Osmotic Pressure & Van t Hoff Factor', completed: true },
        ],
      },
      {
        id: 'chem-c2',
        title: 'Electrochemistry',
        completed: false,
        completionPercentage: 60,
        revisionStage: 1,
        isWeak: true,
        topics: [
          { id: 'ct3', title: 'Nernst Equation & EMF of Cell', completed: true },
          { id: 'ct4', title: "Kohlrausch's Law & Conductance", completed: true },
          { id: 'ct5', title: "Faraday's Laws & Batteries", completed: false },
        ],
      },
      {
        id: 'chem-c3',
        title: 'Chemical Kinetics',
        completed: false,
        completionPercentage: 80,
        revisionStage: 2,
        topics: [
          { id: 'ct6', title: 'Rate of Reaction & Order vs Molecularity', completed: true },
          { id: 'ct7', title: 'Integrated Rate Equations (0th & 1st Order)', completed: true },
          { id: 'ct8', title: 'Arrhenius Equation & Activation Energy', completed: false },
        ],
      },
      {
        id: 'chem-c4',
        title: 'Aldehydes, Ketones & Carboxylic Acids',
        completed: false,
        completionPercentage: 35,
        revisionStage: 0,
        topics: [
          { id: 'ct9', title: 'Aldol Condensation & Cannizzaro Reaction', completed: true },
          { id: 'ct10', title: 'Nucleophilic Addition Reactions', completed: false },
        ],
      },
    ],
  },
  {
    id: 'sub-math',
    name: 'Mathematics',
    code: 'MATH',
    color: '#8B5CF6', // Purple
    iconName: 'Calculator',
    chapters: [
      {
        id: 'math-c1',
        title: 'Matrices and Determinants',
        completed: true,
        completionPercentage: 100,
        revisionStage: 3,
        topics: [
          { id: 'mt1', title: 'Operations on Matrices & Invertible Matrix', completed: true },
          { id: 'mt2', title: 'Properties of Determinants & Cramers Rule', completed: true },
        ],
      },
      {
        id: 'math-c2',
        title: 'Continuity & Differentiability',
        completed: false,
        completionPercentage: 85,
        revisionStage: 2,
        topics: [
          { id: 'mt3', title: 'Continuity at a Point & Limits', completed: true },
          { id: 'mt4', title: 'Chain Rule, Parametric & Implicit Differentiation', completed: true },
          { id: 'mt5', title: 'Mean Value Theorems (Rolle & LMVT)', completed: false },
        ],
      },
      {
        id: 'math-c3',
        title: 'Integrals (Definite & Indefinite)',
        completed: false,
        completionPercentage: 50,
        revisionStage: 1,
        isWeak: true,
        topics: [
          { id: 'mt6', title: 'Integration by Substitution & Parts', completed: true },
          { id: 'mt7', title: 'Partial Fractions', completed: true },
          { id: 'mt8', title: 'Definite Integral Properties & King Rule', completed: false },
        ],
      },
      {
        id: 'math-c4',
        title: 'Vectors & 3-Dimensional Geometry',
        completed: false,
        completionPercentage: 25,
        revisionStage: 0,
        topics: [
          { id: 'mt9', title: 'Dot and Cross Product of Vectors', completed: true },
          { id: 'mt10', title: 'Direction Cosines & Shortest Distance Between Lines', completed: false },
        ],
      },
    ],
  },
  {
    id: 'sub-eng',
    name: 'English',
    code: 'ENG',
    color: '#F59E0B', // Amber
    iconName: 'BookOpen',
    chapters: [
      {
        id: 'eng-c1',
        title: 'Rainbow Part 2: Indian Civilization and Culture',
        completed: true,
        completionPercentage: 100,
        revisionStage: 2,
        topics: [
          { id: 'et1', title: 'Summary & Key Themes by Mahatma Gandhi', completed: true },
          { id: 'et2', title: 'Short Answer & Objective Questions', completed: true },
        ],
      },
      {
        id: 'eng-c2',
        title: 'Rainbow Part 2: Bharat is My Home',
        completed: true,
        completionPercentage: 100,
        revisionStage: 1,
        topics: [
          { id: 'et3', title: 'Speech by Dr. Zakir Hussain', completed: true },
          { id: 'et4', title: 'Grammar: Prepositions & Voice Transformation', completed: true },
        ],
      },
    ],
  },
  {
    id: 'sub-hin',
    name: 'Hindi',
    code: 'HIN',
    color: '#EC4899', // Pink
    iconName: 'BookMarked',
    chapters: [
      {
        id: 'hin-c1',
        title: 'दिगंत भाग 2: बातचीत (बालकृष्ण भट्ट)',
        completed: true,
        completionPercentage: 100,
        revisionStage: 3,
        topics: [
          { id: 'ht1', title: 'निबंध का सारांश और भावार्थ', completed: true },
          { id: 'ht2', title: 'महत्वपूर्ण वस्तुनिष्ठ प्रश्न', completed: true },
        ],
      },
      {
        id: 'hin-c2',
        title: 'दिगंत भाग 2: उसने कहा था (चंद्रधर शर्मा गुलेरी)',
        completed: false,
        completionPercentage: 80,
        revisionStage: 2,
        topics: [
          { id: 'ht3', title: 'कहानी का सारांश और लहना सिंह का चरित्र-चित्रण', completed: true },
          { id: 'ht4', title: 'व्याकरण: समास, संधि एवं विलोम शब्द', completed: false },
        ],
      },
    ],
  },
];

export const initialTimetable: TimetableSession[] = [
  // Monday
  {
    id: 'tt-m1',
    day: 'Monday',
    title: 'Morning Physics Self Study',
    subject: 'Physics',
    chapter: 'Electrostatics',
    topic: 'Gauss Law numericals',
    startTime: '06:00',
    endTime: '07:30',
    category: 'home_study',
    completed: true,
  },
  {
    id: 'tt-m2',
    day: 'Monday',
    title: 'Breakfast & Rest',
    subject: 'General',
    startTime: '07:30',
    endTime: '08:30',
    category: 'break',
    completed: true,
  },
  {
    id: 'tt-m3',
    day: 'Monday',
    title: 'School - Science Stream Classes',
    subject: 'School',
    startTime: '08:30',
    endTime: '13:30',
    category: 'school',
    completed: true,
  },
  {
    id: 'tt-m4',
    day: 'Monday',
    title: 'Lunch & Power Nap',
    subject: 'General',
    startTime: '13:30',
    endTime: '15:00',
    category: 'lunch',
    completed: true,
  },
  {
    id: 'tt-m5',
    day: 'Monday',
    title: 'Maths Coaching (Calculus)',
    subject: 'Mathematics',
    chapter: 'Integrals',
    topic: 'Definite Integration Properties',
    startTime: '15:30',
    endTime: '17:30',
    category: 'coaching',
    completed: false,
  },
  {
    id: 'tt-m6',
    day: 'Monday',
    title: 'Evening Refreshment & Walk',
    subject: 'General',
    startTime: '17:30',
    endTime: '18:15',
    category: 'break',
    completed: false,
  },
  {
    id: 'tt-m7',
    day: 'Monday',
    title: 'Chemistry Organic Reactions Practice',
    subject: 'Chemistry',
    chapter: 'Aldehydes & Ketones',
    topic: 'Aldol & Cannizzaro mechanism',
    startTime: '18:15',
    endTime: '20:15',
    category: 'home_study',
    completed: false,
  },
  {
    id: 'tt-m8',
    day: 'Monday',
    title: 'Dinner & Family Time',
    subject: 'General',
    startTime: '20:15',
    endTime: '21:00',
    category: 'dinner',
    completed: false,
  },
  {
    id: 'tt-m9',
    day: 'Monday',
    title: 'Bihar Board Model Paper / PYQ Revision',
    subject: 'Hindi',
    chapter: 'बातचीत & व्याकरण',
    startTime: '21:00',
    endTime: '22:30',
    category: 'revision',
    completed: false,
  },
  {
    id: 'tt-m10',
    day: 'Monday',
    title: 'Sleep & Night Recovery',
    subject: 'General',
    startTime: '22:30',
    endTime: '05:30',
    category: 'sleep',
    completed: false,
  },
  // Tuesday
  {
    id: 'tt-t1',
    day: 'Tuesday',
    title: 'Morning Mathematics Problem Solving',
    subject: 'Mathematics',
    chapter: 'Vectors',
    startTime: '06:00',
    endTime: '07:30',
    category: 'home_study',
    completed: false,
  },
  {
    id: 'tt-t2',
    day: 'Tuesday',
    title: 'School Classes',
    subject: 'School',
    startTime: '08:30',
    endTime: '13:30',
    category: 'school',
    completed: false,
  },
  {
    id: 'tt-t3',
    day: 'Tuesday',
    title: 'Physics Coaching (Current Electricity)',
    subject: 'Physics',
    chapter: 'Current Electricity',
    startTime: '16:00',
    endTime: '18:00',
    category: 'coaching',
    completed: false,
  },
  {
    id: 'tt-t4',
    day: 'Tuesday',
    title: 'Chemistry Electrochemistry PYQs',
    subject: 'Chemistry',
    chapter: 'Electrochemistry',
    startTime: '19:00',
    endTime: '21:00',
    category: 'home_study',
    completed: false,
  },
  // Wednesday
  {
    id: 'tt-w1',
    day: 'Wednesday',
    title: 'Morning Chemistry Formulas & Notes',
    subject: 'Chemistry',
    chapter: 'Solutions',
    startTime: '06:00',
    endTime: '07:30',
    category: 'revision',
    completed: false,
  },
  {
    id: 'tt-w2',
    day: 'Wednesday',
    title: 'School Regular Study',
    subject: 'School',
    startTime: '08:30',
    endTime: '13:30',
    category: 'school',
    completed: false,
  },
  {
    id: 'tt-w3',
    day: 'Wednesday',
    title: 'Chemistry Coaching (Inorganic)',
    subject: 'Chemistry',
    startTime: '15:30',
    endTime: '17:30',
    category: 'coaching',
    completed: false,
  },
  // Thursday
  {
    id: 'tt-th1',
    day: 'Thursday',
    title: 'JEE Main Physics Mock Test (1 Hour)',
    subject: 'Physics',
    chapter: 'Full Mechanics',
    startTime: '06:00',
    endTime: '07:30',
    category: 'test',
    completed: false,
  },
  {
    id: 'tt-th2',
    day: 'Thursday',
    title: 'School Classes',
    subject: 'School',
    startTime: '08:30',
    endTime: '13:30',
    category: 'school',
    completed: false,
  },
  {
    id: 'tt-th3',
    day: 'Thursday',
    title: 'Maths Self Study & Doubt Clear',
    subject: 'Mathematics',
    chapter: 'Integrals',
    startTime: '16:00',
    endTime: '18:30',
    category: 'home_study',
    completed: false,
  },
  // Friday
  {
    id: 'tt-f1',
    day: 'Friday',
    title: 'English & Hindi BSEB Subjective Practice',
    subject: 'English',
    chapter: 'Rainbow Part 2',
    startTime: '06:00',
    endTime: '07:30',
    category: 'home_study',
    completed: false,
  },
  {
    id: 'tt-f2',
    day: 'Friday',
    title: 'School Classes',
    subject: 'School',
    startTime: '08:30',
    endTime: '13:30',
    category: 'school',
    completed: false,
  },
  {
    id: 'tt-f3',
    day: 'Friday',
    title: 'Physics Coaching',
    subject: 'Physics',
    startTime: '15:30',
    endTime: '17:30',
    category: 'coaching',
    completed: false,
  },
  // Saturday
  {
    id: 'tt-s1',
    day: 'Saturday',
    title: 'Weekly Revision (Physics + Chem)',
    subject: 'Physics',
    chapter: 'Current & Electrostatics',
    startTime: '07:00',
    endTime: '10:00',
    category: 'revision',
    completed: false,
  },
  {
    id: 'tt-s2',
    day: 'Saturday',
    title: 'Maths Problem Marathon 50 Questions',
    subject: 'Mathematics',
    chapter: 'Matrices & Determinants',
    startTime: '11:00',
    endTime: '14:00',
    category: 'home_study',
    completed: false,
  },
  {
    id: 'tt-s3',
    day: 'Saturday',
    title: 'Bihar Board Objective OMR Sheet Drill',
    subject: 'Chemistry',
    startTime: '16:00',
    endTime: '18:00',
    category: 'test',
    completed: false,
  },
  // Sunday
  {
    id: 'tt-su1',
    day: 'Sunday',
    title: 'JEE Main Full Length Mock Test (300 Marks)',
    subject: 'General',
    chapter: 'Physics + Chem + Maths',
    startTime: '09:00',
    endTime: '12:00',
    category: 'test',
    completed: false,
  },
  {
    id: 'tt-su2',
    day: 'Sunday',
    title: 'Mock Test Error Analysis & Weak Topics',
    subject: 'General',
    startTime: '14:00',
    endTime: '16:00',
    category: 'revision',
    completed: false,
  },
  {
    id: 'tt-su3',
    day: 'Sunday',
    title: 'Next Week Timetable Review & Homework Complete',
    subject: 'General',
    startTime: '17:00',
    endTime: '19:00',
    category: 'home_study',
    completed: false,
  },
];

export const initialJeeChapters: JeeChapterItem[] = [
  // Physics
  {
    id: 'jee-p1',
    subject: 'Physics',
    chapterName: 'Electrostatics & Gauss Law',
    pyqsCompleted: 65,
    pyqsTarget: 80,
    questionsSolvedEasy: 45,
    questionsSolvedMedium: 35,
    questionsSolvedHard: 18,
    revisionStage: 3,
  },
  {
    id: 'jee-p2',
    subject: 'Physics',
    chapterName: 'Current Electricity & Circuit Theorems',
    pyqsCompleted: 48,
    pyqsTarget: 75,
    questionsSolvedEasy: 38,
    questionsSolvedMedium: 24,
    questionsSolvedHard: 10,
    revisionStage: 2,
  },
  {
    id: 'jee-p3',
    subject: 'Physics',
    chapterName: 'Magnetic Effects of Current',
    pyqsCompleted: 30,
    pyqsTarget: 70,
    questionsSolvedEasy: 25,
    questionsSolvedMedium: 15,
    questionsSolvedHard: 5,
    revisionStage: 1,
    isWeak: true,
  },
  {
    id: 'jee-p4',
    subject: 'Physics',
    chapterName: 'Electromagnetic Induction & AC',
    pyqsCompleted: 20,
    pyqsTarget: 60,
    questionsSolvedEasy: 20,
    questionsSolvedMedium: 10,
    questionsSolvedHard: 4,
    revisionStage: 1,
  },
  {
    id: 'jee-p5',
    subject: 'Physics',
    chapterName: 'Ray Optics & Wave Optics',
    pyqsCompleted: 15,
    pyqsTarget: 85,
    questionsSolvedEasy: 15,
    questionsSolvedMedium: 8,
    questionsSolvedHard: 2,
    revisionStage: 0,
    isWeak: true,
  },
  {
    id: 'jee-p6',
    subject: 'Physics',
    chapterName: 'Modern Physics & Dual Nature',
    pyqsCompleted: 70,
    pyqsTarget: 90,
    questionsSolvedEasy: 55,
    questionsSolvedMedium: 32,
    questionsSolvedHard: 14,
    revisionStage: 2,
  },
  // Chemistry
  {
    id: 'jee-c1',
    subject: 'Chemistry',
    chapterName: 'Solutions & Colligative Properties',
    pyqsCompleted: 55,
    pyqsTarget: 60,
    questionsSolvedEasy: 40,
    questionsSolvedMedium: 28,
    questionsSolvedHard: 12,
    revisionStage: 3,
  },
  {
    id: 'jee-c2',
    subject: 'Chemistry',
    chapterName: 'Electrochemistry (Nernst & Kohlrausch)',
    pyqsCompleted: 35,
    pyqsTarget: 65,
    questionsSolvedEasy: 30,
    questionsSolvedMedium: 18,
    questionsSolvedHard: 7,
    revisionStage: 1,
    isWeak: true,
  },
  {
    id: 'jee-c3',
    subject: 'Chemistry',
    chapterName: 'Chemical Kinetics & Arrhenius Eq',
    pyqsCompleted: 50,
    pyqsTarget: 60,
    questionsSolvedEasy: 35,
    questionsSolvedMedium: 22,
    questionsSolvedHard: 9,
    revisionStage: 2,
  },
  {
    id: 'jee-c4',
    subject: 'Chemistry',
    chapterName: 'Coordination Compounds',
    pyqsCompleted: 45,
    pyqsTarget: 70,
    questionsSolvedEasy: 30,
    questionsSolvedMedium: 20,
    questionsSolvedHard: 8,
    revisionStage: 2,
  },
  {
    id: 'jee-c5',
    subject: 'Chemistry',
    chapterName: 'Aldehydes, Ketones & Carboxylic Acids',
    pyqsCompleted: 28,
    pyqsTarget: 80,
    questionsSolvedEasy: 20,
    questionsSolvedMedium: 14,
    questionsSolvedHard: 6,
    revisionStage: 1,
  },
  // Maths
  {
    id: 'jee-m1',
    subject: 'Mathematics',
    chapterName: 'Matrices and Determinants',
    pyqsCompleted: 60,
    pyqsTarget: 65,
    questionsSolvedEasy: 45,
    questionsSolvedMedium: 30,
    questionsSolvedHard: 15,
    revisionStage: 3,
  },
  {
    id: 'jee-m2',
    subject: 'Mathematics',
    chapterName: 'Continuity, Differentiability & LMVT',
    pyqsCompleted: 40,
    pyqsTarget: 70,
    questionsSolvedEasy: 30,
    questionsSolvedMedium: 20,
    questionsSolvedHard: 8,
    revisionStage: 2,
  },
  {
    id: 'jee-m3',
    subject: 'Mathematics',
    chapterName: 'Definite & Indefinite Integrals',
    pyqsCompleted: 32,
    pyqsTarget: 90,
    questionsSolvedEasy: 25,
    questionsSolvedMedium: 15,
    questionsSolvedHard: 6,
    revisionStage: 1,
    isWeak: true,
  },
  {
    id: 'jee-m4',
    subject: 'Mathematics',
    chapterName: 'Vectors & 3D Geometry',
    pyqsCompleted: 52,
    pyqsTarget: 80,
    questionsSolvedEasy: 35,
    questionsSolvedMedium: 26,
    questionsSolvedHard: 11,
    revisionStage: 2,
  },
  {
    id: 'jee-m5',
    subject: 'Mathematics',
    chapterName: 'Differential Equations & Area under curve',
    pyqsCompleted: 22,
    pyqsTarget: 65,
    questionsSolvedEasy: 18,
    questionsSolvedMedium: 10,
    questionsSolvedHard: 3,
    revisionStage: 0,
  },
];

export const initialJeeMockTests: JeeMockTest[] = [
  {
    id: 'mock-1',
    title: 'JEE Main Full Syllabus Mock #1',
    date: '2026-10-18',
    physicsScore: 62,
    chemistryScore: 68,
    mathsScore: 48,
    maxMarks: 300,
    durationMinutes: 180,
    accuracyPercentage: 78.5,
    notes: 'Maths speed was slow, needed more time on coordinate geometry.',
  },
  {
    id: 'mock-2',
    title: 'JEE Main High-Yield Mock #2',
    date: '2026-10-25',
    physicsScore: 70,
    chemistryScore: 74,
    mathsScore: 56,
    maxMarks: 300,
    durationMinutes: 180,
    accuracyPercentage: 83.2,
    notes: 'Significant improvement in Physical Chemistry calculations!',
  },
];

export const initialBiharBoardChapters: BiharBoardChapter[] = [
  // Class 12
  {
    id: 'bseb-12-p1',
    classLevel: '12',
    subject: 'Physics',
    chapterName: 'विद्युत आवेश तथा क्षेत्र (Electrostatics)',
    objectiveTarget: 50,
    objectiveDone: 50,
    subjectiveTarget: 20,
    subjectiveDone: 18,
    importantQuestions: [
      'कूलम्ब के नियम को लिखें तथा इसकी सीमाएं बताइए (2 Marks)',
      'गॉस के प्रमेय को सिद्ध करें तथा इसके अनुप्रयोग लिखिए (5 Marks)',
      'विद्युत द्विध्रुव के कारण अक्षीय स्थिति में तीव्रता ज्ञात करें (5 Marks)',
    ],
    status: 'completed',
  },
  {
    id: 'bseb-12-p2',
    classLevel: '12',
    subject: 'Physics',
    chapterName: 'विद्युत धारा (Current Electricity)',
    objectiveTarget: 50,
    objectiveDone: 42,
    subjectiveTarget: 20,
    subjectiveDone: 14,
    importantQuestions: [
      'किरचॉफ के दोनों नियमों को चित्र बनाकर समझाइए (5 Marks)',
      'व्हीटस्टोन सेतु का सिद्धांत तथा संतुलन की शर्त P/Q = R/S (5 Marks)',
      'अपवाह वेग (Drift Velocity) एवं धारा घनत्व में सम्बंध स्थापित करें (2 Marks)',
    ],
    status: 'in_progress',
  },
  {
    id: 'bseb-12-c1',
    classLevel: '12',
    subject: 'Chemistry',
    chapterName: 'विलयन (Solutions)',
    objectiveTarget: 50,
    objectiveDone: 48,
    subjectiveTarget: 15,
    subjectiveDone: 15,
    importantQuestions: [
      'राउल्ट के वाष्पदाब अवनमन नियम को समझाइए (2 Marks)',
      'परासरण और परासरण दाब की परिभाषा दें (2 Marks)',
      'अणुसंख्य गुणधर्म क्या हैं? चारों प्रकारों को समझाइए (5 Marks)',
    ],
    status: 'completed',
  },
  {
    id: 'bseb-12-c2',
    classLevel: '12',
    subject: 'Chemistry',
    chapterName: 'वैद्युतरसायन (Electrochemistry)',
    objectiveTarget: 50,
    objectiveDone: 35,
    subjectiveTarget: 15,
    subjectiveDone: 8,
    importantQuestions: [
      'कोलराउश का नियम और इसके अनुप्रयोग लिखिए (5 Marks)',
      'फैराडे के विद्युत अपघटन के प्रथम एवं द्वितीय नियम (5 Marks)',
      'मानक हाइड्रोजन इलेक्ट्रोड (SHE) का सचित्र वर्णन (5 Marks)',
    ],
    status: 'in_progress',
  },
  {
    id: 'bseb-12-m1',
    classLevel: '12',
    subject: 'Mathematics',
    chapterName: 'सारणिक तथा आव्यूह (Determinants & Matrices)',
    objectiveTarget: 60,
    objectiveDone: 55,
    subjectiveTarget: 25,
    subjectiveDone: 22,
    importantQuestions: [
      'आव्यूह विधि द्वारा रैखिक समीकरण निकाय को हल कीजिए (5 Marks)',
      'सारणिक के प्रगुणों का उपयोग करके सिद्ध करें (5 Marks)',
      'व्युत्क्रमणीय आव्यूह का सहखंडज (Adjoint) ज्ञात करना (2 Marks)',
    ],
    status: 'completed',
  },
  {
    id: 'bseb-12-m2',
    classLevel: '12',
    subject: 'Mathematics',
    chapterName: 'समाकलन (Integrals)',
    objectiveTarget: 70,
    objectiveDone: 40,
    subjectiveTarget: 30,
    subjectiveDone: 12,
    importantQuestions: [
      'खंडशः समाकलन (Integration by parts) विधि (2 Marks)',
      'निश्चित समाकलन का गुणधर्म: King Property सिद्ध करना (5 Marks)',
      'अतिदीर्घ उत्तरीय समाकलन प्रश्न (5 Marks)',
    ],
    status: 'in_progress',
  },
  {
    id: 'bseb-12-h1',
    classLevel: '12',
    subject: 'Hindi',
    chapterName: 'बातचीत, उसने कहा था, संपूर्ण क्रांति',
    objectiveTarget: 50,
    objectiveDone: 45,
    subjectiveTarget: 15,
    subjectiveDone: 12,
    importantQuestions: [
      'बातचीत निबंध की क्या विशेषताएं हैं? (5 Marks)',
      'लहना सिंह का चरित्र चित्रण संक्षेप में करें (5 Marks)',
      'जयप्रकाश नारायण के भाषण संपूर्ण क्रांति का मूल सार (5 Marks)',
    ],
    status: 'in_progress',
  },
  {
    id: 'bseb-12-e1',
    classLevel: '12',
    subject: 'English',
    chapterName: 'Indian Civilization & Culture, Bharat is My Home',
    objectiveTarget: 50,
    objectiveDone: 40,
    subjectiveTarget: 15,
    subjectiveDone: 10,
    importantQuestions: [
      'Summary of Indian Civilization and Culture by M. Gandhi (5 Marks)',
      'What did Dr. Zakir Hussain pledge in his speech? (2 Marks)',
      'Formal Letter / Application writing for BSEB (5 Marks)',
    ],
    status: 'in_progress',
  },
  // Class 11 sample
  {
    id: 'bseb-11-p1',
    classLevel: '11',
    subject: 'Physics',
    chapterName: 'मात्रक एवं मापन, गति के नियम (Kinematics & Laws)',
    objectiveTarget: 40,
    objectiveDone: 35,
    subjectiveTarget: 15,
    subjectiveDone: 10,
    importantQuestions: [
      'विमीय विश्लेषण की सीमाएं एवं अनुप्रयोग (5 Marks)',
      'न्यूटन के गति के तीनों नियम और संवेग संरक्षण सिद्धांत (5 Marks)',
    ],
    status: 'in_progress',
  },
  {
    id: 'bseb-11-c1',
    classLevel: '11',
    subject: 'Chemistry',
    chapterName: 'परमाणु की संरचना, रासायनिक आबंधन (Structure & Bonding)',
    objectiveTarget: 40,
    objectiveDone: 30,
    subjectiveTarget: 15,
    subjectiveDone: 9,
    importantQuestions: [
      'हाइजेनबर्ग का अनिश्चितता सिद्धांत एवं डी ब्रोग्ली समीकरण (5 Marks)',
      'संकरण (Hybridization) sp, sp2, sp3 के उदाहरण (5 Marks)',
    ],
    status: 'in_progress',
  },
];

export const initialHomework: HomeworkItem[] = [
  {
    id: 'hw-1',
    title: 'Solve Ex 7.4 Definite Integrals Q1 to Q20',
    subject: 'Mathematics',
    source: 'coaching',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    description: 'Special focus on substitution and trigonometric transforms for coaching test.',
  },
  {
    id: 'hw-2',
    title: 'Physics Practical Lab Notebook Completion',
    subject: 'Physics',
    source: 'school',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'medium',
    completed: false,
    description: 'Write down Ohm law and Potentiometer readings with circuit diagrams.',
  },
  {
    id: 'hw-3',
    title: 'Memorize 15 Named Organic Chemistry Reactions',
    subject: 'Chemistry',
    source: 'coaching',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    priority: 'high',
    completed: false,
    description: 'Aldol, Cannizzaro, Rosenmund, Clemmensen, Wolff-Kishner with reagents.',
  },
  {
    id: 'hw-4',
    title: 'English Summary: Bharat is My Home',
    subject: 'English',
    source: 'school',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    priority: 'low',
    completed: true,
    completedAt: '2026-10-28',
    description: '150-word summary with key quotes.',
  },
];

export const initialStudyLogs: StudySessionLog[] = [
  {
    id: 'log-1',
    date: '2026-10-28',
    subject: 'Physics',
    durationMinutes: 90,
    mode: 'pomodoro',
    notes: 'Covered Electrostatics Gauss law numericals',
    timestamp: Date.now() - 86400000,
  },
  {
    id: 'log-2',
    date: '2026-10-28',
    subject: 'Mathematics',
    durationMinutes: 120,
    mode: 'custom',
    notes: 'Solved 25 PYQs on Matrices and Determinants',
    timestamp: Date.now() - 80000000,
  },
  {
    id: 'log-3',
    date: '2026-10-29',
    subject: 'Chemistry',
    durationMinutes: 75,
    mode: 'pomodoro',
    notes: 'Electrochemistry Nernst equation exercises',
    timestamp: Date.now() - 20000000,
  },
];

export const initialNotes: NoteItem[] = [
  {
    id: 'note-1',
    title: "Gauss's Law & Electric Flux Formulas",
    subject: 'Physics',
    chapter: 'Electrostatics',
    category: 'formula',
    isBookmarked: true,
    updatedAt: '2026-10-28',
    content: `1. Electric Flux: Φ = ∫ E · dA = E * A * cos(θ)
2. Gauss's Law: ∮ E · dA = Q_enclosed / ε₀
3. Infinite wire electric field: E = λ / (2πε₀r)
4. Infinite conducting plane sheet: E = σ / (2ε₀)
5. Spherical conducting shell:
   - Inside (r < R): E = 0, V = (1/4πε₀) * (Q/R) (Constant)
   - Outside (r ≥ R): E = (1/4πε₀) * (Q/r²), V = (1/4πε₀) * (Q/r)`,
  },
  {
    id: 'note-2',
    title: 'Standard Definite Integration Properties (King Rule)',
    subject: 'Mathematics',
    chapter: 'Integrals',
    category: 'formula',
    isBookmarked: true,
    updatedAt: '2026-10-27',
    content: `1. ∫[a to b] f(x) dx = ∫[a to b] f(a + b - x) dx  <-- (The King Rule, 90% JEE problems)
2. ∫[0 to a] f(x) dx = ∫[0 to a] f(a - x) dx
3. Odd/Even Property:
   ∫[-a to a] f(x) dx = 2∫[0 to a] f(x) dx if f(-x) = f(x) (Even)
   ∫[-a to a] f(x) dx = 0 if f(-x) = -f(x) (Odd)
4. Periodic Property:
   ∫[0 to nT] f(x) dx = n * ∫[0 to T] f(x) dx where f(x+T) = f(x)`,
  },
  {
    id: 'note-3',
    title: 'Electrochemistry: Nernst Equation & Cell Potential',
    subject: 'Chemistry',
    chapter: 'Electrochemistry',
    category: 'formula',
    isBookmarked: false,
    updatedAt: '2026-10-26',
    content: `1. Nernst Equation at 298 K:
   E_cell = E°_cell - (0.0591 / n) * log(Q)
2. Equilibrium Constant relation:
   E°_cell = (0.0591 / n) * log(K_c)
3. Gibbs Free Energy:
   ΔG° = -n * F * E°_cell  (where F = 96500 C/mol)
   ΔG = ΔG° + 2.303 RT log(Q)
4. Specific conductance κ = (1/R) * (l/A) = G * G*
5. Molar conductivity: Λm = (1000 * κ) / Molarity`,
  },
  {
    id: 'note-4',
    title: 'BSEB Class 12 Hindi: उसने कहा था के मुख्य संवाद',
    subject: 'Hindi',
    chapter: 'उसने कहा था',
    category: 'important_question',
    isBookmarked: true,
    updatedAt: '2026-10-25',
    content: `1. 'तेरी कुड़माई हो गई?' - लहना सिंह द्वारा आठ वर्ष की लड़की से पूछा गया अमर सवाल।
2. लहना सिंह का त्याग: सूबेदारनी के बेटे बोधा सिंह और पति हजारा सिंह के प्राणों की रक्षा करते हुए स्वयं शहीद होना।
3. परीक्षा हेतु 5 अंक का प्रश्न: लहना सिंह का चरित्र-चित्रण। बिंदु: (क) निश्चल प्रेम (ख) अदम्य साहस (ग) कर्तव्यपरायणता और वचन-पालन।`,
  },
];

export const initialRevisionSchedule: RevisionScheduleItem[] = [
  {
    id: 'rev-1',
    subject: 'Physics',
    chapter: 'Current Electricity & Wheatstone Bridge',
    stage: 2,
    scheduledDate: new Date().toISOString().split('T')[0],
    completed: false,
    isWeakTopic: true,
  },
  {
    id: 'rev-2',
    subject: 'Chemistry',
    chapter: 'Electrochemistry Nernst Equation',
    stage: 1,
    scheduledDate: new Date().toISOString().split('T')[0],
    completed: false,
    isWeakTopic: true,
  },
  {
    id: 'rev-3',
    subject: 'Mathematics',
    chapter: 'Matrices & Determinants Properties',
    stage: 3,
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    isWeakTopic: false,
  },
  {
    id: 'rev-4',
    subject: 'Physics',
    chapter: 'Electrostatics Gauss Law',
    stage: 3,
    scheduledDate: '2026-10-25',
    completed: true,
    completedAt: '2026-10-25',
    isWeakTopic: false,
  },
];

export const initialTestResults: TestResultItem[] = [
  {
    id: 'res-1',
    title: 'Coaching Weekly Test - Mechanics & Electrostatics',
    subject: 'Physics',
    date: '2026-10-15',
    marksObtained: 76,
    totalMarks: 100,
    percentage: 76,
    weakTopics: ['Capacitor charging time constant', 'Variable mass rocket propulsion'],
    remarks: 'Good grasp of electrostatic concepts. Strengthen calculus applications.',
  },
  {
    id: 'res-2',
    title: 'School Mid-Term Chemistry Exam',
    subject: 'Chemistry',
    date: '2026-10-22',
    marksObtained: 84,
    totalMarks: 100,
    percentage: 84,
    weakTopics: ['Electrochemical cell notation', 'Fuel cells equation'],
    remarks: 'Excellent in Organic, practice physical chemistry calculations.',
  },
  {
    id: 'res-3',
    title: 'JEE Main Maths Speed Test',
    subject: 'Mathematics',
    date: '2026-10-26',
    marksObtained: 58,
    totalMarks: 100,
    percentage: 58,
    weakTopics: ['Definite integral property 4', 'Area between intersecting curves'],
    remarks: 'Time management was an issue. Review integration shortcuts.',
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Study Reminder',
    message: 'Maths Coaching session begins in 15 minutes!',
    timestamp: '15:15',
    type: 'timetable',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Homework Due Today',
    message: 'Solve Ex 7.4 Definite Integrals due tonight!',
    timestamp: '09:00',
    type: 'homework',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'Revision Due: Electrochemistry',
    message: 'Day 7 spaced revision due today for high retention.',
    timestamp: '07:30',
    type: 'revision',
    read: true,
  },
  {
    id: 'notif-4',
    title: '5-Day Streak Maintained! 🔥',
    message: 'Awesome work! You completed your daily study target 5 days in a row.',
    timestamp: 'Yesterday',
    type: 'streak',
    read: true,
  },
];

export const defaultState: AppState = {
  profile: initialProfile,
  timetable: initialTimetable,
  subjects: initialSubjects,
  jeeChapters: initialJeeChapters,
  jeeMockTests: initialJeeMockTests,
  biharBoardChapters: initialBiharBoardChapters,
  homework: initialHomework,
  studyLogs: initialStudyLogs,
  notes: initialNotes,
  revisionSchedule: initialRevisionSchedule,
  testResults: initialTestResults,
  notifications: initialNotifications,
};

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      profile: { ...defaultState.profile, ...parsed.profile },
      timetable: parsed.timetable?.length ? parsed.timetable : defaultState.timetable,
      subjects: parsed.subjects?.length ? parsed.subjects : defaultState.subjects,
      jeeChapters: parsed.jeeChapters?.length ? parsed.jeeChapters : defaultState.jeeChapters,
      jeeMockTests: parsed.jeeMockTests?.length ? parsed.jeeMockTests : defaultState.jeeMockTests,
      biharBoardChapters: parsed.biharBoardChapters?.length ? parsed.biharBoardChapters : defaultState.biharBoardChapters,
      homework: parsed.homework?.length ? parsed.homework : defaultState.homework,
      studyLogs: parsed.studyLogs?.length ? parsed.studyLogs : defaultState.studyLogs,
      notes: parsed.notes?.length ? parsed.notes : defaultState.notes,
      revisionSchedule: parsed.revisionSchedule?.length ? parsed.revisionSchedule : defaultState.revisionSchedule,
      testResults: parsed.testResults?.length ? parsed.testResults : defaultState.testResults,
      notifications: parsed.notifications?.length ? parsed.notifications : defaultState.notifications,
    };
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return defaultState;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

export function exportBackupJson(state: AppState): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `smart_study_planner_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importBackupJson(file: File, onSuccess: (state: AppState) => void, onError: (msg: string) => void): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const parsed = JSON.parse(content);
      if (!parsed.profile || !parsed.timetable || !parsed.subjects) {
        throw new Error('Invalid backup file schema');
      }
      saveAppState(parsed);
      onSuccess(parsed);
    } catch {
      onError('Invalid backup file. Please select a valid JSON backup exported from Smart Study Planner.');
    }
  };
  reader.readAsText(file);
}

export function resetAppStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}
