import { NextRequest, NextResponse } from "next/server";
import { validateFile, generateFileName, generatePresignedUploadUrl, getS3FileUrl } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName, contentType, prefix } = body;

    if (!fileName || !contentType || !prefix) {
      return NextResponse.json(
        { success: false, error: "fileName, contentType, dan prefix wajib diisi" },
        { status: 400 }
      );
    }

    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    const allowedExtensions = ["jpg", "jpeg", "png", "webp", "pdf", "mp4", "mov", "avi", "webm"];

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { success: false, error: "Format file tidak diizinkan. Gunakan JPEG, PNG, WebP, PDF, MP4, MOV, AVI, atau WebM" },
        { status: 400 }
      );
    }

    const s3FileName = generateFileName(prefix, fileName);
    const presignedUrl = await generatePresignedUploadUrl(s3FileName, contentType);
    const fileUrl = getS3FileUrl(s3FileName);

    return NextResponse.json({
      success: true,
      data: {
        presignedUrl,
        fileName: s3FileName,
        fileUrl,
      },
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengenerate presigned URL",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
