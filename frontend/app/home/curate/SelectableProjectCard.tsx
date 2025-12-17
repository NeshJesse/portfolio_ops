'use client';

import { Project } from '@/types/project';
import ProjectCard from '@/components/ProjectCard';
import { useState } from 'react';

interface SelectableProjectCardProps {
    project: Project;
    onToggle: (newStatus: boolean) => void;
    isUpdating?: boolean;
}

export default function SelectableProjectCard({ project, onToggle, isUpdating = false }: SelectableProjectCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => !isUpdating && onToggle(!project.display.featured)}
        >
            <div className={`transition-all duration-300 ${project.display.featured ? 'ring-4 ring-blue-500 rounded-lg transform scale-[1.02]' : 'hover:scale-[1.01]'}`}>
                <ProjectCard project={project} />
            </div>

            {/* Overlay for selection */}
            <div className={`absolute top-4 right-4 z-10 transition-all duration-300 ${isHovered || project.display.featured ? 'opacity-100' : 'opacity-0'}`}>
                <div
                    className={`
            w-8 h-8 rounded-full flex items-center justify-center border-2 
            ${project.display.featured
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-white/80 border-gray-300 text-transparent hover:border-blue-400'} 
            shadow-sm backdrop-blur-sm
          `}
                >
                    {isUpdating ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Featured Badge Overlay (matches standard card but adds clarity in selection mode) */}
            {project.display.featured && (
                <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 rounded-lg pointer-events-none" />
            )}
        </div>
    );
}
