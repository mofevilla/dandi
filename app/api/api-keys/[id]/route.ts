import { NextRequest, NextResponse } from "next/server";
import {
  getApiKeyById,
  updateApiKey,
  deleteApiKey,
} from "../storage";

// GET - Get a single API key by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Validate ID
    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "API key ID is required" },
        { status: 400 }
      );
    }

    const apiKey = await getApiKeyById(id);

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(apiKey);
  } catch (error: any) {
    console.error("Error in GET /api/api-keys/[id]:", error);
    
    if (error.code === "22P02") {
      return NextResponse.json(
        { error: "Invalid API key ID format" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

// PUT - Update an API key
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID from params - handle both direct access and destructuring
    const id = params?.id || (params as any)?.id;
    
    // Fallback: extract from URL if params.id is undefined
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const idFromUrl = pathParts[pathParts.length - 1];
    const finalId = id || idFromUrl;
    
    // Validate ID
    if (!finalId || finalId === "undefined" || finalId === "[id]") {
      console.error("Invalid ID in PUT:", { params, id, idFromUrl, url: url.pathname });
      return NextResponse.json(
        { error: "API key ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, key } = body;

    if (!name || !key) {
      return NextResponse.json(
        { error: "Name and key are required" },
        { status: 400 }
      );
    }

    const updatedKey = await updateApiKey(finalId, name, key);

    if (!updatedKey) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedKey);
  } catch (error: any) {
    console.error("Error in PUT /api/api-keys/[id]:", error);
    
    // Handle specific Supabase errors
    if (error.code === "22P02") {
      return NextResponse.json(
        { error: "Invalid API key ID format" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update API key", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete an API key
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Extract ID from params - handle both direct access and destructuring
    const id = params?.id || (params as any)?.id;
    
    // Fallback: extract from URL if params.id is undefined
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const idFromUrl = pathParts[pathParts.length - 1];
    const finalId = id || idFromUrl;
    
    // Validate ID
    if (!finalId || finalId === "undefined" || finalId === "[id]") {
      console.error("Invalid ID in DELETE:", { params, id, idFromUrl, url: url.pathname });
      return NextResponse.json(
        { error: "API key ID is required" },
        { status: 400 }
      );
    }

    const success = await deleteApiKey(finalId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/api-keys/[id]:", error);
    
    // Handle specific Supabase errors
    if (error.code === "22P02") {
      return NextResponse.json(
        { error: "Invalid API key ID format" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete API key", details: error.message },
      { status: 500 }
    );
  }
}
