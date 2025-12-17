import { BriefcaseIcon } from '@heroicons/react/24/outline';

const experiences = [
  {
    id: 1,
    role: 'Senior Software Engineer',
    company: 'Tech Solutions Inc.',
    period: '2020 - Present',
    description: 'Leading a team of developers to build scalable web applications using modern technologies like React, Next.js, and Node.js.',
  },
  {
    id: 2,
    role: 'Frontend Developer',
    company: 'Digital Creations',
    period: '2018 - 2020',
    description: 'Developed and maintained responsive web applications using React and Redux, collaborating with designers and backend developers.',
  },
  {
    id: 3,
    role: 'Junior Web Developer',
    company: 'WebStart',
    period: '2016 - 2018',
    description: 'Built and maintained client websites using HTML, CSS, and JavaScript, ensuring cross-browser compatibility and responsive design.',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Work Experience
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            My professional journey and career milestones
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <div key={exp.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                    <BriefcaseIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{exp.role}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <span>{exp.company}</span>
                    <span className="mx-2">•</span>
                    <span>{exp.period}</span>
                  </div>
                  <p className="mt-2 text-gray-600">{exp.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
