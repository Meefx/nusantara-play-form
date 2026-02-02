"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { validateFile, extractFileNameFromUrl } from "@/lib/s3";

interface FileUploadProps {
  prefix: string;
  initialFiles?: string[];
  onFilesChange: (files: string[]) => void;
  maxFiles?: number;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
}

export default function FileUpload({ prefix, initialFiles = [], onFilesChange, maxFiles = 5 }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
    initialFiles.map(url => ({
      name: extractFileNameFromUrl(url),
      url,
      size: 0,
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setUploading(true);

    try {
      const newUploadedFiles: UploadedFile[] = [];

      for (const file of acceptedFiles) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Format file tidak valid");
        setUploading(false);
        return;
      }

        const presignedResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            prefix,
          }),
        });

        const presignedResult = await presignedResponse.json();

        if (!presignedResult.success) {
          throw new Error(presignedResult.error || "Gagal mengenerate presigned URL");
        }

        const { presignedUrl, fileName: s3FileName, fileUrl } = presignedResult.data;

        const uploadResponse = await fetch(presignedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        });

        if (!uploadResponse.ok) {
          throw new Error(`Gagal upload file: ${file.name}`);
        }

        newUploadedFiles.push({
          name: s3FileName,
          url: fileUrl,
          size: file.size,
        });
      }

      const updatedFiles = [...uploadedFiles, ...newUploadedFiles];
      setUploadedFiles(updatedFiles);
      onFilesChange(updatedFiles.map(f => f.url));
    } catch (err) {
      console.error("Error uploading files:", err);
      setError(err instanceof Error ? err.message : "Gagal upload file");
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [uploadedFiles, prefix, onFilesChange]);

  const handleDelete = async (fileToDelete: UploadedFile) => {
    try {
      await fetch("/api/upload/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: fileToDelete.name,
        }),
      });

      const updatedFiles = uploadedFiles.filter(f => f.name !== fileToDelete.name);
      setUploadedFiles(updatedFiles);
      onFilesChange(updatedFiles.map(f => f.url));
    } catch (err) {
      console.error("Error deleting file:", err);
      setError(err instanceof Error ? err.message : "Gagal menghapus file");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "application/pdf": [".pdf"],
    },
    disabled: uploading || uploadedFiles.length >= maxFiles,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive
            ? "border-blue-500 bg-blue-50"
            : uploading || uploadedFiles.length >= maxFiles
              ? "border-gray-300 bg-gray-100 cursor-not-allowed"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {uploading ? (
            <p className="text-gray-600">Mengupload file...</p>
          ) : uploadedFiles.length >= maxFiles ? (
            <p className="text-gray-500">Maksimal {maxFiles} file</p>
          ) : isDragActive ? (
            <p className="text-blue-600 font-semibold">Lepaskan file untuk diupload</p>
          ) : (
            <div>
              <p className="text-gray-600 font-medium">Drag & drop file di sini</p>
              <p className="text-gray-400 text-sm">atau klik untuk memilih</p>
              <p className="text-gray-400 text-xs mt-2">Format: JPG, PNG, WebP, PDF (Maks. 10MB)</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">File yang diupload ({uploadedFiles.length}/{maxFiles}):</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {file.name.toLowerCase().includes(".pdf") ? (
                      <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {file.name.split("/").pop()}
                    </p>
                    {file.size > 0 && (
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Lihat
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(file)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium ml-2"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
