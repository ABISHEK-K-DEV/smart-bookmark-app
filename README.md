Smart Bookmark App

A simple, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS. This project fulfills the requirement for a coding assessment submission.

Tech Stack

- Frontend: Next.js 15 (App Router), React JSX
- Styling: Tailwind CSS v4
- Backend: Supabase (Database, Auth, Realtime)
- Deployment: Vercel

How to Run Locally

1.  Clone the repository.
2.  Install dependencies:
    bash
    npm install
    
3.  Set up environment variables in `.env.local`:
    env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    
4.  Run the development server:
    bash
    npm run dev
    
5.  Open [http://localhost:3000](http://localhost:3000).

Problems I Encountered & How I Solved Them

1. Configuring Google OAuth Redirects
Problem: During initial testing, Google login failed with a generic error or redirected incorrectly.
Solution: I realized that both the local URL (`http://localhost:3000/auth/callback`) and the production Vercel URL needed to be explicitly added to the Authorized redirect URIs in the Google Cloud Console. I also had to insure the Supabase URL was correct (using `.co` not `.io` or typos).

2. Ensuring Real-time Updates Across Tabs
Problem: Bookmarks added in one tab didn't appear in another tab immediately without refreshing.
Solution: I implemented Supabase Realtime subscriptions in the `BookmarkList` component. I subscribed to `INSERT`, `UPDATE`, and `DELETE` events on the `bookmarks` table and updated the React state accordingly. This ensures the UI is always in sync with the database.

3. Row Level Security (RLS) policies
Problem: Ensuring user privacy so User A cannot see User B's bookmarks.
Solution: I enabled RLS on the `bookmarks` table in Supabase and wrote specific policies (e.g., `using (auth.uid() = user_id)`) for SELECT, INSERT, UPDATE, and DELETE operations. This enforces data isolation at the database level.
