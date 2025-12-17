import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProjectBySlug, getProjects } from '@/lib/projects';
import { getLanguageColor, getFrameworkColor, formatDate, formatRelativeDate } from '@/lib/utils';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ImageGallery from '@/components/ImageGallery';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
                {project.display.featured && (
                  <span className="bg-yellow-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              
              <p className="text-lg text-gray-600 mb-6">{project.readme.preview}</p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLanguageColor(project.metadata.language)}`}>
                  {project.metadata.language}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getFrameworkColor(project.metadata.framework)}`}>
                  {project.metadata.framework}
                </span>
                {project.metadata.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {project.git.remote_url && (
              <div className="lg:ml-6">
                <a
                  href={project.git.remote_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  View on GitHub
                </a>
              </div>
            )}
          </div>
          
          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{project.git.total_commits.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Commits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{project.stats.lines_of_code.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Lines of Code</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{project.stats.file_count}</div>
              <div className="text-sm text-gray-500">Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{formatRelativeDate(project.timestamps.modified)}</div>
              <div className="text-sm text-gray-500">Last Updated</div>
            </div>
          </div>
        </div>

        {/* Project Screenshots */}
        {project.assets.screenshots && project.assets.screenshots.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <ImageGallery images={project.assets.screenshots} title="Screenshots" />
          </div>
        )}

        {/* Project Description */}
        {project.readme.content && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
            <MarkdownRenderer content={project.readme.content} />
          </div>
        )}
      </div>
    </div>
  );
}
