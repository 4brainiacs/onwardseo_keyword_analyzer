/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamp)
      - updated_at (timestamp)
      - last_login (timestamp)
    - projects
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - user_id (uuid, foreign key)
      - created_at (timestamp)
      - updated_at (timestamp)
    - analyses
      - id (uuid, primary key)
      - url (text)
      - title (text)
      - meta_description (text)
      - total_words (integer)
      - content (text)
      - project_id (uuid, foreign key)
      - created_at (timestamp)
      - updated_at (timestamp)
    - keywords
      - id (uuid, primary key)
      - analysis_id (uuid, foreign key)
      - phrase (text)
      - word_count (integer)
      - occurrences (integer)
      - density (decimal)
      - prominence (decimal)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analyses table
CREATE TABLE IF NOT EXISTS analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  title text,
  meta_description text,
  total_words integer,
  content text,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id uuid REFERENCES analyses(id) ON DELETE CASCADE NOT NULL,
  phrase text NOT NULL,
  word_count integer NOT NULL,
  occurrences integer NOT NULL,
  density decimal NOT NULL,
  prominence decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can CRUD own projects" ON projects
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Analyses policies
CREATE POLICY "Users can CRUD analyses in their projects" ON analyses
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = analyses.project_id 
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = analyses.project_id 
    AND projects.user_id = auth.uid()
  ));

-- Keywords policies
CREATE POLICY "Users can CRUD keywords in their analyses" ON keywords
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM analyses
    JOIN projects ON projects.id = analyses.project_id
    WHERE analyses.id = keywords.analysis_id 
    AND projects.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM analyses
    JOIN projects ON projects.id = analyses.project_id
    WHERE analyses.id = keywords.analysis_id 
    AND projects.user_id = auth.uid()
  ));

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analyses_updated_at
  BEFORE UPDATE ON analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();