import { describe, expect, it } from "vitest";
import {
  getNextLessonAcrossTrails,
  getTrailProgress,
  LESSON_TRAILS,
} from "./lessons";

describe("lesson data", () => {
  it("provides complete trail and lesson content", () => {
    expect(LESSON_TRAILS.length).toBeGreaterThan(0);

    for (const trail of LESSON_TRAILS) {
      expect(trail.lessons).toHaveLength(3);
      expect(trail.audiences).toContain("todos");
      for (const lesson of trail.lessons) {
        expect(lesson.steps.length).toBeGreaterThanOrEqual(3);
        expect(lesson.steps.length).toBeLessThanOrEqual(4);
        expect(lesson.imageSrc).toBe(`/lessons/${lesson.id}.jpg`);
        expect(lesson.imageAlt).toBeTruthy();
        expect(lesson.quiz).toHaveLength(2);
        for (const question of lesson.quiz) {
          expect(question.correctIndex).toBeGreaterThanOrEqual(0);
          expect(question.correctIndex).toBeLessThan(question.options.length);
          expect(question.explanation).toBeTruthy();
        }
      }
    }
  });

  it("selects the next unfinished lesson and reports per-trail progress", () => {
    const progress = {
      "work-ride": { completed: true, quizScore: 2, completedAt: "2026-11-12T00:00:00.000Z" },
    };
    const trail = LESSON_TRAILS[0];

    expect(getTrailProgress(trail, progress)).toEqual({ completed: 1, total: 3 });
    expect(getNextLessonAcrossTrails(LESSON_TRAILS, progress)?.lesson.id).toBe("work-load");
  });
});
