import { getProjects } from '@/app/actions';
import CurationClient from './CurationClient';

export const metadata = {
    title: 'Project Curation | Portfolio Ops',
    description: 'Manage featured projects for the portfolio.',
};

export const dynamic = 'force-dynamic';

export default async function CurationPage() {
    const projects = await getProjects();

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                        Project Curation
                    </h1>
                    <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                        Select which projects appear in the featured section of your portfolio.
                    </p>
                </div>

                <CurationClient initialProjects={projects} />
            </div>
        </div>
    );
}
