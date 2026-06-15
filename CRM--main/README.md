# Nexus CRM 🚀

An AI-powered CRM designed for small teams and freelancers to manage leads, sales pipelines, and tasks with intelligent insights.

## ✨ Features

- **Intelligent Dashboard**: Real-time revenue tracking, lead distribution charts, and quick action buttons.
- **Lead Management**: Comprehensive lead tracking with AI scoring, location data, and contact history.
- **Sales Pipeline**: Visual Kanban board to manage deals across different stages.
- **Task Management**: Stay organized with priority-based tasks and due date tracking.
- **Smart Calendar**: Manage meetings and follow-ups with an integrated scheduling system.
- **AI Assistant**: Built-in AI chat to help analyze data and generate email templates.
- **Real-time Sync**: Powered by Supabase for instant data updates across all devices.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Database/Auth**: Supabase
- **Notifications**: Sonner

## 🚀 Getting Started

### 1. Database Setup (Supabase)

To get the database running, go to your Supabase SQL Editor and run the following script to create the necessary tables:

```sql
-- 1. Create Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  role TEXT,
  location TEXT,
  category TEXT DEFAULT 'Customer',
  status TEXT DEFAULT 'New',
  value NUMERIC DEFAULT 0,
  "lastContact" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT[] DEFAULT '{}',
  "assignedTo" TEXT,
  "aiScore" INTEGER DEFAULT 50,
  "nextAction" DATE,
  "imageUrl" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Deals Table
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  "contactId" UUID REFERENCES contacts(id) ON DELETE SET NULL,
  value NUMERIC NOT NULL,
  stage TEXT NOT NULL,
  "expectedClose" DATE,
  probability INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Medium',
  "dueDate" DATE,
  status TEXT DEFAULT 'Pending',
  "contactId" UUID REFERENCES contacts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Calendar Events Table
CREATE TABLE IF NOT EXISTS calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT,
  description TEXT,
  type TEXT DEFAULT 'Meeting',
  "contactId" UUID REFERENCES contacts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📱 Screenshots

The app features a modern, "Swiss-style" minimal interface with a focus on typography and clear hierarchy.

---
Built with ❤️ using React and Supabase.
