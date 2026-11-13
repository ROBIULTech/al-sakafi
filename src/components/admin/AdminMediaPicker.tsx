import React, { useState } from 'react';
import { Image as ImageIcon, Upload, X, Check, Loader2 } from 'lucide-react';

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
  token: string;
  hint?: string;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  value,
  onChange,
  token,
  hint,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [assets, setAssets] = useState<string[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError('');
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be smaller than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || '');
      if (!dataUrl) return;
      setUploading(true);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ filename: file.name, dataUrl }),
        });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) {
          throw new Error(data.error || 'Upload failed.');
        }
        onChange(data.url);
      } catch (err) {
        setUploadError(
          err instanceof Error ? err.message : 'Failed to upload image.'
        );
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const openGallery = async () => {
    setGalleryOpen(true);
    setLoadingAssets(true);
    try {
      const res = await fetch('/api/assets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = (await res.json()) as { assets?: string[] };
        setAssets(data.assets || []);
      }
    } catch {
      // Ignore fetch failure
    } finally {
      setLoadingAssets(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label className="text-[12px] font-medium text-white/85">{label}</label>
        {hint && <span className="text-[11px] text-[#8C8C8C]">{hint}</span>}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-[#1f1f1f] bg-[#080808] p-3 sm:flex-row sm:items-center">
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-[#1f1f1f] bg-[#121212] flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt={label}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-5 w-5 text-white/30" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/assets/images/..."
            className="w-full rounded-md border border-[#222222] bg-[#0f0f0f] px-3 py-2 text-[12px] text-white placeholder:text-white/30 focus:border-[#00BC91] focus:outline-none"
          />

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 rounded-md border border-[#262626] bg-[#141414] px-3 py-1.5 text-[11px] font-medium text-white hover:border-[#F20101] transition-colors cursor-pointer">
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#F20101]" />
              ) : (
                <Upload className="h-3.5 w-3.5 text-[#F20101]" />
              )}
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
              />
            </label>

            <button
              type="button"
              onClick={openGallery}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#262626] bg-[#141414] px-3 py-1.5 text-[11px] font-medium text-white/85 hover:border-[#00BC91] hover:text-white transition-colors cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5 text-[#00BC91]" />
              <span>Choose from Gallery</span>
            </button>
          </div>
        </div>
      </div>

      {uploadError && (
        <p className="text-[11px] text-[#F20101]">{uploadError}</p>
      )}

      {galleryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setGalleryOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Media Gallery"
        >
          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#222222] bg-[#0b0b0b] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#1c1c1c] px-5 py-4">
              <div>
                <h3 className="text-[15px] font-semibold text-white">
                  Media Library
                </h3>
                <p className="text-[12px] text-[#8C8C8C]">
                  Select any existing asset or uploaded image
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGalleryOpen(false)}
                aria-label="Close gallery"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#222222] text-white/80 hover:border-[#F20101] hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {loadingAssets ? (
                <div className="flex items-center justify-center py-14 text-[13px] text-[#8C8C8C]">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading images...
                </div>
              ) : assets.length === 0 ? (
                <div className="py-12 text-center text-[13px] text-[#8C8C8C]">
                  No images found yet. Upload one directly.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {assets.map((assetUrl) => {
                    const selected = value === assetUrl;
                    return (
                      <button
                        key={assetUrl}
                        type="button"
                        onClick={() => {
                          onChange(assetUrl);
                          setGalleryOpen(false);
                        }}
                        className={`group relative overflow-hidden rounded-lg border bg-[#111111] text-left transition-colors cursor-pointer ${
                          selected
                            ? 'border-[#00BC91]'
                            : 'border-[#1e1e1e] hover:border-white/40'
                        }`}
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-[#151515]">
                          <img
                            src={assetUrl}
                            alt={assetUrl}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="truncate px-2.5 py-2 text-[11px] text-[#A1A1AA]">
                          {assetUrl.split('/').pop()}
                        </div>
                        {selected && (
                          <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#00BC91] text-black">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
