import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiKey = process.env.FAL_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "FAL API key not configured" },
        { status: 500 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to fal.ai storage
    const uploadResponse = await fetch(
      "https://rest.alpha.fal.ai/storage/upload/initiate",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_name: file.name,
          content_type: file.type,
        }),
      }
    );

    if (!uploadResponse.ok) {
      // Try alternative direct upload method
      const directUpload = await fetch("https://fal.run/fal-ai/any-llm/storage", {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": file.type,
          "X-Fal-File-Name": file.name,
        },
        body: buffer,
      });

      if (!directUpload.ok) {
        // Fallback: Use base64 data URI which fal.ai also accepts
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;
        return NextResponse.json({ url: dataUri });
      }

      const directData = await directUpload.json();
      return NextResponse.json({ url: directData.url });
    }

    const initiateData = await uploadResponse.json();

    // Upload the actual file to the presigned URL
    const putResponse = await fetch(initiateData.upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: buffer,
    });

    if (!putResponse.ok) {
      throw new Error("Failed to upload to presigned URL");
    }

    return NextResponse.json({ url: initiateData.file_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
