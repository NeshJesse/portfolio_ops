'use client';

import { ExperienceData } from '@/types/project';
import { updateExperienceData } from '@/app/actions';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function ExperienceForm({ initialData }: { initialData: ExperienceData[] | null }) {
    const [items, setItems] = useState<ExperienceData[]>(initialData || []);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const result = await updateExperienceData(items);
            if (result.success) {
                alert('Saved successfully');
                router.refresh();
            } else {
                alert('Failed to save');
            }
        });
    };

    const addItem = () => setItems([...items, { id: crypto.randomUUID(), role: '', company: '', period: '', summary: '' }]);

    const updateItem = (index: number, field: keyof ExperienceData, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {items.map((item, index) => (
                <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                    <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                    >
                        Remove
                    </button>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <input
                                type="text"
                                value={item.role}
                                onChange={e => updateItem(index, 'role', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <input
                                type="text"
                                value={item.company}
                                onChange={e => updateItem(index, 'company', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Period</label>
                            <input
                                type="text"
                                value={item.period}
                                onChange={e => updateItem(index, 'period', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Summary</label>
                            <textarea
                                rows={3}
                                value={item.summary}
                                onChange={e => updateItem(index, 'summary', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={addItem}
                className="text-blue-600 font-medium hover:text-blue-800"
            >
                + Add Experience
            </button>

            <div className="pt-4 border-t border-gray-200">
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
