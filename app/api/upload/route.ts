import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check if FAL_API_KEY is configured
    if (!process.env.FAL_API_KEY) {
      return NextResponse.json(
        { error: "FAL_API_KEY not configured on server" },
        { status: 500 }
      );
    }

    // Step 1: Initiate upload to get presigned URL
    const initResponse = await fetch(
      "https://rest.alpha.fal.ai/storage/upload/initiate",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.FAL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content_type: file.type,
          file_name: file.name,
        }),
      }
    );

    if (!initResponse.ok) {
      const errorText = await initResponse.text();
      console.error("fal.ai initiate error:", initResponse.status, errorText);
      return NextResponse.json(
        { error: `fal.ai initiate failed (${initResponse.status}): ${errorText}` },
        { status: 500 }
      );
    }

    const initData = await initResponse.json();
    const { upload_url, file_url } = initData;

    if (!upload_url || !file_url) {
      return NextResponse.json(
        { error: `fal.ai returned invalid data: ${JSON.stringify(initData)}` },
        { status: 500 }
      );
    }

    // Step 2: Upload file to presigned URL
    const arrayBuffer = await file.arrayBuffer();
    const uploadResponse = await fetch(upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: arrayBuffer,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("fal.ai upload error:", uploadResponse.status, errorText);
      return NextResponse.json(
        { error: `fal.ai upload failed (${uploadResponse.status}): ${errorText}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: file_url });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
