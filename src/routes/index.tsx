import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { generateCoachPlan, type CoachResult } from "@/lib/coach.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Study Coach · AI Study Plan, Diet & Motivation" },
      {
        name: "description",
        content:
          "Log your study hours, mood, and diet — get an AI-generated study plan, diet tip, and motivation.",
      },
      { property: "og:title", content: "Study Coach · AI Study Plan, Diet & Motivation" },
      {
        property: "og:description",
        content:
          "Log your study hours, mood, and diet — get an AI-generated study plan, diet tip, and motivation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MOODS = ["Great", "Good", "Okay", "Low", "Stressed"];
const DIETS = ["Healthy", "Balanced", "Junk food", "Skipped meals"];

function Index() {
  const generate = useServerFn(generateCoachPlan);
  const [hours, setHours] = useState("");
  const [mood, setMood] = useState("");
  const [diet, setDiet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CoachResult | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!hours || !mood || !diet) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await generate({ data: { hours, mood, diet } });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Study Coach</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Share how your day went. Get an AI study plan, diet tip, and motivation.
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
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Generating your plan…" : "Get my plan"}
          </button>

          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}
        </form>

        {result && (
          <section className="mt-6 space-y-4">
            {result.fallback && (
              <p className="rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
                Showing offline suggestions — AI service unavailable.
              </p>
            )}
            <ResultCard title="Study Plan" body={result.studyPlan} />
            {result.dietSuggestion && (
              <ResultCard title="Diet Suggestion" body={result.dietSuggestion} />
            )}
            {result.motivation && (
              <ResultCard title="Motivation" body={result.motivation} />
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function ResultCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{body}</p>
    </article>
  );
}
