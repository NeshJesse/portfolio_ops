"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PasswordGate from "@/components/PasswordGate";

const STORAGE_KEY = "aboutMeContent";

export default function EditAboutPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    headline: "",
    summary: "",
    built: "",
    helpDeveloper: "",
    helpLeader: "",
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setForm({
          name: parsed.name ?? "",
          headline: parsed.headline ?? "",
          summary: parsed.summary ?? "",
          built: (parsed.built || [])
            .map((b) => `${b.title} :: ${b.impact}`)
            .join("\n"),
          helpDeveloper: (parsed.helpDeveloper || []).join("\n"),
          helpLeader: (parsed.helpLeader || []).join("\n"),
        });
      }
    } catch (_) {
      // ignore
    }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSave = (e) => {
    e.preventDefault();
    const payload = {
      name: form.name || "Your Name",
      headline: form.headline || "Developer • Leader • Builder",
      summary:
        form.summary ||
        "I'm a full-stack developer and engineering leader who ships products that matter.",
      built: (form.built || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [title, impact] = line.split("::");
          return {
            title: (title || "").trim(),
            impact: (impact || "").trim(),
          };
        })
        .filter((b) => b.title || b.impact),
      helpDeveloper: (form.helpDeveloper || "")
        .split(/\n+/)
        .map((x) => x.trim())
        .filter(Boolean),
      helpLeader: (form.helpLeader || "")
        .split(/\n+/)
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {
      // ignore storage errors
    }

    router.push("/about");
  };

  return (
    <PasswordGate title="Edit About">
      <section className="mx-auto max-w-3xl px-4 py-10 sm:py-12 md:py-16">
        <form
          onSubmit={onSave}
          className="rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60"
        >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Edit About
          </h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/about")}
              className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 active:scale-[0.98] dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Save
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Headline
            </label>
            <input
              name="headline"
              value={form.headline}
              onChange={onChange}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Developer • Leader • Builder"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Summary
            </label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={onChange}
              rows={4}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="Short intro about who you are and what you care about"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              What you've built (one per line: Title :: Impact)
            </label>
            <textarea
              name="built"
              value={form.built}
              onChange={onChange}
              rows={5}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder={"Project Alpha :: Reduced onboarding time by 40%\nData Pipeline :: Minutes not hours for reports"}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                How you can help (Developer) – one per line
              </label>
              <textarea
                name="helpDeveloper"
                value={form.helpDeveloper}
                onChange={onChange}
                rows={5}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder={"Design scalable architectures\nBuild delightful UIs"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                How you can help (Leader) – one per line
              </label>
              <textarea
                name="helpLeader"
                value={form.helpLeader}
                onChange={onChange}
                rows={5}
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                placeholder={"Align teams on outcomes\nGrow engineers with mentorship"}
              />
            </div>
          </div>
        </div>
        </form>
      </section>
    </PasswordGate>
  );
}


