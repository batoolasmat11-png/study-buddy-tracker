import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Study Coach · Study Plan, Diet & Motivation" },
      {
        name: "description",
        content:
          "Log your study hours, mood, and diet — get a tailored study plan with mood and diet tips.",
      },
      { property: "og:title", content: "Study Coach · Study Plan, Diet & Motivation" },
      {
        property: "og:description",
        content:
          "Log your study hours, mood, and diet — get a tailored study plan with mood and diet tips.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MOODS = ["Great", "Good", "Okay", "Tired", "Stressed"];
const DIETS = ["Healthy", "Balanced", "Unhealthy", "Skipped meals"];

type Plan = { title: string; items: string[]; extras: string[] };

function buildPlan(hours: number, mood: string, diet: string): Plan {
  let title: string;
  let items: string[];

  if (hours <= 1) {
    title = "Quick Plan";
    items = ["40 minutes study", "20 minutes revision"];
  } else if (hours <= 3) {
    title = "Balanced Plan";
    items = ["Learn concepts", "Practice questions", "Revise key points"];
  } else {
    title = "Full Study Plan";
    items = ["Deep learning", "Practice exercises", "Revision", "Take a self-test"];
  }

  const extras: string[] = [];
  if (mood.toLowerCase() === "tired") extras.push("Take short breaks");
  if (diet.toLowerCase() === "unhealthy") extras.push("Eat healthy food for better focus");

  return { title, items, extras };
}

function Index() {
  const [hours, setHours] = useState("");
  const [mood, setMood] = useState("");
  const [diet, setDiet] = useState("");
  const [plan, setPlan] = useState<Plan | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!hours || !mood || !diet) return;
    setPlan(buildPlan(Number(hours) || 0, mood, diet));
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Study Coach</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your study hours, mood, and diet to get a tailored plan.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-foreground">
              Study hours
            </label>
            <input
              id="hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g. 2"
              required
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-foreground">
              Mood
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>Select your mood</option>
              {MOODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="diet" className="block text-sm font-medium text-foreground">
              Diet
            </label>
            <select
              id="diet"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="" disabled>How did you eat?</option>
              {DIETS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get my plan
          </button>
        </form>

        {plan && (
          <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">{plan.title}</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {plan.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {plan.extras.length > 0 && (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-foreground">
                {plan.extras.map((extra) => (
                  <li key={extra}>{extra}</li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
