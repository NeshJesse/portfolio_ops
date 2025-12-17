'use client';

import { Project } from '@/types/project';
import { useState, useTransition } from 'react';
import { toggleProjectFeatured } from '@/app/actions';
import SelectableProjectCard from './SelectableProjectCard';
import { useRouter } from 'next/navigation';

interface CurationClientProps {
    initialProjects: Project[];
}

export default function CurationClient({ initialProjects }: CurationClientProps) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isPending, startTransition] = useTransition();
    const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
    const router = useRouter();

    const handleToggle = async (projectId: string, newFeaturedStatus: boolean) => {
        // Optimistic update
        setProjects(prev => prev.map(p =>
            p.id === projectId ? { ...p, display: { ...p.display, featured: newFeaturedStatus } } : p
        ));

        setUpdatingIds(prev => new Set(prev).add(projectId));

        const result = await toggleProjectFeatured(projectId, newFeaturedStatus);

        if (!result.success) {
            // Revert if failed
            setProjects(prev => prev.map(p =>
                p.id === projectId ? { ...p, display: { ...p.display, featured: !newFeaturedStatus } } : p
            ));
            alert('Failed to update project status');
        } else {
            startTransition(() => {
                router.refresh();
            });
        }

        setUpdatingIds(prev => {
            const next = new Set(prev);
            next.delete(projectId);
            return next;
        });
    };

    const featuredCount = projects.filter(p => p.display.featured).length;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Curation Dashboard</h2>
                    <p className="text-gray-500">Select projects to display on the home page</p>
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    <div className="px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
                        <span className="text-blue-600 font-bold text-lg">{featuredCount}</span>
                        <span className="text-blue-600 ml-2">Featured</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <SelectableProjectCard
                        key={project.id}
                        project={project}
                        onToggle={(newStatus) => handleToggle(project.id, newStatus)}
                        isUpdating={updatingIds.has(project.id)}
                    />
                ))}
            </div>
        </div>
    );
}
