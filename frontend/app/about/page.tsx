import { getAbout } from '@/lib/content';
import SectionHeading from '@/components/SectionHeading';

export default async function AboutPage() {
  const aboutData = await getAbout();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <SectionHeading
          title="About Me"
          subtitle="Learn more about my background and experience"
        />
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          {aboutData ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{aboutData.name}</h2>
                <p className="text-xl text-blue-600 font-semibold mb-4">{aboutData.title}</p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">{aboutData.bio}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary</h3>
                <p className="text-gray-700 leading-relaxed">{aboutData.summary}</p>
              </div>

              {aboutData.highlights && aboutData.highlights.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {aboutData.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-3 font-bold">•</span>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">About content not found</h3>
              <p className="text-gray-500">
                Please add an <code className="bg-gray-100 px-2 py-1 rounded text-sm">about.json</code> file to your portfolio data.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
