'use client';

import { AboutData } from '@/types/project';
import { updateAboutData } from '@/app/actions';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function AboutForm({ initialData }: { initialData: AboutData | null }) {
    const [data, setData] = useState<AboutData>(initialData || {
        name: '',
        title: '',
        bio: '',
        summary: '',
        highlights: []
    });
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateAboutData(data);
            if (result.success) {
                alert('Saved successfully');
                router.refresh();
            } else {
                alert('Failed to save');
            }
        });
    };

    const addHighlight = () => setData({ ...data, highlights: [...(data.highlights || []), ''] });
    const updateHighlight = (index: number, value: string) => {
        const newHighlights = [...(data.highlights || [])];
        newHighlights[index] = value;
        setData({ ...data, highlights: newHighlights });
    };
    const removeHighlight = (index: number) => {
        const newHighlights = [...(data.highlights || [])];
        newHighlights.splice(index, 1);
        setData({ ...data, highlights: newHighlights });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={e => setData({ ...data, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={e => setData({ ...data, title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Summary (Short)</label>
                <textarea
                    rows={3}
                    value={data.summary}
                    onChange={e => setData({ ...data, summary: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Bio (Long, Markdown supported)</label>
                <textarea
                    rows={10}
                    value={data.bio}
                    onChange={e => setData({ ...data, bio: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border font-mono"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
                {data.highlights?.map((highlight, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={highlight}
                            onChange={e => updateHighlight(index, e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        />
                        <button
                            type="button"
                            onClick={() => removeHighlight(index)}
                            className="text-red-600 hover:text-red-800"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addHighlight}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                    + Add Highlight
                </button>
            </div>

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
