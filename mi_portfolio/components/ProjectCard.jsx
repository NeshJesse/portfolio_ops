import Link from "next/link";

export default function ProjectCard({ project }) {
  const { slug, name, display, metadata, readme, assets, git } = project || {};
  const preview = readme?.preview || "";
  const featured = display?.featured;
  const framework = metadata?.framework || metadata?.language;
  const screenshot = assets?.thumbnail || assets?.logo || assets?.screenshots?.[0];
  const githubUrl = git?.remote_url;
  const tags = Array.isArray(metadata?.tags) ? metadata.tags : [];
  const language = metadata?.language;
  const type = metadata?.type;
  const stats = project?.stats || {};
  const lastUpdated = git?.last_commit ? new Date(git.last_commit) : null;

  return (
    <div className="rounded-lg border border-black/10 dark:border-white/10 hover:shadow-sm transition overflow-hidden bg-white dark:bg-black">
     
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/projects/${slug}`} className="block">
            <h3 className="font-semibold text-base leading-snug">{name}</h3>
          </Link>
          {featured ? (
            <span className="shrink-0 text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-900">Featured</span>
          ) : null}
        </div>
        <div className="text-xs text-black/60 dark:text-white/60">
          {[framework, language, type].filter(Boolean).join(" · ")}
        </div>
        {tags.length ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70">
                {t}
              </span>
            ))}
            {tags.length > 5 ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-black/70 dark:text-white/70">+{tags.length - 5}</span>
            ) : null}
          </div>
        ) : null}
        {preview ? (
          <p className="text-sm text-black/70 dark:text-white/70 line-clamp-3">{preview}</p>
        ) : null}
        <div className="flex items-center justify-between text-[11px] text-black/60 dark:text-white/60">
          <div className="flex items-center gap-3">
            {Number.isFinite(stats.lines_of_code) ? <span>{stats.lines_of_code.toLocaleString()} LOC</span> : null}
            {Number.isFinite(stats.file_count) ? <span>{stats.file_count.toLocaleString()} files</span> : null}
            {git?.total_commits ? <span>{git.total_commits} commits</span> : null}
          </div>
          {lastUpdated ? <span>Updated {lastUpdated.toLocaleDateString()}</span> : null}
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-[11px]">
            {project?.stats?.has_tests ? (
              <span className="px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Tests</span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60">No tests</span>
            )}
            {project?.stats?.has_docs ? (
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Docs</span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60">No docs</span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            {githubUrl ? (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white underline-offset-2 hover:underline">
                GitHub
              </a>
            ) : null}
            {readme?.has_demo && readme?.demo_url ? (
              <a href={readme.demo_url} target="_blank" rel="noopener noreferrer" className="text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white underline-offset-2 hover:underline">
                Demo
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}


