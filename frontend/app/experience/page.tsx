import { getExperience } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import SectionHeading from '@/components/SectionHeading';

export default async function ExperiencePage() {
  const experience = await getExperience();

  if (!experience || experience.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <SectionHeading
            title="Experience"
            subtitle="My professional journey and career milestones"
          />
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Experience data not found</h3>
              <p className="text-gray-500">
                Please add an <code className="bg-gray-100 px-2 py-1 rounded text-sm">experience.json</code> file to your portfolio data.
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
          title="Experience"
          subtitle="My professional journey and career milestones"
        />
        
        <div className="space-y-8">
          {experience.map((item, index) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {index + 1}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{item.role}</h3>
                      <p className="text-lg text-blue-600 font-medium">{item.company}</p>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {item.period}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{item.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
