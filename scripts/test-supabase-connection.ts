// Script to test Supabase connection and verify table exists
// Run with: npx tsx scripts/test-supabase-connection.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("❌ Missing environment variables!");
  console.error("Please ensure .env.local contains:");
  console.error("  NEXT_PUBLIC_SUPABASE_URL=...");
  console.error("  SUPABASE_SERVICE_ROLE_KEY=...");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function testConnection() {
  console.log("🔍 Testing Supabase connection...\n");

  // Test 1: Check connection
  try {
    const { data, error } = await supabase.from("api_keys").select("count", { count: "exact", head: true });
    
    if (error) {
      if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
        console.error("❌ Table 'api_keys' does not exist!");
        console.error("\n📋 You need to run the migration SQL in your Supabase SQL Editor.");
        console.error("\n📝 SQL Migration file: supabase/migrations/001_create_api_keys_table.sql");
        console.error("\n📖 Steps to run migration:");
        console.error("   1. Go to https://app.supabase.com");
        console.error("   2. Select your project");
        console.error("   3. Click 'SQL Editor' in the sidebar");
        console.error("   4. Click 'New Query'");
        console.error("   5. Copy and paste the SQL from the migration file");
        console.error("   6. Click 'Run'");
        process.exit(1);
      } else {
        throw error;
      }
    } else {
      console.log("✅ Connection successful!");
      console.log("✅ Table 'api_keys' exists!");
      console.log(`📊 Current API keys count: ${data?.length || 0}\n`);
      
      // Test 2: Try a simple query
      const { data: keys, error: queryError } = await supabase
        .from("api_keys")
        .select("*")
        .limit(5);
        
      if (queryError) {
        throw queryError;
      }
      
      console.log("✅ Query test successful!");
      console.log(`📋 Found ${keys?.length || 0} API key(s) in the database\n`);
      
      return true;
    }
  } catch (error: any) {
    console.error("❌ Connection test failed:");
    console.error("   Error:", error.message);
    console.error("   Code:", error.code);
    process.exit(1);
  }
}

testConnection();
