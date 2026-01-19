import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url, location, custom_prompt } = body;

    if (!image_url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "N8N_WEBHOOK_URL not configured" },
        { status: 500 }
      );
    }

    console.log("Calling n8n webhook:", webhookUrl);
    console.log("Payload:", { image_url, location, custom_prompt });

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image_url,
        location,
        custom_prompt: custom_prompt || "",
      }),
    });

    const responseText = await response.text();
    console.log("n8n response status:", response.status);
    console.log("n8n response body:", responseText);

    if (!response.ok) {
      return NextResponse.json(
        { error: `n8n webhook failed (${response.status}): ${responseText}` },
        { status: 500 }
      );
    }

    // Handle empty response
    if (!responseText || responseText.trim() === "") {
      return NextResponse.json(
        { error: "n8n webhook returned empty response - workflow may have timed out or errored" },
        { status: 500 }
      );
    }

    try {
      const data = JSON.parse(responseText);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { error: `n8n returned invalid JSON: ${responseText.substring(0, 200)}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Generate failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
