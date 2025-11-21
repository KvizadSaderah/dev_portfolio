export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  color: string; // Tailwind class for bg color
  image: string;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  tags: string[];
}

export type ViewState = 'HOME' | 'PROJECTS' | 'BLOG';