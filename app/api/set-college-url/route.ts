import { NextRequest } from "next/server";
import { collegeStore } from "@/lib/college-store";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return Response.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Set the college URL
    collegeStore.setCollegeUrl(url);
    
    // Clear cached content so it will be refreshed
    // Note: In a real app, you'd want to clear this cache when the URL changes
    // For now, we'll need to restart the server to clear the cache

    return Response.json({ 
      success: true,
      message: "College website URL set successfully",
      url: url
    });

  } catch (error) {
    console.error("Error setting college URL:", error);
    return Response.json({ 
      error: "Failed to set college URL" 
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ 
    collegeUrl: collegeStore.getCollegeUrl() 
  });
}
