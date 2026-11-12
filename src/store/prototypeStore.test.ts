import { beforeEach, describe, expect, it } from "vitest";
import { usePrototypeStore } from "./prototypeStore";

function todayKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

describe("prototypeStore", () => {
  beforeEach(() => {
    usePrototypeStore.setState({
      selectedPlan: null,
      claims: [],
      reminders: [],
      cycleLogs: [],
      cycleStartDate: "",
      cycleLength: 28,
      lessonProgress: {},
      points: 0,
      cashbackEarned: 0,
      cashbackRedeemedCount: 0,
      pointsToday: 0,
      pointsDate: todayKey(),
      streakDays: 0,
      streakLastDate: "",
      carePointsDate: "",
    });
  });

  it("saves selected plans and benefit requests", () => {
    usePrototypeStore.getState().selectPlan("Essencial", 14.9);
    usePrototypeStore.getState().requestBenefit("Diária por internação");

    expect(usePrototypeStore.getState().selectedPlan).toEqual({ name: "Essencial", price: 14.9 });
    expect(usePrototypeStore.getState().claims).toEqual(["Diária por internação"]);
  });

  it("creates and completes reminders", () => {
    usePrototypeStore.getState().addReminder({
      title: "Exame",
      type: "EXAM",
      scheduledAt: "2026-11-06T09:00:00.000Z",
      details: "",
    });
    const [reminder] = usePrototypeStore.getState().reminders;

    expect(reminder.done).toBe(false);
    usePrototypeStore.getState().completeReminder(reminder.id);
    expect(usePrototypeStore.getState().reminders[0].done).toBe(true);
  });

  it("awards the care reminder bonus only once per day", () => {
    usePrototypeStore.getState().addReminder({ title: "Consulta", type: "CONSULTATION", scheduledAt: new Date().toISOString(), details: "" });
    usePrototypeStore.getState().addReminder({ title: "Exame", type: "EXAM", scheduledAt: new Date().toISOString(), details: "" });
    const [consultation, exam] = usePrototypeStore.getState().reminders;

    usePrototypeStore.getState().completeReminder(consultation.id);
    usePrototypeStore.getState().completeReminder(exam.id);

    expect(usePrototypeStore.getState().points).toBe(5);
    expect(usePrototypeStore.getState().carePointsDate).toBe(todayKey());
  });

  it("records quiz score and awards lesson rewards only once", () => {
    const store = usePrototypeStore.getState();
    const first = store.completeLesson("work-ride", 2, 10, 0.2);
    const second = usePrototypeStore.getState().completeLesson("work-ride", 1, 10, 0.2);

    expect(first).toMatchObject({ awardedPoints: 10, awardedCashback: 0.2, alreadyCompleted: false });
    expect(second).toMatchObject({ awardedPoints: 0, awardedCashback: 0, alreadyCompleted: true });
    expect(usePrototypeStore.getState().lessonProgress["work-ride"]).toMatchObject({ completed: true, quizScore: 2 });
    expect(usePrototypeStore.getState().points).toBe(10);
    expect(usePrototypeStore.getState().cashbackEarned).toBe(0.2);
  });

  it("completes a lesson at the daily cap and warns without exceeding 100 points", () => {
    usePrototypeStore.setState({ points: 95, pointsToday: 95 });

    const result = usePrototypeStore.getState().completeLesson("work-load", 1, 15, 0.2);

    expect(result).toMatchObject({ awardedPoints: 5, dailyLimitReached: true, alreadyCompleted: false });
    expect(usePrototypeStore.getState().lessonProgress["work-load"]?.completed).toBe(true);
    expect(usePrototypeStore.getState().points).toBe(100);
    expect(usePrototypeStore.getState().pointsToday).toBe(100);
    expect(usePrototypeStore.getState().cashbackEarned).toBe(0.2);
  });

  it("completes lessons without points once the daily limit is reached", () => {
    usePrototypeStore.setState({ points: 100, pointsToday: 100 });

    const result = usePrototypeStore.getState().completeLesson("work-weather", 0, 15, 0.2);

    expect(result).toMatchObject({ awardedPoints: 0, dailyLimitReached: true });
    expect(usePrototypeStore.getState().lessonProgress["work-weather"]?.completed).toBe(true);
    expect(usePrototypeStore.getState().points).toBe(100);
    expect(usePrototypeStore.getState().cashbackEarned).toBe(0.2);
  });

  it("limits simulated cashback redemption to whole earned reais", () => {
    usePrototypeStore.setState({ cashbackEarned: 2.5 });
    const store = usePrototypeStore.getState();
    store.redeemCashback();
    store.redeemCashback();
    store.redeemCashback();

    expect(usePrototypeStore.getState().cashbackRedeemedCount).toBe(2);
  });

  it("migrates old lesson progress and daily-point fields", async () => {
    const migrate = usePrototypeStore.persist.getOptions().migrate;
    expect(migrate).toBeDefined();
    const migrated = await migrate?.({
      reminders: [
        { id: "demo-consultation", title: "Teleconsulta de rotina", type: "CONSULTATION", scheduledAt: "2026-11-05T17:30:00.000Z", details: "old", done: false },
        { id: "custom", title: "Meu exame", type: "EXAM", scheduledAt: "2026-11-08T17:30:00.000Z", details: "pessoal", done: false },
      ],
      cycleLogs: [{ date: "2026-11-04", mood: "😊", symptoms: [], flow: "Leve" }],
      cycleStartDate: "2026-10-25",
      cycleLength: 28,
      completedLessons: ["work-weather"],
      trailProgress: { work: 1 },
      points: 280,
      dailyPoints: 35,
      dailyPointsDate: todayKey(),
      quizAnswered: true,
      quizCorrect: true,
      quizSelectedAnswer: 1,
      quizRewardClaimed: true,
    }, 4);

    expect(migrated?.reminders[0].title).toBe("Teleconsulta com Dr. Marcos");
    expect(migrated?.reminders[1].title).toBe("Meu exame");
    expect(migrated?.cycleLogs).toHaveLength(1);
    expect(migrated?.cycleStartDate).toBe("2026-10-25");
    expect(migrated?.lessonProgress["work-ride"]?.completed).toBe(true);
    expect(migrated?.lessonProgress["work-weather"]?.completed).toBe(true);
    expect(migrated?.pointsToday).toBe(35);
    expect(migrated?.pointsDate).toBe(todayKey());
    expect(migrated?.cashbackEarned).toBe(5);
    expect("quizAnswered" in (migrated ?? {})).toBe(false);
  });
});
