# Task Board

A Kanban-style task board built with React, TypeScript, and Vite, backed by Supabase (Postgres + Auth).

**Live app:** https://next-play-assessment-phi.vercel.app/

## Features

- Anonymous guest sessions — no sign-up required, each user only sees their own board
- Drag-and-drop task board (To Do / In Progress / In Review / Done)
- Create, assign, and delete tasks with priority and due date
- Team members with task assignees
- Due date urgency badges (overdue, due today, due soon)
- Live stats bar (total, completed, overdue, due soon)
- Row Level Security enforced at the database level

## Tech Stack

- React + TypeScript + Vite
- Supabase (Postgres, Auth, RLS)
- `@dnd-kit` for drag-and-drop

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. Run the SQL in `schema.sql` in the Supabase SQL Editor.
3. Enable **Authentication → Sign In / Providers → Anonymous sign-ins**.
4. Clone this repo and install dependencies:
   ```bash
   npm install
   ```
5. Create `.env.local` in the project root:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
6. Run the dev server:
   ```bash
   npm run dev
   ```

**Requires Node.js v22.23.1.**

## Database

Two tables (`tasks`, `team_members`), both scoped per guest user via RLS. Full schema in `schema.sql`.
