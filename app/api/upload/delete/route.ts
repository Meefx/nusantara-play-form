import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromS3 } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "fileName wajib diisi" },
        { status: 400 }
      );
    }

    await deleteFileFromS3(fileName);

    return NextResponse.json({
      success: true,
      message: "File berhasil dihapus dari S3",
    });
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menghapus file dari S3",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
