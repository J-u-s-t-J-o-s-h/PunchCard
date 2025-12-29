# CrewClock

A mobile-first punchcard system for field workers.

## Tech Stack
- Next.js 14 (App Router)
- Supabase (Auth, Postgres, RLS)
- TailwindCSS
- TypeScript

## Setup

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd crew-clock
   npm install
   ```

2. **Supabase Setup**
   - Create a new project on Supabase.
   - Go to SQL Editor and run the contents of [`schema.sql`](./schema.sql).
   - Get your Project URL and Anon Key from Project Settings > API.

3. **Environment Variables**
   - Copy `env.example` to `.env.local`
     ```bash
     cp env.example .env.local
     ```
   - Fill in your Supabase credentials.

4. **Run Locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`.

## Features
- **Employees**: Log in, Clock In/Out (requires GPS), View Status.
- **Admins**: Manage Job Sites (Geofences), View Users.
- **GPS Verification**: The system checks if your location matches a defined Job Site radius.

## Deployment
- Push to GitHub.
- Import project into Vercel.
- Add Environment Variables in Vercel.
