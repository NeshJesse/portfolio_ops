import { getSkills } from '@/lib/content';
import { getLanguageColor, getFrameworkColor } from '@/lib/utils';
import SectionHeading from '@/components/SectionHeading';

export default async function SkillsPage() {
  const skills = await getSkills();

  if (!skills) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeading
            title="Skills"
            subtitle="My technical expertise and tools"
          />
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Skills data not found</h3>
              <p className="text-gray-500">
                Please add a <code className="bg-gray-100 px-2 py-1 rounded text-sm">skills.json</code> file to your portfolio data.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          title="Skills"
          subtitle="My technical expertise and tools"
        />
        
        <div className="space-y-8">
          {/* Programming Languages */}
          {skills.languages && skills.languages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Programming Languages</h3>
              <div className="flex flex-wrap gap-3">
                {skills.languages.map((language) => (
                  <span
                    key={language}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getLanguageColor(language)}`}
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Frameworks & Libraries */}
          {skills.frontends && skills.frontends.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Frameworks & Libraries</h3>
              <div className="flex flex-wrap gap-3">
                {skills.frontends.map((frontend) => (
                  <span
                    key={frontend}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getFrameworkColor(frontend)}`}
                  >
                    {frontend}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Technologies */}
          {skills.backends && skills.backends.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Backend</h3>
              <div className="flex flex-wrap gap-3">
                {skills.backends.map((backend) => (
                  <span
                    key={backend}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {backend}
                  </span>
                ))}
              </div>
            </div>
          )}
           {skills.databases && skills.databases.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Databases</h3>
              <div className="flex flex-wrap gap-3">
                {skills.databases.map((database) => (
                  <span
                    key={database}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${getFrameworkColor(database)}`}
                  >
                    {database}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Technologies */}
          {skills.tools && skills.tools.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {skills.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
