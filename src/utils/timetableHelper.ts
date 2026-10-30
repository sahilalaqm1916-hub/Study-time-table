import { DayOfWeek, TimetableSession } from '../types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export function getTodayDayName(): DayOfWeek {
  const days: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = new Date().getDay();
  return days[todayIndex];
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function formatTime12(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minuteFormatted = m < 10 ? `0${m}` : m;
  return `${hour12}:${minuteFormatted} ${period}`;
}

export function getCurrentTimeMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

export function isSessionActiveNow(session: TimetableSession, currentDay: DayOfWeek, currentMinutes: number): boolean {
  if (session.day !== currentDay) return false;
  const start = timeToMinutes(session.startTime);
  const end = timeToMinutes(session.endTime);
  if (start < end) {
    return currentMinutes >= start && currentMinutes < end;
  } else {
    // Overnight (e.g. sleep 22:30 to 05:30)
    return currentMinutes >= start || currentMinutes < end;
  }
}

export function findActiveAndUpcomingSession(sessions: TimetableSession[], currentDay: DayOfWeek, currentMinutes: number): {
  activeSession: TimetableSession | null;
  upcomingSession: TimetableSession | null;
} {
  const todaySessions = sessions
    .filter((s) => s.day === currentDay)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  let activeSession: TimetableSession | null = null;
  let upcomingSession: TimetableSession | null = null;

  for (const s of todaySessions) {
    if (isSessionActiveNow(s, currentDay, currentMinutes)) {
      activeSession = s;
    } else if (timeToMinutes(s.startTime) > currentMinutes && !upcomingSession) {
      upcomingSession = s;
    }
  }

  return { activeSession, upcomingSession };
}

export function detectConflicts(sessions: TimetableSession[]): Map<string, string[]> {
  const conflictMap = new Map<string, string[]>();

  // Group by day
  const dayGroups: Record<string, TimetableSession[]> = {};
  for (const day of DAYS_OF_WEEK) {
    dayGroups[day] = [];
  }
  for (const session of sessions) {
    dayGroups[session.day]?.push(session);
  }

  for (const day of DAYS_OF_WEEK) {
    const list = dayGroups[day];
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      const aStart = timeToMinutes(a.startTime);
      const aEnd = timeToMinutes(a.endTime);
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);

        // Check regular overlap
        const overlaps = Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
        if (overlaps) {
          if (!conflictMap.has(a.id)) conflictMap.set(a.id, []);
          if (!conflictMap.has(b.id)) conflictMap.set(b.id, []);
          conflictMap.get(a.id)!.push(b.title);
          conflictMap.get(b.id)!.push(a.title);
        }
      }
    }
  }

  return conflictMap;
}

export function calculateDailyStudyHours(sessions: TimetableSession[], day: DayOfWeek): number {
  const studyCategories = ['coaching', 'school', 'home_study', 'revision', 'test'];
  const daySessions = sessions.filter((s) => s.day === day && studyCategories.includes(s.category));

  let totalMinutes = 0;
  for (const s of daySessions) {
    const start = timeToMinutes(s.startTime);
    const end = timeToMinutes(s.endTime);
    if (end > start) {
      totalMinutes += end - start;
    }
  }
  return parseFloat((totalMinutes / 60).toFixed(1));
}

export const MOTIVATIONAL_QUOTES = [
  {
    quote: "You have to dream before your dreams can come true.",
    author: "Dr. A.P.J. Abdul Kalam",
    hi: "सपने सच होने से पहले आपको सपने देखने होंगे।",
  },
  {
    quote: "Arise, awake, and stop not until the goal is reached.",
    author: "Swami Vivekananda",
    hi: "उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।",
  },
  {
    quote: "Continuous effort—not strength or intelligence—is the key to unlocking our potential.",
    author: "Winston Churchill",
    hi: "निरंतर प्रयास ही हमारी क्षमता को उजागर करने की कुंजी है।",
  },
  {
    quote: "Hard work beats talent when talent fails to work hard.",
    author: "Tim Notke",
    hi: "कड़ी मेहनत हमेशा प्रतिभा को हरा देती है जब प्रतिभा मेहनत नहीं करती।",
  },
  {
    quote: "Success in JEE and Board exams is the sum of small efforts repeated day in and day out.",
    author: "Study Mentor",
    hi: "परीक्षाओं में सफलता हर दिन दोहराए जाने वाले छोटे-छोटे प्रयासों का योग है।",
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    hi: "आगे बढ़ने का रहस्य केवल शुरुआत करना है।",
  },
];
