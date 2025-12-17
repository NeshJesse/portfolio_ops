'use client';

import { SkillsData } from '@/types/project';
import { updateSkillsData } from '@/app/actions';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function SkillsForm({ initialData }: { initialData: SkillsData | null }) {
    const [data, setData] = useState<SkillsData>({
        languages: [],
        frontends: [],
        backends: [],
        databases: [],
        frameworks: [],
        tools: [],
        ...initialData
    });
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateSkillsData(data);
            if (result.success) {
                alert('Saved successfully');
                router.refresh();
            } else {
                alert('Failed to save');
            }
        });
    };

    const renderArrayField = (key: keyof SkillsData, label: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label} (comma separated)</label>
            <input
                type="text"
                value={data[key]?.join(', ') || ''}
                onChange={(e) => setData({ ...data, [key]: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder={`e.g. Item 1, Item 2`}
            />
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            {renderArrayField('languages', 'Languages')}
            {renderArrayField('frontends', 'Frontend Technologies')}
            {renderArrayField('backends', 'Backend Technologies')}
            {renderArrayField('databases', 'Databases')}
            {renderArrayField('frameworks', 'Frameworks')}
            {renderArrayField('tools', 'Dev Tools')}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isPending ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
}
