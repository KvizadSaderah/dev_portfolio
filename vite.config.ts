import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Get API key from environment (prioritize non-prefixed for Vercel)
    const apiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Inject API key into process.env for backward compatibility
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        // Also define import.meta.env for Vite standard approach
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
