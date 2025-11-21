import { Project, BlogPost, MongoConfig } from '../types';

// Defaults
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Retro Terminal",
    description: "A fully functional web-based terminal emulator built with React and custom command parsing logic.",
    tags: ["React", "TypeScript", "CSS"],
    link: "#",
    color: "bg-neo-secondary",
    image: "https://picsum.photos/800/600?random=1"
  },
  {
    id: 2,
    title: "Crypto Dashboard",
    description: "Real-time cryptocurrency tracking dashboard featuring brutalist charts and live websocket data.",
    tags: ["Next.js", "Recharts", "API"],
    link: "#",
    color: "bg-neo-accent",
    image: "https://picsum.photos/800/600?random=2"
  },
  {
    id: 3,
    title: "Glitch Art Gen",
    description: "An HTML5 canvas experiment that generates random glitch art based on user uploaded images.",
    tags: ["Canvas API", "Algorithms", "Art"],
    link: "#",
    color: "bg-neo-pink",
    image: "https://picsum.photos/800/600?random=3"
  },
  {
    id: 4,
    title: "SaaS Landing V1",
    description: "High conversion landing page with scroll-triggered animations and 3D elements.",
    tags: ["Tailwind", "Framer Motion"],
    link: "#",
    color: "bg-yellow-400",
    image: "https://picsum.photos/800/600?random=4"
  }
];

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Why Neobrutalism is the Future of UI",
    date: "OCT 24, 2023",
    excerpt: "Minimalism is dead. Long live the raw, unfiltered expression of the web. Here is why hard shadows and bold borders are taking over.",
    readTime: "5 MIN READ",
    tags: ["DESIGN", "OPINION"]
  },
  {
    id: 2,
    title: "Mastering React Hooks in 2024",
    date: "NOV 02, 2023",
    excerpt: "Deep dive into useEffect nuances, custom hooks patterns, and performance optimization techniques that you might be missing.",
    readTime: "12 MIN READ",
    tags: ["CODE", "REACT"]
  },
  {
    id: 3,
    title: "The State of CSS: Tailwind vs. The World",
    date: "DEC 15, 2023",
    excerpt: "Utility-first CSS has won the war. But what comes next? Analyzing the trend of style-less component libraries.",
    readTime: "8 MIN READ",
    tags: ["CSS", "TECH"]
  },
  {
    id: 4,
    title: "Breaking the Grid",
    date: "JAN 10, 2024",
    excerpt: "How to create asymmetric layouts that don't break responsive behavior. A guide to creative coding.",
    readTime: "6 MIN READ",
    tags: ["LAYOUT", "DESIGN"]
  }
];

// Config Management
export const getMongoConfig = (): MongoConfig | null => {
  try {
    const cfg = localStorage.getItem('neo_mongo_config');
    return cfg ? JSON.parse(cfg) : null;
  } catch { return null; }
};

export const saveMongoConfig = (config: MongoConfig) => {
  localStorage.setItem('neo_mongo_config', JSON.stringify(config));
};

export const clearMongoConfig = () => {
  localStorage.removeItem('neo_mongo_config');
};

// API Helper
const mongoFetch = async (action: string, collection: string, body: any = {}) => {
  const config = getMongoConfig();
  if (!config) throw new Error("No Mongo Configuration");

  const response = await fetch(`${config.apiUrl}/action/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Request-Headers': '*',
      'api-key': config.apiKey,
    },
    body: JSON.stringify({
      collection: collection,
      database: config.database,
      dataSource: config.cluster,
      ...body
    })
  });

  return await response.json();
};

// DATA OPERATIONS

export const DB = {
  // PROJECTS
  getProjects: async (): Promise<Project[]> => {
    const config = getMongoConfig();
    if (config) {
      try {
        const res = await mongoFetch('find', 'projects', { sort: { id: 1 } });
        return res.documents ? res.documents : [];
      } catch (e) {
        console.error("Mongo Error", e);
        return DEFAULT_PROJECTS;
      }
    } else {
      const local = localStorage.getItem('neo_projects');
      return local ? JSON.parse(local) : DEFAULT_PROJECTS;
    }
  },

  saveProject: async (project: Project) => {
    const config = getMongoConfig();
    if (config) {
      // Check if exists to decide insert or update
      const existing = await mongoFetch('findOne', 'projects', { filter: { id: project.id } });
      
      if (existing && existing.document) {
         await mongoFetch('updateOne', 'projects', {
           filter: { id: project.id },
           update: { $set: project }
         });
      } else {
         await mongoFetch('insertOne', 'projects', { document: project });
      }
    } else {
      // Local Storage
      const projects = await DB.getProjects();
      const index = projects.findIndex(p => p.id === project.id);
      let newProjects;
      if (index >= 0) {
        newProjects = projects.map(p => p.id === project.id ? project : p);
      } else {
        newProjects = [...projects, project];
      }
      localStorage.setItem('neo_projects', JSON.stringify(newProjects));
    }
  },

  deleteProject: async (id: number) => {
    const config = getMongoConfig();
    if (config) {
      await mongoFetch('deleteOne', 'projects', { filter: { id: id } });
    } else {
      const projects = await DB.getProjects();
      const newProjects = projects.filter(p => p.id !== id);
      localStorage.setItem('neo_projects', JSON.stringify(newProjects));
    }
  },

  // POSTS
  getPosts: async (): Promise<BlogPost[]> => {
    const config = getMongoConfig();
    if (config) {
      try {
        const res = await mongoFetch('find', 'posts', { sort: { id: -1 } });
        return res.documents ? res.documents : [];
      } catch (e) {
        console.error("Mongo Error", e);
        return DEFAULT_POSTS;
      }
    } else {
      const local = localStorage.getItem('neo_posts');
      return local ? JSON.parse(local) : DEFAULT_POSTS;
    }
  },

  savePost: async (post: BlogPost) => {
    const config = getMongoConfig();
    if (config) {
      const existing = await mongoFetch('findOne', 'posts', { filter: { id: post.id } });
      if (existing && existing.document) {
        await mongoFetch('updateOne', 'posts', {
          filter: { id: post.id },
          update: { $set: post }
        });
      } else {
        await mongoFetch('insertOne', 'posts', { document: post });
      }
    } else {
      const posts = await DB.getPosts();
      const index = posts.findIndex(p => p.id === post.id);
      let newPosts;
      if (index >= 0) {
        newPosts = posts.map(p => p.id === post.id ? post : p);
      } else {
        newPosts = [...posts, post];
      }
      localStorage.setItem('neo_posts', JSON.stringify(newPosts));
    }
  },

  deletePost: async (id: number) => {
    const config = getMongoConfig();
    if (config) {
      await mongoFetch('deleteOne', 'posts', { filter: { id: id } });
    } else {
      const posts = await DB.getPosts();
      const newPosts = posts.filter(p => p.id !== id);
      localStorage.setItem('neo_posts', JSON.stringify(newPosts));
    }
  }
};