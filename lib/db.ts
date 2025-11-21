import { Project, BlogPost } from '../types';

// MongoDB Configuration from Environment Variables
interface MongoConfig {
  apiUrl: string;
  apiKey: string;
  database: string;
  cluster: string;
}

const getMongoConfig = (): MongoConfig | null => {
  // Read from environment variables (injected by Vite during build)
  let apiUrl = '';
  let apiKey = '';
  let database = '';
  let cluster = '';

  // Try import.meta.env (Vite standard)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    apiUrl = import.meta.env.MONGODB_API_URL || import.meta.env.VITE_MONGODB_API_URL || '';
    apiKey = import.meta.env.MONGODB_API_KEY || import.meta.env.VITE_MONGODB_API_KEY || '';
    database = import.meta.env.MONGODB_DATABASE || import.meta.env.VITE_MONGODB_DATABASE || 'portfolio';
    cluster = import.meta.env.MONGODB_CLUSTER || import.meta.env.VITE_MONGODB_CLUSTER || 'Cluster0';
  }

  // Fallback to process.env (works with define in vite.config)
  if (!apiUrl && typeof process !== 'undefined' && process.env) {
    apiUrl = process.env.MONGODB_API_URL || '';
    apiKey = process.env.MONGODB_API_KEY || '';
    database = process.env.MONGODB_DATABASE || 'portfolio';
    cluster = process.env.MONGODB_CLUSTER || 'Cluster0';
  }

  // Return null if not configured
  if (!apiUrl || !apiKey) {
    return null;
  }

  return { apiUrl, apiKey, database, cluster };
};

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
    content: `## The Death of Flat Design
Minimalism has served us well for the last decade. Lots of whitespace, subtle shadows, and rounded corners safe, clean, and corporate. But the web was never meant to be just a sterile corridor of SaaS landing pages. It was meant to be a canvas for expression.

Neobrutalism isn't just an aesthetic choice; it's a reaction against the homogenization of web design. By using high contrast, clashing colors, and raw layout structures, we force the user to pay attention. We stop hiding the computer behind layers of metaphor and instead celebrate the digital nature of the medium.

## Key Characteristics
- **Typography**: Default system fonts or bold, idiosyncratic typography.
- **Borders**: Pure black (#000000) borders and shadows.
- **Color**: High saturation colors that vibrate against each other.
- **Layout**: A disregard for traditional spacing rules in favor of density and impact.

## Conclusion
Is it for everyone? No. But that's the point. Good design should have an opinion.`,
    readTime: "5 MIN READ",
    tags: ["DESIGN", "OPINION"]
  },
  {
    id: 2,
    title: "Mastering React Hooks in 2024",
    date: "NOV 02, 2023",
    excerpt: "Deep dive into useEffect nuances, custom hooks patterns, and performance optimization techniques that you might be missing.",
    content: `React Hooks have fundamentally changed how we write components, but many developers are still stuck in class-component patterns or are misusing dependency arrays.

## The useEffect Trap
One of the biggest pitfalls is the \`useEffect\` hook. It's not a lifecycle method. It's a synchronization engine. If you're trying to mirror \`componentDidMount\`, you're thinking about it wrong. You should be thinking: "how do I keep this external system in sync with my state?"

## Custom Hooks
Let's talk about Custom Hooks. They are the secret weapon of clean React architecture. If you find yourself writing the same \`useEffect\` logic in two different components, extract it. 

- **useWindowSize**: For responsive logic
- **useLocalStorage**: For persistence
- **useFetch**: For data fetching

These aren't just utilities; they are domain logic encapsulations.`,
    readTime: "12 MIN READ",
    tags: ["CODE", "REACT"]
  },
  {
    id: 3,
    title: "The State of CSS: Tailwind vs. The World",
    date: "DEC 15, 2023",
    excerpt: "Utility-first CSS has won the war. But what comes next? Analyzing the trend of style-less component libraries.",
    content: `I used to hate Tailwind. "Why would I clutter my HTML with classes?" I asked. "Separation of concerns!" I shouted.

I was wrong. The concern isn't the file extension; it's the component. Co-locating styles with structure reduces context switching and makes refactoring trivial.

## Headless UI
But now we are seeing a new shift: Headless UI libraries. Radix UI, React Aria, and Headless UI provide the logic and accessibility (ARIA attributes, keyboard nav) without the styles. You bring your own Tailwind. This is the holy grail: fully accessible, complex components that look exactly how you want them to look, without fighting a framework's default styles.`,
    readTime: "8 MIN READ",
    tags: ["CSS", "TECH"]
  },
  {
    id: 4,
    title: "Breaking the Grid",
    date: "JAN 10, 2024",
    excerpt: "How to create asymmetric layouts that don't break responsive behavior. A guide to creative coding.",
    content: `The 12-column grid is a safety net. It guarantees that things align, but it also guarantees that things look predictable. To stand out, sometimes you have to break the grid.

## Techniques for Chaos
1. **CSS Grid with overlapping areas**: You can place items in the same grid cell or span them across tracks that overlap. Use z-index to manage the stacking order.
2. **Translate Transforms**: Use \`transform: translate(x, y)\` to nudge elements off their natural axis. This is performant and doesn't affect the document flow of surrounding elements.
3. **Negative Margins**: The old school way. Dangerous, but effective for pulling elements out of their containers.

The trick to responsive asymmetry is to revert to a standard stack on mobile. Chaos works on desktop where you have space; on mobile, clarity is king.`,
    readTime: "6 MIN READ",
    tags: ["LAYOUT", "DESIGN"]
  }
];

// Get Gemini API Key from Environment
export const getGeminiKey = (): string => {
  let apiKey = '';

  // Try import.meta.env (Vite standard)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
  }

  // Fallback to process.env (works with define in vite.config)
  if (!apiKey && typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) {
    apiKey = process.env.GEMINI_API_KEY;
  }

  return apiKey;
};

// Get Admin Password from Environment
export const getAdminPassword = (): string => {
  let password = '';

  // Try import.meta.env (Vite standard)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    password = import.meta.env.VITE_ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || '';
  }

  // Fallback to process.env (works with define in vite.config)
  if (!password && typeof process !== 'undefined' && process.env && process.env.ADMIN_PASSWORD) {
    password = process.env.ADMIN_PASSWORD;
  }

  return password;
};

// API Helper for MongoDB Data API
const mongoFetch = async (action: string, collection: string, body: any = {}) => {
  const config = getMongoConfig();
  if (!config) {
    throw new Error("MongoDB not configured. Set MONGODB_API_URL and MONGODB_API_KEY environment variables.");
  }

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
    // Check if MongoDB is configured
    if (config) {
      try {
        const res = await mongoFetch('find', 'projects', { sort: { id: 1 } });
        return res.documents ? res.documents : [];
      } catch (e) {
        console.error("MongoDB Error:", e);
        return DEFAULT_PROJECTS;
      }
    } else {
      // Fallback to localStorage if MongoDB not configured
      const local = localStorage.getItem('neo_projects');
      return local ? JSON.parse(local) : DEFAULT_PROJECTS;
    }
  },

  saveProject: async (project: Project) => {
    const config = getMongoConfig();
    if (config) {
      // MongoDB mode
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
      // localStorage mode
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
        console.error("MongoDB Error:", e);
        return DEFAULT_POSTS;
      }
    } else {
      // Fallback to localStorage
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