-- Add Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  tax_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  billing_info TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS clients_team_name_idx ON clients (team_id, name);

-- Add Client Notes Table
CREATE TABLE IF NOT EXISTS client_notes (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add Client Projects Table
CREATE TABLE IF NOT EXISTS client_projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  owner_id TEXT REFERENCES users(id),
  budget NUMERIC,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add Client Project Tasks Table
CREATE TABLE IF NOT EXISTS client_project_tasks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  project_id TEXT NOT NULL REFERENCES client_projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  owner_id TEXT REFERENCES users(id),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);