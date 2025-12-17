import { getAboutData, getExperienceData, getSkillsData } from '@/app/actions';
import { getFeaturedProjects } from '@/lib/projects';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';

export default async function HomePage() {
  const [featuredProjects, aboutData, experienceData, skillsData] = await Promise.all([
    getFeaturedProjects(),
    getAboutData(),
    getExperienceData(),
    getSkillsData(),
  ]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {aboutData?.name || 'Full Stack Developer'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {aboutData?.title || 'Building exceptional digital experiences with modern web technologies'}
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              href="/projects" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View My Work
            </Link>
            <Link 
              href="/contact" 
              className="bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="max-w-3xl mx-auto text-lg text-gray-600">
            <p className="mb-6">
              {aboutData?.summary || 'Passionate developer with experience in building modern web applications.'}
            </p>
            <Link 
              href="/about" 
              className="text-blue-600 hover:underline font-medium"
            >
              Learn more about me →
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills & Expertise</h2>
      <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
    </div>
    
    {skillsData && (
      <div className="space-y-12">
        {Object.entries(skillsData).map(([category, skills]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(skills) && skills.map((skill: string, index: number) => (
                <span 
                  key={`${category}-${index}`} 
                  className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

      {/* Experience Section */}
      <section id="experience" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Experience</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="space-y-8 max-w-3xl mx-auto">
            {experienceData?.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 border-blue-200 pl-6 relative pb-8">
                <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-2 top-1"></div>
                <div className="flex flex-col sm:flex-row justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-blue-600 font-medium">{exp.period}</span>
                </div>
                <h4 className="text-lg text-gray-700 mb-2">{exp.company}</h4>
                <p className="text-gray-600">{exp.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          {featuredProjects && featuredProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProjects.slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              <div className="text-center">
                <Link 
                  href="/projects"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
                >
                  View All Projects
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No featured projects yet. Mark some projects as featured in the curation page.</p>
              <Link 
                href="/home/curate"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
              >
                Curate Projects
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Have a project in mind or want to discuss potential opportunities? I'd love to hear from you!
          </p>
          <Link 
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}