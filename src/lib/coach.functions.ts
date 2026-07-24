import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callLovableAi } from "./ai-gateway.server";

const Input = z.object({
  hours: z.string().min(1),
  mood: z.string().min(1),
  diet: z.string().min(1),
});

export type CoachResult = {
  studyPlan: string;
  dietSuggestion: string;
  motivation: string;
  fallback?: boolean;
};

function buildFallback(data: { hours: string; mood: string; diet: string }): CoachResult {
  const hoursNum = Number(data.hours) || 0;
  const mood = data.mood.toLowerCase();
  const diet = data.diet.toLowerCase();

  let studyPlan: string;
  if (hoursNum < 2) {
    studyPlan =
      "Start small: schedule two focused 25-minute Pomodoro sessions today with 5-minute breaks in between. Pick one topic you've been avoiding and tackle it first. Tomorrow, aim to add one extra session. Consistency beats intensity.";
  } else if (hoursNum < 5) {
    studyPlan =
      "Solid base! Structure tomorrow into three 45-minute deep-work blocks with 10-minute breaks. Dedicate one block to reviewing today's notes, one to new material, and one to active practice like solving problems or self-quizzing.";
  } else {
    studyPlan =
      "Great effort. Protect your progress by spacing tomorrow's work into 50/10 blocks and building in a full 30-minute rest after every 2 hours. Add one active-recall session (flashcards or teaching a concept aloud) to lock in what you've learned.";
  }

  let dietSuggestion: string;
  if (diet.includes("skip")) {
    dietSuggestion =
      "Skipping meals tanks focus. Tomorrow, start with a simple breakfast: eggs or oatmeal with fruit. Keep nuts or a banana at your desk for quick fuel between study blocks, and drink a glass of water every hour.";
  } else if (diet.includes("junk")) {
    dietSuggestion =
      "Swap one junk snack for a whole-food option: a handful of almonds, Greek yogurt, or an apple with peanut butter. Add a big glass of water before each study session — hydration alone sharpens concentration noticeably.";
  } else if (diet.includes("healthy")) {
    dietSuggestion =
      "Keep it up! Add omega-3s (salmon, walnuts, chia) and leafy greens for extra brain support. A small handful of dark chocolate or berries makes a great pre-study snack.";
  } else {
    dietSuggestion =
      "Aim for a balanced plate: lean protein, complex carbs (oats, brown rice), and veggies. Keep water nearby and limit sugary drinks — steady blood sugar means steadier focus.";
  }

  let motivation: string;
  if (["low", "stressed"].some((m) => mood.includes(m))) {
    motivation =
      "Tough days are part of the journey — showing up at all is a win. Be kind to yourself, take a short walk, and remember: progress compounds. One small step today is a promise to your future self.";
  } else if (mood.includes("okay")) {
    motivation =
      "You're steady, and steady wins. Every hour you put in is quietly building the version of you that your future self will thank. Keep going — momentum is on your side.";
  } else {
    motivation =
      "You're on fire — ride this wave! Channel your energy into one meaningful task tomorrow and celebrate the win. Great days like this are proof of what you're capable of.";
  }

  return { studyPlan, dietSuggestion, motivation, fallback: true };
}

export const generateCoachPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<CoachResult> => {
    if (!process.env.LOVABLE_API_KEY) {
      return buildFallback(data);
    }

    const system =
      "You are a friendly student coach. Respond ONLY with strict JSON matching this exact shape: " +
      `{"studyPlan": string, "dietSuggestion": string, "motivation": string}. ` +
      "Each field should be 2-4 short sentences. No markdown, no code fences, no extra keys.";

    const user = `Student report:
- Study hours today: ${data.hours}
- Mood: ${data.mood}
- Diet: ${data.diet}

Give a personalized study plan, a diet suggestion, and a motivational message.`;

    try {
      const content = await callLovableAi([
        { role: "system", content: system },
        { role: "user", content: user },
      ]);

      const cleaned = content
        .trim()
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      return {
        studyPlan: String(parsed.studyPlan ?? ""),
        dietSuggestion: String(parsed.dietSuggestion ?? ""),
        motivation: String(parsed.motivation ?? ""),
      };
    } catch {
      return buildFallback(data);
    }
  });
