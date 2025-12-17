export interface Project {
  id: string;
  name: string;
  path: string;
  slug: string;
  
  metadata: {
    language: string;
    framework: string;
    type: string;
    tags: string[];
  };
  
  readme: {
    exists: boolean;
    path: string;
    content: string;
    preview: string;
    headings: string[];
    has_demo: boolean;
    demo_url?: string;
    word_count: number;
  };
  
  assets: {
    screenshots: string[];
    logo?: string;
    thumbnail?: string;
  };
  
  git: {
    is_repo: boolean;
    remote_url?: string;
    last_commit?: string;
    total_commits: number;
    branch?: string;
    is_archived: boolean;
  };
  
  stats: {
    lines_of_code: number;
    file_count: number;
    has_tests: boolean;
    test_coverage?: number;
    has_ci: boolean;
    has_docs: boolean;
    documentation_completeness?: number;
  };
  
  display: {
    featured: boolean;
    priority: number;
    category: string;
    status: string;
    visibility: string;
    custom_description?: string;
  };
  
  timestamps: {
    created: string;
    modified: string;
    last_scanned: string;
  };
}

export interface ProjectsData {
  meta: {
    generated_at: string;
    scan_type: string;
    total_projects: number;
    scanner_version: string;
  };
  projects: Project[];
}

export interface SkillsData {
  languages: string[];
  frontends: string[];
  backends: string[];
  databases: string[];
  frameworks: string[];
  tools: string[];
}

export interface ExperienceData {
  id: string;
  role: string;
  company: string;
  period: string;
  summary: string;
}

export interface ContactData {
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface AboutData {
  name: string;
  title: string;
  bio: string;
  summary: string;
  highlights?: string[];
}
