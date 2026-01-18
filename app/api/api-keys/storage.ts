// Supabase storage for API keys

import { supabase } from "@/lib/supabase";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
}

// Map Supabase row to ApiKey interface
function mapRowToApiKey(row: any): ApiKey {
  return {
    id: row.id,
    name: row.name,
    key: row.key,
    createdAt: row.created_at,
  };
}

export async function getAllApiKeys(): Promise<ApiKey[]> {
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching API keys:", error);
    throw error;
  }

  return data ? data.map(mapRowToApiKey) : [];
}

export async function getApiKeyById(id: string): Promise<ApiKey | null> {
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching API key:", error);
    throw error;
  }

  return data ? mapRowToApiKey(data) : null;
}

export async function createApiKey(name: string, key: string): Promise<ApiKey> {
  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      name,
      key,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating API key:", error);
    throw error;
  }

  return mapRowToApiKey(data);
}

export async function updateApiKey(
  id: string,
  name: string,
  key: string
): Promise<ApiKey | null> {
  const { data, error } = await supabase
    .from("api_keys")
    .update({
      name,
      key,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error updating API key:", error);
    throw error;
  }

  return data ? mapRowToApiKey(data) : null;
}

export async function deleteApiKey(id: string): Promise<boolean> {
  const { error } = await supabase.from("api_keys").delete().eq("id", id);

  if (error) {
    console.error("Error deleting API key:", error);
    throw error;
  }

  return true;
}
