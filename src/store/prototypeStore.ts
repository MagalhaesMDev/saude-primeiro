import { create } from "zustand";
import { persist } from "zustand/middleware";

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

function addDailyPoints(state: PrototypeState, amount: number): Pick<PrototypeState, "points" | "dailyPoints" | "dailyPointsDate"> {
  const today = getLocalDateString(new Date());
  const alreadyEarned = state.dailyPointsDate === today ? state.dailyPoints : 0;
  const awarded = Math.min(amount, Math.max(100 - alreadyEarned, 0));
  return {
    points: state.points + awarded,
    dailyPoints: alreadyEarned + awarded,
    dailyPointsDate: today,
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
  completedLessons: string[];
  points: number;
  cashbackRedeemedCount: number;
  quizAnswered: boolean;
  quizCorrect: boolean | null;
  quizSelectedAnswer: number | null;
  quizRewardClaimed: boolean;
  trailProgress: Record<string, number>;
  dailyPoints: number;
  dailyPointsDate: string;
  streakDays: number;
  streakLastDate: string;
  carePointsDate: string;
  selectPlan: (name: string, price: number) => void;
  requestBenefit: (description: string) => void;
  addReminder: (reminder: Omit<LocalReminder, "id" | "done">) => void;
  completeReminder: (id: string) => void;
  saveCycleLog: (log: Omit<CycleLog, "date">) => void;
  setCycleSettings: (startDate: string, length: number) => void;
  completeLesson: (title: string) => void;
  completeTrailLesson: (trailId: string, lessonTitle: string) => void;
  answerQuiz: (selectedAnswer: number) => void;
  resetQuiz: () => void;
  redeemCashback: () => void;
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
  | "completeTrailLesson"
  | "answerQuiz"
  | "resetQuiz"
  | "redeemCashback"
>;

const INITIAL_PERSISTED_STATE: PersistedPrototypeState = {
  selectedPlan: null,
  claims: [],
  reminders: getDemoReminders(),
  cycleLogs: [],
  cycleStartDate: "",
  cycleLength: 28,
  completedLessons: [],
  points: 280,
  cashbackRedeemedCount: 0,
  quizAnswered: false,
  quizCorrect: null,
  quizSelectedAnswer: null,
  quizRewardClaimed: false,
  trailProgress: { work: 3, women: 0, men: 0, family: 0, wellness: 0 },
  dailyPoints: 25,
  dailyPointsDate: getLocalDateString(new Date()),
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
  const trailProgress = isRecord(value.trailProgress)
    && Object.values(value.trailProgress).every((count) => typeof count === "number" && Number.isFinite(count))
    ? value.trailProgress as Record<string, number>
    : INITIAL_PERSISTED_STATE.trailProgress;

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
    completedLessons: isStringArray(value.completedLessons) ? value.completedLessons : [],
    points: typeof value.points === "number" && Number.isFinite(value.points) ? Math.max(value.points, 0) : INITIAL_PERSISTED_STATE.points,
    cashbackRedeemedCount: typeof value.cashbackRedeemedCount === "number" && Number.isFinite(value.cashbackRedeemedCount)
      ? Math.max(value.cashbackRedeemedCount, 0)
      : INITIAL_PERSISTED_STATE.cashbackRedeemedCount,
    quizAnswered: false,
    quizCorrect: null,
    quizSelectedAnswer: null,
    quizRewardClaimed: value.quizRewardClaimed === true || (value.quizAnswered === true && value.quizCorrect === true),
    trailProgress,
    dailyPoints: typeof value.dailyPoints === "number" && Number.isFinite(value.dailyPoints)
      ? Math.min(Math.max(value.dailyPoints, 0), 100)
      : INITIAL_PERSISTED_STATE.dailyPoints,
    dailyPointsDate: typeof value.dailyPointsDate === "string" ? value.dailyPointsDate : INITIAL_PERSISTED_STATE.dailyPointsDate,
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
            && (state.dailyPointsDate !== today || state.dailyPoints < 100);
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
      completeLesson: (title) =>
        set((state) =>
          state.completedLessons.includes(title)
            ? state
            : {
                completedLessons: [...state.completedLessons, title],
                ...addDailyPoints(state, 10),
              }
        ),
      completeTrailLesson: (trailId, lessonTitle) =>
        set((state) => {
          const completedCount = state.trailProgress[trailId] ?? 0;
          if (completedCount >= 5) return state;
          return {
            trailProgress: { ...state.trailProgress, [trailId]: completedCount + 1 },
            completedLessons: state.completedLessons.includes(lessonTitle)
              ? state.completedLessons
              : [...state.completedLessons, lessonTitle],
            ...addDailyPoints(state, 10),
          };
        }),
      answerQuiz: (selectedAnswer) =>
        set((state) =>
          state.quizAnswered || !Number.isInteger(selectedAnswer) || selectedAnswer < 0 || selectedAnswer > 2
            ? state
            : {
                quizAnswered: true,
                quizCorrect: selectedAnswer === 1,
                quizSelectedAnswer: selectedAnswer,
                quizRewardClaimed: state.quizRewardClaimed || selectedAnswer === 1,
                ...addDailyPoints(state, selectedAnswer === 1 && !state.quizRewardClaimed ? 10 : 0),
              }
        ),
      resetQuiz: () =>
        set((state) => state.quizCorrect === true
          ? state
          : { quizAnswered: false, quizCorrect: null, quizSelectedAnswer: null }),
      redeemCashback: () =>
        set((state) => ({
          cashbackRedeemedCount: Math.min(
            state.cashbackRedeemedCount + 1,
            Math.floor(state.points / 50)
          ),
        })),
    }),
    {
      name: "saude-primeiro-prototype",
      version: 4,
      migrate: migratePrototypeState,
      partialize: (state) => ({
        selectedPlan: state.selectedPlan,
        claims: state.claims,
        reminders: state.reminders,
        cycleLogs: state.cycleLogs,
        cycleStartDate: state.cycleStartDate,
        cycleLength: state.cycleLength,
        completedLessons: state.completedLessons,
        points: state.points,
        cashbackRedeemedCount: state.cashbackRedeemedCount,
        quizAnswered: state.quizAnswered,
        quizCorrect: state.quizCorrect,
        quizSelectedAnswer: state.quizSelectedAnswer,
        quizRewardClaimed: state.quizRewardClaimed,
        trailProgress: state.trailProgress,
        dailyPoints: state.dailyPoints,
        dailyPointsDate: state.dailyPointsDate,
        streakDays: state.streakDays,
        streakLastDate: state.streakLastDate,
        carePointsDate: state.carePointsDate,
      }),
    }
  )
);
