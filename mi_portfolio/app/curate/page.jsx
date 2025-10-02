"use client";

import { useEffect, useMemo, useState } from "react";

export default function CuratePage() {
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [projRes, offRes] = await Promise.all([
          fetch("/portfolio-data/projects.json", { cache: "no-store" }),
          fetch("/official-projects", { cache: "no-store" }),
        ]);
        const projJson = await projRes.json();
        const offJson = await offRes.json().catch(() => ({ slugs: [] }));
        const projects = Array.isArray(projJson) ? projJson : projJson?.projects || [];
        if (!mounted) return;
        setProjects(projects);
        setSelected(new Set(Array.isArray(offJson?.slugs) ? offJson.slugs : []));
      } catch (e) {
        // noop
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const sorted = useMemo(() => {
    return [...projects].sort((a, b) => (a.name || a.slug).localeCompare(b.name || b.slug));
  }, [projects]);

  function toggle(slug) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const slugs = Array.from(selected);
      const res = await fetch("/official-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs }),
      });
      if (!res.ok) throw new Error("Failed");
      setMessage("Saved ✅");
    } catch (e) {
      setMessage("Save failed ❌");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Curate Official Projects</h1>
        <p className="text-sm text-black/60 dark:text-white/60">Select which projects appear as Official on the homepage.</p>
      </header>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={save} disabled={saving} className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black">
              {saving ? "Saving…" : "Save Selection"}
            </button>
            {message ? <span className="text-sm">{message}</span> : null}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sorted.map((p) => (
              <li key={p.slug} className="border rounded p-3 flex items-start gap-3">
                <input
                  id={`cb-${p.slug}`}
                  type="checkbox"
                  className="mt-1"
                  checked={selected.has(p.slug)}
                  onChange={() => toggle(p.slug)}
                />
                <label htmlFor={`cb-${p.slug}`} className="cursor-pointer select-none">
                  <div className="font-medium">{p.name || p.slug}</div>
                  {p.metadata?.framework || p.metadata?.language ? (
                    <div className="text-xs text-black/60 dark:text-white/60">
                      {[p.metadata?.framework, p.metadata?.language].filter(Boolean).join(" · ")}
                    </div>
                  ) : null}
                  {p.preview ? <p className="text-sm mt-1 line-clamp-2">{p.preview}</p> : null}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


