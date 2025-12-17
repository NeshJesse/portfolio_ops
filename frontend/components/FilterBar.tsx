'use client';

import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import { searchProjects, sortProjects } from '@/lib/utils';

interface FilterBarProps {
  projects: Project[];
  onFilteredProjects: (projects: Project[]) => void;
  categories: string[];
  languages: string[];
  tags: string[];
}

export default function FilterBar({ 
  projects, 
  onFilteredProjects, 
  categories, 
  languages, 
  tags 
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'priority' | 'commits'>('priority');

  useEffect(() => {
    let filteredProjects = projects;

    // Apply search
    if (searchQuery.trim()) {
      filteredProjects = searchProjects(filteredProjects, searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      filteredProjects = filteredProjects.filter(p => p.display.category === selectedCategory);
    }

    // Apply language filter
    if (selectedLanguage) {
      filteredProjects = filteredProjects.filter(p => p.metadata.language === selectedLanguage);
    }

    // Apply tag filter
    if (selectedTag) {
      filteredProjects = filteredProjects.filter(p => p.metadata.tags.includes(selectedTag));
    }

    // Apply sorting
    filteredProjects = sortProjects(filteredProjects, sortBy);

    onFilteredProjects(filteredProjects);
  }, [searchQuery, selectedCategory, selectedLanguage, selectedTag, sortBy, projects, onFilteredProjects]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLanguage('');
    setSelectedTag('');
    setSortBy('priority');
  };

  const hasActiveFilters = searchQuery || selectedCategory || selectedLanguage || selectedTag;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <div className="space-y-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Projects
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, description, or tags..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div>
            <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
              Tag
            </label>
            <select
              id="tag"
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Tags</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="priority">Priority</option>
              <option value="date">Last Modified</option>
              <option value="name">Name</option>
              <option value="commits">Commits</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
