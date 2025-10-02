import { getOfficialProjects } from "@/lib/official";
import ProjectGrid from "@/components/ProjectGrid";

export default async function OfficialProjects() {
  const projects = await getOfficialProjects();
  if (!projects.length) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Official Projects</h2>
      <ProjectGrid projects={projects} />
    </section>
  );
}


