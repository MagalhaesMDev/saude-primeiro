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
}

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
      title: "Teleconsulta de rotina",
      type: "CONSULTATION",
      scheduledAt: consultation.toISOString(),
      details: "Exemplo demonstrativo; nenhum agendamento foi feito.",
      done: false,
    },
    {
      id: "demo-exam",
      title: "Hemograma completo + glicemia",
      type: "EXAM",
      scheduledAt: tomorrow.toISOString(),
      details: "Exemplo demonstrativo; confirme preparo com seu serviço de saúde.",
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
  selectPlan: (name: string, price: number) => void;
  requestBenefit: (description: string) => void;
  addReminder: (reminder: Omit<LocalReminder, "id" | "done">) => void;
  completeReminder: (id: string) => void;
  saveCycleLog: (log: Omit<CycleLog, "date">) => void;
  setCycleSettings: (startDate: string, length: number) => void;
  completeLesson: (title: string) => void;
  answerQuiz: (correct: boolean) => void;
  redeemCashback: () => void;
}

export const usePrototypeStore = create<PrototypeState>()(
  persist(
    (set) => ({
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
        set((state) => ({
          reminders: state.reminders.map((reminder) =>
            reminder.id === id
              ? { ...reminder, done: true, completedAt: new Date().toISOString() }
              : reminder
          ),
        })),
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
                points: state.points + 10,
              }
        ),
      answerQuiz: (correct) =>
        set((state) =>
          state.quizAnswered
            ? state
            : {
                quizAnswered: true,
                quizCorrect: correct,
                points: state.points + (correct ? 10 : 0),
              }
        ),
      redeemCashback: () =>
        set((state) => ({
          cashbackRedeemedCount: Math.min(
            state.cashbackRedeemedCount + 1,
            Math.floor(state.points / 50)
          ),
        })),
    }),
    { name: "saude-primeiro-prototype" }
  )
);
