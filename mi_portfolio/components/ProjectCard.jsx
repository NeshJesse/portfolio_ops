import Link from "next/link";

export default function ProjectCard({ project }) {
  const { slug, name, display, metadata, readme, assets, git } = project || {};
  const preview = readme?.preview || "";
  const featured = display?.featured;
  const framework = metadata?.framework || metadata?.language;
  const screenshot = assets?.thumbnail || assets?.logo || assets?.screenshots?.[0];

  return (
    <Link href={`/projects/${slug}`} className="block rounded-lg border border-black/10 dark:border-white/10 p-4 hover:shadow-sm transition">
      <div className="flex flex-col gap-3">
        {screenshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/${screenshot}`} alt={name} className="w-full h-40 object-cover rounded" />
        ) : null}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">{name}</h3>
          {featured ? (
            <span className="text-xs px-2 py-1 rounded bg-yellow-200 text-yellow-900">Featured</span>
          ) : null}
        </div>
        <div className="text-xs text-black/60 dark:text-white/60">{framework}</div>
        <p className="text-sm text-black/70 dark:text-white/70 line-clamp-3">{preview}</p>
        {git?.last_commit ? (
          <div className="text-[11px] text-black/50 dark:text-white/50">Updated: {new Date(git.last_commit).toLocaleDateString()}</div>
        ) : null}
      </div>
    </Link>
  );
}


