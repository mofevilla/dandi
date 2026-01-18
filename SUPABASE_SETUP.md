# Supabase Setup Guide

## Quick Setup Steps

### 1. Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### 2. Create Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these values:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Navigate to **Settings** → **API**
- **Project URL** → Copy to `NEXT_PUBLIC_SUPABASE_URL`
- **service_role** key (under Project API keys) → Copy to `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Important:** Never commit the service role key to version control!

### 3. Create the Database Table

Option A: Using SQL Editor (Recommended for beginners)
1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the sidebar
3. Create a new query
4. Copy the entire contents of `supabase/migrations/001_create_api_keys_table.sql`
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

Option B: Using Supabase CLI
```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 4. Verify Setup

After completing the above steps:
1. Start your development server: `npm run dev`
2. Navigate to the dashboard at `http://localhost:3000/dashboards`
3. Try creating an API key to verify the connection

## Database Schema

The `api_keys` table has the following structure:

- `id` (UUID) - Primary key, auto-generated
- `name` (TEXT) - Name of the API key
- `key` (TEXT) - The actual API key value (unique)
- `created_at` (TIMESTAMP) - When the key was created
- `updated_at` (TIMESTAMP) - When the key was last updated

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure you've created `.env.local` in the root directory
- Verify the variable names match exactly: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Restart your development server after adding environment variables

### Error: "relation 'api_keys' does not exist"
- You haven't run the migration yet. Follow step 3 above to create the table

### Error: "permission denied for table api_keys"
- Make sure RLS policies are set up correctly (the migration includes this)
- Verify you're using the service role key (not the anon key) in `SUPABASE_SERVICE_ROLE_KEY`

### API keys not persisting after page refresh
- Check your Supabase connection in the SQL Editor
- Verify the table exists and has the correct structure
- Check browser console for any error messages
