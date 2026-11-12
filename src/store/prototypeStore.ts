import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LESSON_TRAILS, type LessonProgress } from "@/data/lessons";

export interface LocalReminder {
  id: string;
  title: string;
  type: string;
  scheduledAt: string;
  details: string;
  done: boolean;
  completedAt?: string;
}

interface CycleLog {
  date: string;
  mood: string;
  symptoms: string[];
  flow: string;
  energy?: string;
  intimacy?: string;
}

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDailyPoints(state: PrototypeState, amount: number): Pick<PrototypeState, "points" | "pointsToday" | "pointsDate"> {
  const today = getLocalDateString(new Date());
  const alreadyEarned = state.pointsDate === today ? state.pointsToday : 0;
  const awarded = Math.min(amount, Math.max(100 - alreadyEarned, 0));
  return {
    points: state.points + awarded,
    pointsToday: alreadyEarned + awarded,
    pointsDate: today,
  };
}

function getDemoReminders(): LocalReminder[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(8, 0, 0, 0);

  const consultation = new Date();
  consultation.setHours(14, 30, 0, 0);
  if (consultation <= new Date()) consultation.setDate(consultation.getDate() + 1);

  return [
    {
      id: "demo-consultation",
      title: "Teleconsulta com Dr. Marcos",
      type: "CONSULTATION",
      scheduledAt: consultation.toISOString(),
      details: "Local ilustrativo · exemplo demonstrativo, nenhum agendamento foi feito.",
      done: false,
    },
    {
      id: "demo-exam",
      title: "Hemograma Completo + Glicemia",
      type: "EXAM",
      scheduledAt: tomorrow.toISOString(),
      details: "Amanhã · local ilustrativo. Confirme preparo com seu serviço de saúde.",
      done: false,
    },
  ];
}

interface PrototypeState {
  selectedPlan: { name: string; price: number } | null;
  claims: string[];
  reminders: LocalReminder[];
  cycleLogs: CycleLog[];
  cycleStartDate: string;
  cycleLength: number;
  lessonProgress: Record<string, LessonProgress>;
  points: number;
  cashbackEarned: number;
  cashbackRedeemedCount: number;
  pointsToday: number;
  pointsDate: string;
  streakDays: number;
  streakLastDate: string;
  carePointsDate: string;
  selectPlan: (name: string, price: number) => void;
  requestBenefit: (description: string) => void;
  addReminder: (reminder: Omit<LocalReminder, "id" | "done">) => void;
  completeReminder: (id: string) => void;
  saveCycleLog: (log: Omit<CycleLog, "date">) => void;
  setCycleSettings: (startDate: string, length: number) => void;
  completeLesson: (
    lessonId: string,
    quizScore: number,
    points: number,
    cashback: number,
  ) => LessonCompletionResult;
  redeemCashback: () => void;
}

export interface LessonCompletionResult {
  awardedPoints: number;
  awardedCashback: number;
  dailyLimitReached: boolean;
  alreadyCompleted: boolean;
}

type PersistedPrototypeState = Omit<
  PrototypeState,
  | "selectPlan"
  | "requestBenefit"
  | "addReminder"
  | "completeReminder"
  | "saveCycleLog"
  | "setCycleSettings"
  | "completeLesson"
  | "redeemCashback"
>;

