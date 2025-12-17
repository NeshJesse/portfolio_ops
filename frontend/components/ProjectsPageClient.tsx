'use client';

import { useState } from 'react';
import { Project } from '@/types/project';
import ProjectGrid from '@/components/ProjectGrid';
import FilterBar from '@/components/FilterBar';
import SectionHeading from '@/components/SectionHeading';

export default function ProjectsPageClient({
    initialAllProjects,
    initialFeaturedProjects,
    initialCategories,
    initialLanguages,
    initialTags,
    stats,
}: {
    initialAllProjects: Project[];
    initialFeaturedProjects: Project[];
    initialCategories: string[];
    initialLanguages: string[];
    initialTags: string[];
    stats: any;
}) {
    const [allProjects] = useState<Project[]>(initialAllProjects);
    const [featuredProjects] = useState<Project[]>(initialFeaturedProjects);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialAllProjects);
    const [categories] = useState<string[]>(initialCategories);
    const [languages] = useState<string[]>(initialLanguages);
    const [tags] = useState<string[]>(initialTags);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            My Projects
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Explore my complete portfolio of projects. Filter by category, language, or tags to find exactly what you're looking for.
                        </p>

                        {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{stats.totalProjects}</div>
                                    <div className="text-sm text-blue-800">Projects</div>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{stats.totalCommits.toLocaleString()}</div>
                                    <div className="text-sm text-green-800">Commits</div>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{stats.totalLinesOfCode.toLocaleString()}</div>
                                    <div className="text-sm text-purple-800">Lines of Code</div>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{stats.uniqueLanguages}</div>
                                    <div className="text-sm text-orange-800">Languages</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* All Projects */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <SectionHeading
                        title="All Projects"
                        subtitle="Filter and explore my complete portfolio"
                    />

                    <FilterBar
                        projects={allProjects}
                        onFilteredProjects={setFilteredProjects}
                        categories={categories}
                        languages={languages}
                        tags={tags}
                    />

                    <ProjectGrid projects={filteredProjects} showStats={true} />
                </div>
            </div>
        </div>
    );
}
