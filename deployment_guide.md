# Vercel Deployment Guide - BoardFinder

Follow these steps to deploy your application to Vercel.

## 1. Vercel Project Setup
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** > **"Project"**.
3.  Import your **BoardFinder** repository.
4.  In the **Configure Project** screen:
    - **Framework Preset**: Select **Next.js**.
    - **Root Directory**: Click "Edit" and select the `client` folder.
    - **Build Command**: Leave as default (`next build`).
    - **Output Directory**: Leave as default (`.next`).
    - **Install Command**: Leave as default (`npm install`).

## 2. Environment Variables
You MUST add the following environment variables in the Vercel dashboard under **Settings > Environment Variables**:

| Variable Name | Value (Copy from your local `client/.env`) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Your Cloudinary Cloud Name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Your Cloudinary Upload Preset |

## 3. Database Sync (Supabase)
Before deploying, ensure your Supabase database is up to date:
- Run the SQL in `database.sql` in your Supabase SQL Editor.
- Specifically, ensure the `avatar_url` column exists in the `users` table:
  ```sql
  ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
  ```

## 4. Deploy!
Click **Deploy**. Vercel will build the `client` subdirectory and provide you with a production URL.

---
> [!IMPORTANT]
> **Authentication Check**: After deploying, make sure to add your new Vercel URL (e.g., `https://board-finder.vercel.app`) to the **Redirect URLs** in your Supabase Dashboard under **Authentication > URL Configuration**.
