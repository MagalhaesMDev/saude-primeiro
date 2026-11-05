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

  it("awards lesson and quiz points only once", () => {
    const store = usePrototypeStore.getState();
    store.completeLesson("Prevenção");
    store.completeLesson("Prevenção");
    store.answerQuiz(true);
    store.answerQuiz(true);

    expect(usePrototypeStore.getState().points).toBe(20);
    expect(usePrototypeStore.getState().completedLessons).toEqual(["Prevenção"]);
    expect(usePrototypeStore.getState().quizCorrect).toBe(true);
  });

  it("keeps an incorrect quiz answer without awarding points", () => {
    usePrototypeStore.getState().answerQuiz(false);

    expect(usePrototypeStore.getState().quizAnswered).toBe(true);
    expect(usePrototypeStore.getState().quizCorrect).toBe(false);
    expect(usePrototypeStore.getState().points).toBe(0);
  });

  it("limits demonstrative cashback redemption to earned points", () => {
    usePrototypeStore.setState({ points: 50 });
    const store = usePrototypeStore.getState();
    store.redeemCashback();
    store.redeemCashback();

    expect(usePrototypeStore.getState().cashbackRedeemedCount).toBe(1);
  });
});
