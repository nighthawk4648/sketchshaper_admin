import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import envConfig from "../configs/envConfig.js";

export const SERVICE_TYPE_CONFIG = {
  architecture: {
    label: "Architectural Project",
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    dotClass: "bg-emerald-500",
    icon: "heroicons:home",
  },
  "single-model": {
    label: "Bespoke 3D Model",
    badgeClass:
      "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
    dotClass: "bg-sky-500",
    icon: "heroicons:cube",
  },
  textures: {
    label: "Textures & Materials",
    badgeClass:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
    dotClass: "bg-purple-500",
    icon: "heroicons:square-3-stack-3d",
  },
  extension: {
    label: "Plugin / Extension",
    badgeClass:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    dotClass: "bg-amber-500",
    icon: "heroicons:cpu-chip",
  },
  support: {
    label: "General Support",
    badgeClass:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
    dotClass: "bg-rose-500",
    icon: "heroicons:chat-bubble-left-right",
  },
};

export const getServiceTypeInfo = (type) => {
  if (!type) {
    return {
      label: "Homepage Message",
      badgeClass:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20",
      dotClass: "bg-slate-400",
      icon: "heroicons:envelope",
    };
  }
  return (
    SERVICE_TYPE_CONFIG[type] || {
      label: type,
      badgeClass:
        "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20",
      dotClass: "bg-slate-400",
      icon: "heroicons:tag",
    }
  );
};

/**
 * Normalizes phone numbers for WhatsApp Web links.
 * Handles local Bangladeshi numbers (01...) by prepending 88.
 * Preserves international numbers with country codes.
 */
export const toWhatsAppNumber = (rawPhone) => {
  if (!rawPhone || typeof rawPhone !== "string") return null;
  const digits = rawPhone.replace(/\D/g, "");

  // Bangladesh standard: 01XXXXXXXXX (11 digits) -> 8801XXXXXXXXX
  if (digits.length === 11 && digits.startsWith("01")) {
    return `88${digits}`;
  }
  // Bangladesh already formatted with country code
  if (digits.length === 13 && digits.startsWith("8801")) {
    return digits;
  }
  // Strip double zero international prefix
  if (digits.startsWith("00")) {
    const cleaned = digits.slice(2);
    return cleaned.length >= 8 ? cleaned : null;
  }
  // Standard international phone numbers
  if (digits.length >= 8 && digits.length <= 15) {
    return digits;
  }
  return null;
};

/**
 * Validates that a reference URL is safe to open (blocks javascript: and malformed strings).
 */
export const isSafeHttpUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== "string") return false;
  let url = rawUrl.trim();
  if (!url) return false;
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  try {
    const parsed = new URL(url);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname) &&
      parsed.hostname.includes(".")
    );
  } catch (err) {
    return false;
  }
};

const MAILTO_QUOTE_LIMIT = 1000;

/**
 * Builds a safe "Reply via Email" mailto: link.
 * Every dynamic part is URI-encoded and the quoted original message is truncated
 * so the link stays within what mail clients accept.
 * Pass includeOriginal=false for a bare subject-only link (table row).
 */
export const buildReplyMailto = ({
  email,
  name,
  scope,
  message,
  includeOriginal = true,
}) => {
  const subject = `Re: ${scope || "Inquiry"} - SketchShaper`;
  let url = `mailto:${encodeURIComponent(email || "")}?subject=${encodeURIComponent(subject)}`;
  if (includeOriginal && message) {
    const truncated = message.length > MAILTO_QUOTE_LIMIT;
    const quoted = message.slice(0, MAILTO_QUOTE_LIMIT);
    const body = `\n\n---\nOriginal message from ${name || "client"}:\n${quoted}${truncated ? "\n[...truncated]" : ""}`;
    url += `&body=${encodeURIComponent(body)}`;
  }
  return url;
};

export const getAuthToken = () => {
  const cookieToken = Cookies.get("token");
  if (cookieToken) return cookieToken;
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed?.token || parsed?.auth?.token || "";
    }
  } catch (err) {
    // Ignore parse error
  }
  return "";
};

/**
 * Custom hook to safely fetch private attachments with Bearer token authentication.
 * Prevents non-serializable Blobs from polluting the Redux store.
 * Automatically revokes object URLs on unmount, modal close, or ID change to prevent memory leaks.
 */
export const useAuthedBlobUrl = (messageId, enabled = true) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!messageId || !enabled) {
      setBlobUrl(null);
      setIsLoading(false);
      setIsError(false);
      return;
    }

    const abortController = new AbortController();
    let currentObjectUrl = null;

    const fetchAttachment = async () => {
      // Drop the previous (already revoked) URL immediately so a stale image never flashes
      setBlobUrl(null);
      setIsLoading(true);
      setIsError(false);

      try {
        const token = getAuthToken();
        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(
          `${envConfig.apiUrl}/contact/${messageId}/attachment?inline=1`,
          {
            headers,
            signal: abortController.signal,
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch attachment: ${res.status}`);
        }

        const blob = await res.blob();
        if (abortController.signal.aborted) return;
        currentObjectUrl = URL.createObjectURL(blob);
        setBlobUrl(currentObjectUrl);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch authed attachment blob:", err);
          setIsError(true);
        }
      } finally {
        if (!abortController.signal.aborted) setIsLoading(false);
      }
    };

    fetchAttachment();

    return () => {
      abortController.abort();
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [messageId, enabled]);

  return { blobUrl, isLoading, isError };
};
