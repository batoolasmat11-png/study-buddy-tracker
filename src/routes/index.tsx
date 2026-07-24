import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daily Check-In · Study, Mood & Diet Tracker" },
      {
        name: "description",
        content:
          "Log your daily study hours, mood, and diet in one simple form to build healthier habits.",
      },
      { property: "og:title", content: "Daily Check-In · Study, Mood & Diet Tracker" },
      {
        property: "og:description",
        content:
          "Log your daily study hours, mood, and diet in one simple form to build healthier habits.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Entry = {
  hours: string;
  mood: string;
  diet: string;
};

const MOODS = ["Great", "Good", "Okay", "Low", "Stressed"];
const DIETS = ["Healthy", "Balanced", "Junk food", "Skipped meals"];

function Index() {
  const [hours, setHours] = useState("");
  const [mood, setMood] = useState("");
  const [diet, setDiet] = useState("");
  const [submitted, setSubmitted] = useState<Entry | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!hours || !mood || !diet) return;
    setSubmitted({ hours, mood, diet });
  };

  const handleReset = () => {
    setHours("");
    setMood("");
    setDiet("");
    setSubmitted(null);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Daily Check-In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Log your study, mood, and diet for today.
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
              placeholder="e.g. 3.5"
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
              <option value="" disabled>
                Select your mood
              </option>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
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
              <option value="" disabled>
                How did you eat?
              </option>
              {DIETS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Save entry
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Reset
            </button>
          </div>
        </form>

        {submitted && (
          <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Today's entry</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Study hours</dt>
                <dd className="font-medium text-foreground">{submitted.hours}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mood</dt>
                <dd className="font-medium text-foreground">{submitted.mood}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Diet</dt>
                <dd className="font-medium text-foreground">{submitted.diet}</dd>
              </div>
            </dl>
          </section>
        )}
      </div>
    </main>
  );
}
