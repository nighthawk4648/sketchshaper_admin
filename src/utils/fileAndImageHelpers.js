import envConfig from "@/configs/envConfig";

/**
 * Safely extracts a single File or Blob object from various input types:
 * - File instance
 * - Blob instance
 * - FileList collection
 * - Array containing File/Blob
 * Returns null if no valid file is present.
 */
export const extractFile = (val) => {
  if (!val) return null;
  if (val instanceof File || val instanceof Blob) return val;
  if (typeof FileList !== "undefined" && val instanceof FileList && val.length > 0) {
    return val[0];
  }
  if (Array.isArray(val) && val.length > 0) {
    if (val[0] instanceof File || val[0] instanceof Blob) return val[0];
  }
  return null;
};

/**
 * Resolves an image URL safely:
 * - Returns null for empty/falsy inputs
 * - Leaves absolute URLs (http:// or https://) untouched
 * - Strips redundant leading slashes and duplicate /uploads or /api/uploads segments
 * - Prepends normalized envConfig.apiImgUrl for relative paths
 */
export const resolveImageUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base = (envConfig?.apiImgUrl || "").trim();
  if (!base) {
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  const baseNormalized = base.endsWith("/") ? base : `${base}/`;
  const baseHasUploads = /\/uploads\/?$/i.test(base) || /\/api\/uploads\/?$/i.test(base);

  let cleanRelative = trimmed.replace(/^\/+/, "");
  if (baseHasUploads) {
    // Avoid duplicate /uploads/ or /api/uploads/ segments when base already contains them
    cleanRelative = cleanRelative.replace(/^(api\/uploads\/|uploads\/)+/i, "");
  }

  return `${baseNormalized}${cleanRelative}`;
};
