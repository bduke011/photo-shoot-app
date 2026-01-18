import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to fal.ai storage to get a hosted URL
    const falFormData = new FormData();
    falFormData.append("file", file);

    const falResponse = await fetch("https://fal.ai/api/upload", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.FAL_API_KEY}`,
      },
      body: falFormData,
    });

    if (!falResponse.ok) {
      const errorText = await falResponse.text();
      console.error("fal.ai upload error:", errorText);
      throw new Error("Failed to upload to fal.ai");
    }

    const data = await falResponse.json();
    return NextResponse.json({ url: data.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
