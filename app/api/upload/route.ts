import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
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
      console.error("fal.ai initiate error:", errorText);
      throw new Error("Failed to initiate upload");
    }

    const { upload_url, file_url } = await initResponse.json();

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
      console.error("fal.ai upload error:", errorText);
      throw new Error("Failed to upload file");
    }

    return NextResponse.json({ url: file_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
