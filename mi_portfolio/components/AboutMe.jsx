"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_CONTENT = {
  name: "Your Name",
  headline: "Developer • Leader • Builder",
  summary:
    "I'm a full-stack developer and engineering leader who ships products that matter. I care about craft, clarity, and compounding impact.",
  built:
    [
      {
        title: "Project Alpha",
        impact:
          "Reduced onboarding time by 40% and served 50k+ monthly active users.",
      },
      {
        title: "Data Pipeline",
        impact: "Cut reporting latency from hours to minutes across the org.",
      },
      {
        title: "Design System",
        impact: "Unified UX, sped up delivery by ~25% across product teams.",
      },
    ],
  helpDeveloper: [
    "Design scalable architectures and ship reliable features",
    "Build clean APIs, resilient services, and delightful UIs",
    "Uplift teams with documentation, reviews, and enablement",
  ],
  helpLeader: [
    "Align teams on outcomes and iterate with fast feedback loops",
    "Prioritize roadmaps, clarify ownership, and reduce risk",
    "Grow engineers with mentorship and pragmatic processes",
  ],
};

const STORAGE_KEY = "aboutMeContent";

export default function AboutMe({ readOnly = false }) {
  const router = useRouter();
  const [content, setContent] = useState(DEFAULT_CONTENT);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setContent((prev) => ({ ...prev, ...parsed }));
      }
    } catch (_) {
      // ignore parse errors and keep defaults
    }
  }, []);

  return (
    <section className=" px-4 py-10 sm:py-12 md:py-16">
      <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {content.name}
            </h1>
            <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {content.headline}
            </p>
          </div>
          {!readOnly && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/about/edit")}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-zinc-700 dark:text-zinc-300">{content.summary}</p>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            What I’ve built and its impact
          </h2>
          <ul className="mt-3 space-y-3">
            {content.built.map((item, idx) => (
              <li
                key={`${item.title}-${idx}`}
                className="rounded-lg border border-zinc-200/70 bg-white/70 p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </div>
                <div className="mt-1 text-zinc-700 dark:text-zinc-300">
                  {item.impact}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-200/60 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/40">
            <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-200">
              How I can help as a developer
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-emerald-900/90 dark:text-emerald-200/90">
              {content.helpDeveloper.map((point, idx) => (
                <li key={`dev-${idx}`}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-indigo-200/60 bg-indigo-50 p-5 dark:border-indigo-900/50 dark:bg-indigo-950/40">
            <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-200">
              How I can help as a leader
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-indigo-900/90 dark:text-indigo-200/90">
              {content.helpLeader.map((point, idx) => (
                <li key={`lead-${idx}`}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}