const INITIAL_PERSISTED_STATE: PersistedPrototypeState = {
  selectedPlan: null,
  claims: [],
  reminders: getDemoReminders(),
  cycleLogs: [],
  cycleStartDate: "",
  cycleLength: 28,
  lessonProgress: {},
  points: 280,
  cashbackEarned: 5,
  cashbackRedeemedCount: 0,
  pointsToday: 25,
  pointsDate: getLocalDateString(new Date()),
  streakDays: 6,
  streakLastDate: getLocalDateString(new Date()),
  carePointsDate: "",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function readLessonProgress(value: unknown): Record<string, LessonProgress> | null {
  if (!isRecord(value)) return null;
  const progress: Record<string, LessonProgress> = {};
  for (const [lessonId, entry] of Object.entries(value)) {
    if (
      !isRecord(entry)
      || typeof entry.completed !== "boolean"
      || typeof entry.quizScore !== "number"
      || !Number.isFinite(entry.quizScore)
      || typeof entry.completedAt !== "string"
    ) return null;
    progress[lessonId] = {
      completed: entry.completed,
      quizScore: Math.max(0, Math.floor(entry.quizScore)),
      completedAt: entry.completedAt,
    };
  }
  return progress;
}

function migrateLessonProgress(value: Record<string, unknown>): Record<string, LessonProgress> {
  const currentProgress = readLessonProgress(value.lessonProgress);
  if (currentProgress) return currentProgress;

  const progress: Record<string, LessonProgress> = {};
  const completedAt = new Date().toISOString();
  const legacyTrailProgress = isRecord(value.trailProgress) ? value.trailProgress : {};
  for (const trail of LESSON_TRAILS) {
    const legacyCount = legacyTrailProgress[trail.id];
    if (typeof legacyCount !== "number" || !Number.isFinite(legacyCount)) continue;
    const count = Math.min(Math.max(Math.floor(legacyCount), 0), trail.lessons.length);
    for (const lesson of trail.lessons.slice(0, count)) {
      progress[lesson.id] = { completed: true, quizScore: 0, completedAt };
    }
  }

  if (isStringArray(value.completedLessons)) {
    for (const legacyValue of value.completedLessons) {
      const lesson = LESSON_TRAILS
        .flatMap((trail) => trail.lessons)
        .find((entry) => entry.id === legacyValue || entry.title === legacyValue);
      if (lesson) progress[lesson.id] = { completed: true, quizScore: 0, completedAt };
    }
  }
  return progress;
}

function readReminders(value: unknown): LocalReminder[] | null {
  if (!Array.isArray(value)) return null;
  const reminders: LocalReminder[] = [];
  for (const entry of value) {
    if (
      !isRecord(entry)
      || typeof entry.id !== "string"
      || typeof entry.title !== "string"
      || typeof entry.type !== "string"
      || typeof entry.scheduledAt !== "string"
      || typeof entry.details !== "string"
      || typeof entry.done !== "boolean"
      || (entry.completedAt !== undefined && typeof entry.completedAt !== "string")
    ) return null;
    reminders.push({
      id: entry.id,
      title: entry.id === "demo-consultation" ? "Teleconsulta com Dr. Marcos" : entry.id === "demo-exam" ? "Hemograma Completo + Glicemia" : entry.title,
      type: entry.type,
      scheduledAt: entry.scheduledAt,
      details: entry.id === "demo-consultation"
        ? "Local ilustrativo · exemplo demonstrativo, nenhum agendamento foi feito."
        : entry.id === "demo-exam"
          ? "Amanhã · local ilustrativo. Confirme preparo com seu serviço de saúde."
          : entry.details,
      done: entry.done,
      ...(typeof entry.completedAt === "string" ? { completedAt: entry.completedAt } : {}),
    });
  }
  return reminders;
}

function readCycleLogs(value: unknown): CycleLog[] | null {
  if (!Array.isArray(value)) return null;
  const logs: CycleLog[] = [];
  for (const entry of value) {
    if (
      !isRecord(entry)
      || typeof entry.date !== "string"
      || typeof entry.mood !== "string"
      || !isStringArray(entry.symptoms)
      || typeof entry.flow !== "string"
      || (entry.energy !== undefined && typeof entry.energy !== "string")
      || (entry.intimacy !== undefined && typeof entry.intimacy !== "string")
    ) return null;
    logs.push({
      date: entry.date,
      mood: entry.mood,
      symptoms: entry.symptoms,
      flow: entry.flow,
      ...(typeof entry.energy === "string" ? { energy: entry.energy } : {}),
      ...(typeof entry.intimacy === "string" ? { intimacy: entry.intimacy } : {}),
    });
  }
  return logs;
}

function migratePrototypeState(value: unknown): PersistedPrototypeState {
  if (!isRecord(value)) return INITIAL_PERSISTED_STATE;
  const selectedPlan = isRecord(value.selectedPlan)
    && typeof value.selectedPlan.name === "string"
    && typeof value.selectedPlan.price === "number"
    ? { name: value.selectedPlan.name, price: value.selectedPlan.price }
    : null;
  const points = typeof value.points === "number" && Number.isFinite(value.points)
    ? Math.max(value.points, 0)
    : INITIAL_PERSISTED_STATE.points;
  const pointsDate = typeof value.pointsDate === "string"
    ? value.pointsDate
    : typeof value.dailyPointsDate === "string"
      ? value.dailyPointsDate
      : INITIAL_PERSISTED_STATE.pointsDate;

  return {
    ...INITIAL_PERSISTED_STATE,
    selectedPlan,
    claims: isStringArray(value.claims) ? value.claims : [],
    reminders: readReminders(value.reminders) ?? getDemoReminders(),
    cycleLogs: readCycleLogs(value.cycleLogs) ?? [],
    cycleStartDate: typeof value.cycleStartDate === "string" ? value.cycleStartDate : "",
    cycleLength: typeof value.cycleLength === "number" && value.cycleLength >= 21 && value.cycleLength <= 45
      ? value.cycleLength
      : INITIAL_PERSISTED_STATE.cycleLength,
    lessonProgress: migrateLessonProgress(value),
    points,
    cashbackEarned: typeof value.cashbackEarned === "number" && Number.isFinite(value.cashbackEarned)
      ? Math.max(value.cashbackEarned, 0)
      : Math.floor(points / 50),
    cashbackRedeemedCount: typeof value.cashbackRedeemedCount === "number" && Number.isFinite(value.cashbackRedeemedCount)
      ? Math.max(value.cashbackRedeemedCount, 0)
      : INITIAL_PERSISTED_STATE.cashbackRedeemedCount,
    pointsToday: typeof value.pointsToday === "number" && Number.isFinite(value.pointsToday)
      ? Math.min(Math.max(value.pointsToday, 0), 100)
      : typeof value.dailyPoints === "number" && Number.isFinite(value.dailyPoints)
        ? Math.min(Math.max(value.dailyPoints, 0), 100)
        : INITIAL_PERSISTED_STATE.pointsToday,
    pointsDate,
    streakDays: typeof value.streakDays === "number" && Number.isFinite(value.streakDays)
      ? Math.max(value.streakDays, 0)
      : INITIAL_PERSISTED_STATE.streakDays,
    streakLastDate: typeof value.streakLastDate === "string" ? value.streakLastDate : INITIAL_PERSISTED_STATE.streakLastDate,
    carePointsDate: typeof value.carePointsDate === "string" ? value.carePointsDate : "",
  };
}

export const usePrototypeStore = create<PrototypeState>()(
  persist<PrototypeState, [], [], PersistedPrototypeState>(
    (set) => ({
      ...INITIAL_PERSISTED_STATE,
      selectPlan: (name, price) => set({ selectedPlan: { name, price } }),
      requestBenefit: (description) =>
        set((state) => ({ claims: [...state.claims, description] })),
      addReminder: (reminder) =>
        set((state) => ({
          reminders: [
            ...state.reminders,
            { ...reminder, id: crypto.randomUUID(), done: false },
          ],
        })),
      completeReminder: (id) =>
        set((state) => {
          const reminder = state.reminders.find((entry) => entry.id === id);
          if (!reminder || reminder.done) return state;
          const today = getLocalDateString(new Date());
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayKey = getLocalDateString(yesterday);
          const streakDays = state.streakLastDate === today
            ? state.streakDays
            : state.streakLastDate === yesterdayKey
              ? state.streakDays + 1
              : 1;
          const canEarnCarePoints = state.carePointsDate !== today
            && (state.pointsDate !== today || state.pointsToday < 100);
          return {
            reminders: state.reminders.map((entry) =>
              entry.id === id
                ? { ...entry, done: true, completedAt: new Date().toISOString() }
                : entry
            ),
            streakDays,
            streakLastDate: today,
            ...(canEarnCarePoints ? { ...addDailyPoints(state, 5), carePointsDate: today } : {}),
          };
        }),
      saveCycleLog: (log) =>
        set((state) => ({
          cycleLogs: [
            ...state.cycleLogs.filter(
              (entry) => entry.date !== getLocalDateString(new Date())
            ),
            { ...log, date: getLocalDateString(new Date()) },
          ],
        })),
      setCycleSettings: (startDate, length) =>
        set({ cycleStartDate: startDate, cycleLength: length }),
      completeLesson: (lessonId, quizScore, pointsReward, cashbackReward) => {
        let result: LessonCompletionResult = {
          awardedPoints: 0,
          awardedCashback: 0,
          dailyLimitReached: false,
          alreadyCompleted: false,
        };
        if (
          !lessonId
          || !Number.isInteger(quizScore)
          || quizScore < 0
          || !Number.isFinite(pointsReward)
          || pointsReward < 0
          || !Number.isFinite(cashbackReward)
          || cashbackReward < 0
        ) return result;

        set((state) => {
          if (state.lessonProgress[lessonId]?.completed) {
            result = { ...result, alreadyCompleted: true };
            return state;
          }
          const today = getLocalDateString(new Date());
          const pointsToday = state.pointsDate === today ? state.pointsToday : 0;
          const awardedPoints = Math.min(pointsReward, Math.max(100 - pointsToday, 0));
          result = {
            awardedPoints,
            awardedCashback: cashbackReward,
            dailyLimitReached: awardedPoints < pointsReward,
            alreadyCompleted: false,
          };
          return {
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: { completed: true, quizScore, completedAt: new Date().toISOString() },
            },
            points: state.points + awardedPoints,
            pointsToday: pointsToday + awardedPoints,
            pointsDate: today,
            cashbackEarned: state.cashbackEarned + cashbackReward,
          };
        });
        return result;
      },
      redeemCashback: () =>
        set((state) => state.cashbackRedeemedCount >= Math.floor(state.cashbackEarned)
          ? state
          : { cashbackRedeemedCount: state.cashbackRedeemedCount + 1 }),
    }),
    {
      name: "saude-primeiro-prototype",
      version: 5,
      migrate: migratePrototypeState,
      partialize: (state) => ({
        selectedPlan: state.selectedPlan,
        claims: state.claims,
        reminders: state.reminders,
        cycleLogs: state.cycleLogs,
        cycleStartDate: state.cycleStartDate,
        cycleLength: state.cycleLength,
        lessonProgress: state.lessonProgress,
        points: state.points,
        cashbackEarned: state.cashbackEarned,
        cashbackRedeemedCount: state.cashbackRedeemedCount,
        pointsToday: state.pointsToday,
        pointsDate: state.pointsDate,
        streakDays: state.streakDays,
        streakLastDate: state.streakLastDate,
        carePointsDate: state.carePointsDate,
      }),
    }
  )
);
