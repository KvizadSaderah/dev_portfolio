<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# NeoBrutalist Dev Portfolio

A modern, bold developer portfolio with neobrutalist design aesthetics, featuring a full CMS, AI assistant, and dual storage options.

View your app in AI Studio: https://ai.studio/apps/drive/1W1jzMttaYEypZzk1YI7ml0opKx-wqw04

## Features

- 🎨 Neobrutalist design with bold colors and hard shadows
- 📝 Content Management System (CMS) for projects and blog posts
- 🤖 AI-powered terminal assistant using Google Gemini
- 💾 Dual storage: LocalStorage (offline) or MongoDB Atlas (cloud)
- 📱 Fully responsive design
- ⚡ Built with React 19 + TypeScript + Vite

## Run Locally

**Prerequisites:** Node.js (v18 or higher)

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in `.env.local`:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variable in Vercel dashboard:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `GEMINI_API_KEY` with your API key

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - Add `GEMINI_API_KEY` with your API key
6. Click "Deploy"

### Environment Variables

Required environment variables for deployment:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes (for AI terminal) |

**API Key Priority:**
1. **Environment variable** (Vercel/build-time) - Preferred ⭐
2. **Admin portal** (localStorage) - Fallback

**Important Notes:**
- **For Vercel deployment:** Set `GEMINI_API_KEY` (without VITE_ prefix) in Project Settings → Environment Variables
- After adding the environment variable, you **must redeploy** for changes to take effect
- The environment variable is injected during build time and takes priority over admin panel
- For local development, you can use either `GEMINI_API_KEY` or `VITE_GEMINI_API_KEY` in `.env.local`
- The app will work without the API key, but the AI terminal assistant will be disabled

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
/
├── components/          # React components
├── lib/                # Utilities and data layer
├── App.tsx             # Main application
├── index.tsx           # Entry point
├── types.ts            # TypeScript definitions
├── vercel.json         # Vercel configuration
└── vite.config.ts      # Vite configuration
```
