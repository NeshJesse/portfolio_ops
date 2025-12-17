import { getProjects } from "@/lib/projects";
import ProjectGrid from "@/components/ProjectGrid";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">All Projects</h1>
        <p className="text-sm text-black/60 dark:text-white/60">Browse all generated projects</p>
      </header>
      <ProjectGrid projects={projects} />
    </div>
  );
}


