import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

console.log("BUCKET_NAME:", BUCKET_NAME);

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm"
];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Hanya file gambar (JPEG, PNG, WebP), PDF, dan video (MP4, MOV, AVI, WebM) yang diizinkan" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Ukuran file maksimal 500MB" };
  }

  return { valid: true };
}

export function generateFileName(prefix: string, originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split(".").pop();
  const sanitizedBaseName = originalName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
  return `${prefix}/${timestamp}_${randomString}_${sanitizedBaseName}.${extension}`;
}

export async function generatePresignedUploadUrl(fileName: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    ContentType: contentType,
    ACL: "public-read", // File bisa diakses publik
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function deleteFileFromS3(fileName: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
  });

  await s3Client.send(command);
}

export function getS3FileUrl(fileName: string): string {
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || "ap-southeast-1"}.amazonaws.com/${fileName}`;
}

export function extractFileNameFromUrl(url: string): string {
  const urlParts = url.split("/");
  const domainAndBucketIndex = urlParts.findIndex(part => part.includes("amazonaws.com"));
  
  if (domainAndBucketIndex !== -1) {
    return urlParts.slice(domainAndBucketIndex + 1).join("/");
  }
  
  return url;
}
