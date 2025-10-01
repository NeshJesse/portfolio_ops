import ProjectCard from "./ProjectCard";

export default function ProjectGrid({ projects }) {
  if (!Array.isArray(projects) || projects.length === 0) {
    return <div className="text-sm text-black/60 dark:text-white/60">No projects found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((p) => (
        <ProjectCard key={p.slug} project={p} />
      ))}
    </div>
  );
}


