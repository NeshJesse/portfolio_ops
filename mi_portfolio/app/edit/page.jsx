"use client";

import PasswordGate from "@/components/PasswordGate";
import AboutMe from "@/components/AboutMe";
import Link from "next/link";

export default function EditHubPage() {
  return (
    <PasswordGate title="Editor Access">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Edit Portfolio</h1>
          <p className="text-sm text-black/60 dark:text-white/60">Authenticated editing area</p>
        </header>

        <section className="rounded-xl border border-zinc-200/60 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">About Me</h2>
            <Link href="/about/edit" className="text-sm font-medium text-blue-600 hover:underline">Open full editor</Link>
          </div>
          <div className="mt-4">
            <AboutMe />
          </div>
        </section>

        <section className="rounded-xl border border-zinc-200/60 p-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Official Projects</h2>
            <Link href="/curate" className="text-sm font-medium text-blue-600 hover:underline">Curate selection</Link>
          </div>
          <p className="mt-2 text-sm text-black/60 dark:text-white/60">Choose which projects appear on the homepage.</p>
        </section>
      </div>
    </PasswordGate>
  );
}


