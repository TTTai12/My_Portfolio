"use client";
import React, { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  aspectRatio?: "square" | "landscape" | "portrait";
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  label = "Upload Image",
  aspectRatio = "square",
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(value);

  // Sync with parent value
  React.useEffect(() => {
    setUploadedUrl(value);
  }, [value]);

  const onUpload = (result: any) => {
    if (result?.info?.secure_url) {
      const url = result.info.secure_url;
      setUploadedUrl(url);
      onChange(url);
      setLoading(false);
    } else {
      console.error("❌ No secure_url in result");
      setLoading(false);
      alert("Upload completed but no URL returned");
    }
  };

  const onError = (error: any) => {
    console.error("❌ Upload ERROR:", error);
    setLoading(false);
    alert(`Upload failed: ${error.message || "Unknown error"}`);
  };

  const dimensions = {
    square: { width: 200, height: 200 },
    landscape: { width: 400, height: 250 },
    portrait: { width: 250, height: 400 },
  };

  const size = dimensions[aspectRatio];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">{label}</label>

      {uploadedUrl ? (
        <div className="relative">
          <div
            className="relative overflow-hidden rounded-lg border-2 border-gray-300"
            style={{ width: size.width, height: size.height }}
          >
            <Image
              src={uploadedUrl}
              alt="Upload"
              fill
              className="object-cover"
              sizes={`${size.width}px`}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setUploadedUrl("");
              if (onRemove) onRemove();
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset="portfolio_preset"
          cloudName="dvfbzhr11"
          onSuccess={(result: any) => {
            onUpload(result);
          }}
          onError={onError}
          onUpload={(result: any) => {
            onUpload(result);
          }}
          options={{
            maxFiles: 1,
            folder: "portfolio",
            resourceType: "image",
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                open();
              }}
              disabled={loading}
              className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition"
              style={{ width: size.width, height: size.height }}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <svg
                  className="w-12 h-12 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {loading ? "Uploading..." : "Click to upload"}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PNG, JPG, GIF up to 10MB
                </span>
              </div>
            </button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
};
