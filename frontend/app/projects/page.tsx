import { getProjects, getFeaturedProjects, getAllCategories, getAllLanguages, getAllTags } from '@/lib/projects';
import { getProjectStats } from '@/lib/utils';
import ProjectsPageClient from '@/components/ProjectsPageClient';

export default async function ProjectsPage() {
  const [
    projects,
    featured,
    categories,
    languages,
    tags
  ] = await Promise.all([
    getProjects(),
    getFeaturedProjects(),
    getAllCategories(),
    getAllLanguages(),
    getAllTags(),
  ]);

  const stats = getProjectStats(projects);

  return (
    <ProjectsPageClient
      initialAllProjects={projects}
      initialFeaturedProjects={featured}
      initialCategories={categories}
      initialLanguages={languages}
      initialTags={tags}
      stats={stats}
    />
  );
}
