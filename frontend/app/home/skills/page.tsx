import { getSkillsData } from '@/app/actions';
import SkillsForm from './SkillsForm';

export default async function SkillsEditPage() {
    const data = await getSkillsData();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Skills</h1>
            <SkillsForm initialData={data} />
        </div>
    );
}
