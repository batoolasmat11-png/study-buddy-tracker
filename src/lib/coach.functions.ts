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
};

export const generateCoachPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<CoachResult> => {
    const system =
      "You are a friendly student coach. Respond ONLY with strict JSON matching this exact shape: " +
      `{"studyPlan": string, "dietSuggestion": string, "motivation": string}. ` +
      "Each field should be 2-4 short sentences. No markdown, no code fences, no extra keys.";

    const user = `Student report:
- Study hours today: ${data.hours}
- Mood: ${data.mood}
- Diet: ${data.diet}

Give a personalized study plan, a diet suggestion, and a motivational message.`;

    const content = await callLovableAi([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    const cleaned = content
      .trim()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);
      return {
        studyPlan: String(parsed.studyPlan ?? ""),
        dietSuggestion: String(parsed.dietSuggestion ?? ""),
        motivation: String(parsed.motivation ?? ""),
      };
    } catch {
      return {
        studyPlan: content,
        dietSuggestion: "",
        motivation: "",
      };
    }
  });
