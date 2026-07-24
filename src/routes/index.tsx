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

type PlanItem = { emoji: string; title: string; detail: string };
type Plan = {
  greeting: string;
  title: string;
  intro: string;
  items: PlanItem[];
  moodNote?: string;
  dietNote?: string;
  motivation: string;
};

function buildPlan(hours: number, mood: string, diet: string): Plan {
  const moodLower = mood.toLowerCase();
  const dietLower = diet.toLowerCase();

  const greetings: Record<string, string> = {
    great: "Hey superstar! 🌟",
    good: "Hey there! 😊",
    okay: "Hi friend! 👋",
    tired: "Hey, I see you 💛",
    stressed: "Take a breath — I've got you 🌿",
  };
  const greeting = greetings[moodLower] ?? "Hey there! 👋";

  let title: string;
  let intro: string;
  let items: PlanItem[];

  if (hours <= 1) {
    title = "⚡ Your Quick Plan";
    intro =
      "Short on time? No problem — small, focused sessions add up faster than you'd think. Here's a light routine to keep your momentum going today:";
    items = [
      {
        emoji: "📖",
        title: "40 minutes of focused study",
        detail:
          "Pick ONE topic, silence your phone, and go deep. Quality beats quantity every single time.",
      },
      {
        emoji: "🔁",
        title: "20 minutes of revision",
        detail:
          "Skim your notes and try to recall the main ideas from memory before checking. That tiny effort locks it in.",
      },
    ];
  } else if (hours <= 3) {
    title = "⚖️ Your Balanced Plan";
    intro =
      "Nice — you've carved out real study time today. Let's make every minute count with a mix of learning, practice, and review:";
    items = [
      {
        emoji: "🧠",
        title: "Learn new concepts",
        detail:
          "Start with the hardest topic while your mind is fresh. Read actively — underline, ask questions, take short notes.",
      },
      {
        emoji: "✍️",
        title: "Practice questions",
        detail:
          "Apply what you just learned. Getting things wrong here is a WIN — it shows you exactly what to fix.",
      },
      {
        emoji: "🔎",
        title: "Revise key points",
        detail:
          "End with a 15-minute recap. Close the book and explain today's lesson out loud, like you're teaching a friend.",
      },
    ];
  } else {
    title = "🚀 Your Full Study Plan";
    intro =
      "Wow — you're putting in serious work today. Let's channel that energy into a well-structured deep-work day:";
    items = [
      {
        emoji: "🧠",
        title: "Deep learning block",
        detail:
          "Dive into a challenging topic for 60–90 minutes with zero distractions. This is where real growth happens.",
      },
      {
        emoji: "✍️",
        title: "Practice exercises",
        detail:
          "Work through problems until you can solve them without peeking. Struggle is the sign your brain is leveling up.",
      },
      {
        emoji: "🔁",
        title: "Revision session",
        detail:
          "Revisit yesterday's material too — spaced repetition is your secret weapon for long-term memory.",
      },
      {
        emoji: "📝",
        title: "Self-test",
        detail:
          "Finish with a timed mini-test. It builds real exam confidence and shows you what to focus on tomorrow.",
      },
    ];
  }

  let moodNote: string | undefined;
  if (moodLower === "tired") {
    moodNote =
      "😴 I hear you — you're running low today. Please take short breaks (5 minutes every 25) and drink some water. Rest isn't lazy, it's fuel. Even a slow study day is still a step forward. 💛";
  } else if (moodLower === "stressed") {
    moodNote =
      "🌿 Take 3 slow, deep breaths before you start. Break the plan into tiny 15-minute chunks — you don't have to do it all at once. You've handled hard days before, and you'll handle this one too.";
  } else if (moodLower === "great") {
    moodNote =
      "🔥 You're in a golden state — ride that wave! This is the perfect time to tackle the topic you've been putting off.";
  }

  let dietNote: string | undefined;
  if (dietLower === "unhealthy" || dietLower === "skipped meals") {
    dietNote =
      "🥗 Your brain runs on what you feed it. Try adding some real food — fruit, nuts, eggs, or a warm meal — so your focus doesn't crash mid-session. Small swaps make a huge difference in how sharp you feel.";
  } else if (dietLower === "healthy") {
    dietNote =
      "🥑 Love it — your body is fueled and ready. Keep sipping water between study blocks and you'll feel unstoppable.";
  }

  const motivations = [
    "Remember: you don't have to be perfect today — you just have to show up. I'm proud of you for even planning your day. Let's go! 💪",
    "Every page you read, every question you try — it's a small deposit into future-you's success account. Keep going. ✨",
    "Progress > perfection. One focused hour today beats a 'someday' that never comes. You've got this. 🌱",
  ];
  const motivation = motivations[Math.floor(Math.random() * motivations.length)];

  return { greeting, title, intro, items, moodNote, dietNote, motivation };
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
