import MarkdownRenderer from "@/lib/markdown";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProjectPage({ params }) {
  const { slug } = (await params) || {};
  const project = await getProjectBySlug(slug);

  if (!project) {
    return <div className="p-6">Project not found.</div>;
  }

  const { name, readme, assets, metadata, git, display } = project;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="text-sm text-black/60 dark:text-white/60">
          {metadata?.framework || metadata?.language}
        </div>
      </div>

      {Array.isArray(assets?.screenshots) && assets.screenshots.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {assets.screenshots.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={`/${src}`} alt={`${name} screenshot ${i + 1}`} className="w-full h-40 object-cover rounded" />
          ))}
        </div>
      ) : null}

      {readme?.content ? (
        <article className="prose dark:prose-invert max-w-none">
          <MarkdownRenderer content={readme.content} />
        </article>
      ) : (
        <p className="text-sm text-black/60 dark:text-white/60">No README content available.</p>
      )}
    </div>
  );
}


