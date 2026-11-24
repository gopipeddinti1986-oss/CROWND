"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateUploadedFile } from "@/lib/onboarding/validation";
import { uploadAssetAction } from "@/lib/onboarding/actions";

interface AssetUploadProps {
  label: string;
  description: string;
  bucket: "avatars" | "brand-assets";
  currentUrl?: string | null;
  onUploadComplete: (url: string) => void;
  className?: string;
}

export function AssetUpload({
  label,
  description,
  bucket,
  currentUrl,
  onUploadComplete,
  className = "",
}: AssetUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const context = bucket === "brand-assets" ? "logo" : "avatar";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);

    // Client-side validation
    const validation = validateUploadedFile(
      { size: file.size, type: file.type, name: file.name },
      context
    );

    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    // Local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Server-side upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      const res = await uploadAssetAction(formData);

      if (res.success && res.url) {
        setSuccess(true);
        onUploadComplete(res.url);
      } else {
        setError(res.error || "Failed to upload image. Please try again.");
      }
    } catch {
      setError("An unexpected network error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    setSuccess(false);
    onUploadComplete("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
        {label}
      </label>
      <p className="text-xs text-muted">{description}</p>

      {error && (
        <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {preview ? (
        <div className="flex items-center gap-4 rounded border border-border bg-surface p-3">
          <div className="relative h-16 w-16 overflow-hidden rounded border border-border bg-stone-100 dark:bg-stone-900">
            <Image
              src={preview}
              alt="Uploaded preview"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                  <span>Uploading securely...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-700 dark:text-emerald-400">Upload verified</span>
                </>
              ) : (
                <span>Ready</span>
              )}
            </div>
            <p className="text-[11px] text-muted">
              {bucket === "avatars" ? "Max 5MB • JPG, PNG, WebP" : "Max 10MB • JPG, PNG, WebP, SVG"}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUploading}
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Upload ${label}`}
          className="focus:ring-accent/40 flex cursor-pointer flex-col items-center justify-center rounded border border-dashed border-border bg-surface p-6 text-center transition-colors hover:border-accent hover:bg-stone-50 focus:outline-none focus:ring-2 dark:hover:bg-stone-900/50"
        >
          <UploadCloud className="mb-2 h-8 w-8 text-muted" aria-hidden="true" />
          <span className="text-xs font-semibold text-foreground">
            Click to upload or drag &amp; drop
          </span>
          <span className="mt-1 text-[11px] text-muted">
            {bucket === "avatars" ? "PNG, JPG, WebP up to 5MB" : "PNG, JPG, SVG, WebP up to 10MB"}
          </span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={
          bucket === "avatars"
            ? "image/jpeg,image/png,image/webp,image/gif"
            : "image/jpeg,image/png,image/webp,image/svg+xml"
        }
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
    </div>
  );
}
