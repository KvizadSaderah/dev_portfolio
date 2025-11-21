import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Extract environment variables (prioritize non-prefixed for Vercel)
    const geminiApiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
    const adminPassword = env.ADMIN_PASSWORD || env.VITE_ADMIN_PASSWORD || '';
    const mongodbApiUrl = env.MONGODB_API_URL || env.VITE_MONGODB_API_URL || '';
    const mongodbApiKey = env.MONGODB_API_KEY || env.VITE_MONGODB_API_KEY || '';
    const mongodbDatabase = env.MONGODB_DATABASE || env.VITE_MONGODB_DATABASE || 'portfolio';
    const mongodbCluster = env.MONGODB_CLUSTER || env.VITE_MONGODB_CLUSTER || 'Cluster0';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Gemini AI API Key
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(geminiApiKey),

        // Admin Password
        'process.env.ADMIN_PASSWORD': JSON.stringify(adminPassword),
        'import.meta.env.ADMIN_PASSWORD': JSON.stringify(adminPassword),
        'import.meta.env.VITE_ADMIN_PASSWORD': JSON.stringify(adminPassword),

        // MongoDB Configuration
        'process.env.MONGODB_API_URL': JSON.stringify(mongodbApiUrl),
        'import.meta.env.MONGODB_API_URL': JSON.stringify(mongodbApiUrl),
        'import.meta.env.VITE_MONGODB_API_URL': JSON.stringify(mongodbApiUrl),

        'process.env.MONGODB_API_KEY': JSON.stringify(mongodbApiKey),
        'import.meta.env.MONGODB_API_KEY': JSON.stringify(mongodbApiKey),
        'import.meta.env.VITE_MONGODB_API_KEY': JSON.stringify(mongodbApiKey),

        'process.env.MONGODB_DATABASE': JSON.stringify(mongodbDatabase),
        'import.meta.env.MONGODB_DATABASE': JSON.stringify(mongodbDatabase),
        'import.meta.env.VITE_MONGODB_DATABASE': JSON.stringify(mongodbDatabase),

        'process.env.MONGODB_CLUSTER': JSON.stringify(mongodbCluster),
        'import.meta.env.MONGODB_CLUSTER': JSON.stringify(mongodbCluster),
        'import.meta.env.VITE_MONGODB_CLUSTER': JSON.stringify(mongodbCluster)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
