# Database Setup Guide

## Quick Setup (3 Steps)

### Step 1: Open Supabase SQL Editor

1. Go to **https://app.supabase.com**
2. Sign in and select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"** button (or the `+` icon)

### Step 2: Copy and Run the Migration SQL

Copy the entire SQL below and paste it into the SQL Editor:

```sql
-- Create api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON api_keys(key);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON api_keys(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for service role
-- In production, you may want to restrict this based on user authentication
CREATE POLICY "Allow all operations for service role" ON api_keys
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on update
CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Execute the Query

1. Click the **"Run"** button (or press `Cmd+Enter` / `Ctrl+Enter`)
2. You should see: **"Success. No rows returned"**
3. Verify the table was created by going to **"Table Editor"** in the sidebar - you should see `api_keys` listed

## Verify Connection

After running the migration, test the connection:

```bash
# Make sure .env.local is configured with your Supabase credentials
npm run dev
```

Then visit: **http://localhost:3000/dashboards**

You should now be able to create, read, update, and delete API keys!

## Troubleshooting

### Error: "Could not find the table 'public.api_keys'"
- The migration hasn't been run yet. Follow the steps above.

### Error: "Missing Supabase environment variables"
- Check that `.env.local` exists in the project root
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Restart your dev server after adding environment variables

### Error: "permission denied for table api_keys"
- Verify you're using the **service_role** key (not anon/public key)
- Check that RLS policies are correctly set up (the migration includes this)
