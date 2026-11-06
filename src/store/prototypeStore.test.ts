import { beforeEach, describe, expect, it } from "vitest";
import { usePrototypeStore } from "./prototypeStore";

describe("prototypeStore", () => {
  beforeEach(() => {
    usePrototypeStore.setState({
      selectedPlan: null,
      claims: [],
      reminders: [],
      cycleLogs: [],
      cycleStartDate: "",
      cycleLength: 28,
      completedLessons: [],
      points: 0,
      cashbackRedeemedCount: 0,
      quizAnswered: false,
      quizCorrect: null,
      quizSelectedAnswer: null,
      quizRewardClaimed: false,
      trailProgress: { work: 3, women: 0, men: 0, family: 0, wellness: 0 },
      dailyPoints: 0,
      dailyPointsDate: new Date().toLocaleDateString("en-CA"),
      streakDays: 0,
      streakLastDate: "",
      carePointsDate: "",
    });
  });

  it("saves selected plans and benefit requests", () => {
    usePrototypeStore.getState().selectPlan("Essencial", 14.9);
    usePrototypeStore.getState().requestBenefit("Diária por internação");

    expect(usePrototypeStore.getState().selectedPlan).toEqual({
      name: "Essencial",
      price: 14.9,
    });
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
    const store = usePrototypeStore.getState();
    store.addReminder({ title: "Consulta", type: "CONSULTATION", scheduledAt: new Date().toISOString(), details: "" });
    store.addReminder({ title: "Exame", type: "EXAM", scheduledAt: new Date().toISOString(), details: "" });
    const [consultation, exam] = usePrototypeStore.getState().reminders;

    usePrototypeStore.getState().completeReminder(consultation.id);
    usePrototypeStore.getState().completeReminder(exam.id);

    expect(usePrototypeStore.getState().points).toBe(5);
    expect(usePrototypeStore.getState().carePointsDate).toBe(new Date().toLocaleDateString("en-CA"));
  });

  it("awards lesson and quiz points only once", () => {
    const store = usePrototypeStore.getState();
    store.completeLesson("Prevenção");
    store.completeLesson("Prevenção");
    store.answerQuiz(1);
    store.answerQuiz(1);

    expect(usePrototypeStore.getState().points).toBe(20);
    expect(usePrototypeStore.getState().completedLessons).toEqual(["Prevenção"]);
    expect(usePrototypeStore.getState().quizCorrect).toBe(true);
    expect(usePrototypeStore.getState().quizSelectedAnswer).toBe(1);
  });

  it("keeps an incorrect quiz answer without awarding points", () => {
    usePrototypeStore.getState().answerQuiz(0);

    expect(usePrototypeStore.getState().quizAnswered).toBe(true);
    expect(usePrototypeStore.getState().quizCorrect).toBe(false);
    expect(usePrototypeStore.getState().quizSelectedAnswer).toBe(0);
    expect(usePrototypeStore.getState().points).toBe(0);
  });

  it("allows retrying a wrong answer and awards quiz points only once", () => {
    const store = usePrototypeStore.getState();
    store.answerQuiz(0);
    store.resetQuiz();
    usePrototypeStore.getState().answerQuiz(1);
    const pointsAfterCorrect = usePrototypeStore.getState().points;

    usePrototypeStore.getState().resetQuiz();
    usePrototypeStore.getState().answerQuiz(1);

    expect(pointsAfterCorrect).toBe(10);
    expect(usePrototypeStore.getState().points).toBe(pointsAfterCorrect);
    expect(usePrototypeStore.getState().quizRewardClaimed).toBe(true);
  });

  it("does not award quiz points above the daily limit", () => {
    usePrototypeStore.setState({ points: 95, dailyPoints: 95 });
    usePrototypeStore.getState().answerQuiz(1);

    expect(usePrototypeStore.getState().points).toBe(100);
    expect(usePrototypeStore.getState().dailyPoints).toBe(100);
  });

  it("ignores invalid quiz answers", () => {
    usePrototypeStore.getState().answerQuiz(4);

    expect(usePrototypeStore.getState().quizAnswered).toBe(false);
    expect(usePrototypeStore.getState().points).toBe(0);
  });

  it("tracks progress by trail and caps daily points at 100", () => {
    usePrototypeStore.setState({ points: 95, dailyPoints: 95 });
    const store = usePrototypeStore.getState();
    store.completeTrailLesson("work", "Work lesson 4");
    store.completeTrailLesson("work", "Work lesson 5");

    expect(usePrototypeStore.getState().trailProgress.work).toBe(5);
    expect(usePrototypeStore.getState().points).toBe(100);
    expect(usePrototypeStore.getState().dailyPoints).toBe(100);
  });

  it("limits demonstrative cashback redemption to earned points", () => {
    usePrototypeStore.setState({ points: 50 });
    const store = usePrototypeStore.getState();
    store.redeemCashback();
    store.redeemCashback();

    expect(usePrototypeStore.getState().cashbackRedeemedCount).toBe(1);
  });

  it("migrates demo reminder copy without dropping personal entries", async () => {
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
      completedLessons: ["Lição"],
      points: 280,
    }, 1);

    expect(migrated?.reminders[0].title).toBe("Teleconsulta com Dr. Marcos");
    expect(migrated?.reminders[1].title).toBe("Meu exame");
    expect(migrated?.cycleLogs).toHaveLength(1);
    expect(migrated?.cycleStartDate).toBe("2026-10-25");
    expect(migrated?.quizAnswered).toBe(false);
    expect(migrated?.quizSelectedAnswer).toBe(null);
  });
});
