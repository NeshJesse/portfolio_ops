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
        const offJson = await offRes.json().catch(() => ({ slugs: [], keys: [] }));
        const projects = Array.isArray(projJson) ? projJson : projJson?.projects || [];
        if (!mounted) return;
        setProjects(projects);
        const currentKeys = Array.isArray(offJson?.keys) ? offJson.keys : [];
        const currentSlugs = Array.isArray(offJson?.slugs) ? offJson.slugs : [];
        const keysFromSlugs = new Set(
          projects.filter((p) => currentSlugs.includes(p.slug)).map((p) => buildProjectKey(p))
        );
        setSelected(new Set([...(currentKeys || []), ...keysFromSlugs]));
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

  function buildProjectKey(project) {
    const preferred =
      project?.path ||
      project?.dir ||
      project?.root ||
      project?.location ||
      project?.project_dir ||
      project?.git?.remote_url ||
      project?.id;
    if (preferred) return `${project.slug}::${preferred}`;
    return `slug::${project.slug}`;
  }

  function toggleByProject(project) {
    const key = buildProjectKey(project);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const keys = Array.from(selected);
      const selectedProjects = sorted.filter((p) => keys.includes(buildProjectKey(p)));
      const res = await fetch("/official-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys, projects: selectedProjects }),
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
              <li key={buildProjectKey(p)} className="border rounded p-3 flex items-start gap-3">
                <input
                  id={`cb-${buildProjectKey(p)}`}
                  type="checkbox"
                  className="mt-1"
                  checked={selected.has(buildProjectKey(p))}
                  onChange={() => toggleByProject(p)}
                />
                <label htmlFor={`cb-${buildProjectKey(p)}`} className="cursor-pointer select-none">
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


