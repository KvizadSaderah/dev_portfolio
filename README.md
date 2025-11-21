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

**All sensitive configuration is now managed via environment variables for security.**

Required environment variables for Vercel deployment:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `ADMIN_PASSWORD` | Password for admin panel access | **Yes** | None |
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Optional | None |
| `MONGODB_API_URL` | MongoDB Data API endpoint URL | Optional | None |
| `MONGODB_API_KEY` | MongoDB Data API key | Optional | None |
| `MONGODB_DATABASE` | MongoDB database name | Optional | `portfolio` |
| `MONGODB_CLUSTER` | MongoDB cluster name | Optional | `Cluster0` |

**Important Notes:**
- **All variables are set in Vercel Project Settings → Environment Variables** (without VITE_ prefix)
- After adding/changing environment variables, you **must redeploy** for changes to take effect
- Variables are injected during build time and cannot be changed at runtime
- For local development, add these to `.env.local` (with or without `VITE_` prefix)

**Security:**
- ✅ Admin password is checked against environment variable (never stored in browser)
- ✅ MongoDB credentials come from environment (never in localStorage)
- ✅ AI API key comes from environment (no admin configuration needed)
- ✅ No sensitive data stored in browser or exposed in client code

**Behavior:**
- **Without `ADMIN_PASSWORD`**: Admin panel will be inaccessible
- **Without `GEMINI_API_KEY`**: AI terminal will show as disabled with instructions
- **Without MongoDB config**: App uses localStorage for content (works offline with default data)

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
