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
  content?: string; // Full article content
  readTime: string;
  tags: string[];
}

export interface MongoConfig {
  apiUrl: string;
  apiKey: string;
  cluster: string;
  database: string;
}

export type ViewState = 'HOME' | 'PROJECTS' | 'BLOG' | 'ADMIN';