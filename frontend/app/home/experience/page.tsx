import { getExperienceData } from '@/app/actions';
import ExperienceForm from './ExperienceForm';

export default async function ExperienceEditPage() {
    const data = await getExperienceData();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Experience</h1>
            <ExperienceForm initialData={data} />
        </div>
    );
}
