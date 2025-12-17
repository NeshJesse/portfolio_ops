import { getAboutData } from '@/app/actions';
import AboutForm from './AboutForm';

export default async function AboutEditPage() {
    const data = await getAboutData();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit About Section</h1>
            <AboutForm initialData={data} />
        </div>
    );
}
