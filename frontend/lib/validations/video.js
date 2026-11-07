/**
 * Safe Video URL Parsing & Validation Utility
 * Supports YouTube, Vimeo, and direct HTTPS video streams (MP4/WebM).
 * Strictly prevents raw HTML injection and malicious URIs.
 */

export const ALLOWED_ASPECT_RATIOS = ["16:9", "9:16", "1:1", "4:5", "21:9", "4:3"];

/**
 * Extracts and sanitizes video metadata from a user-supplied URL.
 *
 * @param {string} rawUrl - Video URL entered by admin
 * @returns {{
 *   isValid: boolean,
 *   provider: 'youtube' | 'vimeo' | 'direct' | 'none',
 *   cleanUrl: string | null,
 *   embedUrl: string | null,
 *   videoId: string | null,
 *   thumbnailUrl: string | null,
 *   error: string | null
 * }}
 */
export function parseVideoUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    return {
      isValid: true,
      provider: "none",
      cleanUrl: null,
      embedUrl: null,
      videoId: null,
      thumbnailUrl: null,
      error: null,
    };
  }

  const trimmed = rawUrl.trim();

  // Basic protocol check: must be https:// (or http:// in dev)
  if (!trimmed.startsWith("https://") && !trimmed.startsWith("http://")) {
    return {
      isValid: false,
      provider: "none",
      cleanUrl: null,
      embedUrl: null,
      videoId: null,
      thumbnailUrl: null,
      error: "Video URL must begin with https://",
    };
  }

  // Reject JavaScript, data, or protocol-relative injections
  if (/^(javascript:|data:|vbscript:|\/\/)/i.test(trimmed)) {
    return {
      isValid: false,
      provider: "none",
      cleanUrl: null,
      embedUrl: null,
      videoId: null,
      thumbnailUrl: null,
      error: "Potentially unsafe URL protocol rejected.",
    };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    return {
      isValid: false,
      provider: "none",
      cleanUrl: null,
      embedUrl: null,
      videoId: null,
      thumbnailUrl: null,
      error: "Invalid URL format.",
    };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // 1. YouTube Detection (youtube.com, youtu.be, youtube-nocookie.com)
  if (
    hostname.includes("youtube.com") ||
    hostname.includes("youtu.be") ||
    hostname.includes("youtube-nocookie.com")
  ) {
    let videoId = null;

    if (hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.slice(1).split("/")[0].split("?")[0];
    } else if (parsedUrl.pathname.startsWith("/watch")) {
      videoId = parsedUrl.searchParams.get("v");
    } else if (parsedUrl.pathname.startsWith("/embed/")) {
      videoId = parsedUrl.pathname.replace("/embed/", "").split("/")[0];
    } else if (parsedUrl.pathname.startsWith("/shorts/")) {
      videoId = parsedUrl.pathname.replace("/shorts/", "").split("/")[0];
    }

    // YouTube IDs are 11 alphanumeric characters, dashes, and underscores
    if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        isValid: true,
        provider: "youtube",
        cleanUrl: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
        videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        error: null,
      };
    }

    return {
      isValid: false,
      provider: "youtube",
      cleanUrl: null,
      embedUrl: null,
      videoId: null,
      thumbnailUrl: null,
      error: "Could not extract a valid 11-character YouTube video ID.",
    };
  }

  // 2. Vimeo Detection (vimeo.com, player.vimeo.com)
  if (hostname.includes("vimeo.com")) {
    let videoId = null;
    const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

    // Matches /123456789 or /channels/.../123456789 or /video/123456789
    for (const part of pathParts) {
      if (/^\d{6,12}$/.test(part)) {
        videoId = part;
        break;
      }
    }

    if (videoId) {
      return {
        isValid: true,
        provider: "vimeo",
        cleanUrl: `https://vimeo.com/${videoId}`,
        embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1&title=0&byline=0&portrait=0`,
        videoId,
        thumbnailUrl: null, // Vimeo requires an API call to get thumbnails
        error: null,
      };
    }

    return {
      isValid: false,
      provider: "vimeo",
      cleanUrl: null,
      embedUrl: null,
      videoId: null,
      thumbnailUrl: null,
      error: "Could not extract a valid numeric Vimeo video ID.",
    };
  }

  // 3. Direct Video Stream Detection (.mp4, .webm)
  const pathnameLower = parsedUrl.pathname.toLowerCase();
  if (pathnameLower.endsWith(".mp4") || pathnameLower.endsWith(".webm")) {
    return {
      isValid: true,
      provider: "direct",
      cleanUrl: trimmed,
      embedUrl: trimmed,
      videoId: pathnameLower.split("/").pop(),
      thumbnailUrl: null,
      error: null,
    };
  }

  return {
    isValid: false,
    provider: "none",
    cleanUrl: null,
    embedUrl: null,
    videoId: null,
    thumbnailUrl: null,
    error: "Unsupported video host. Please provide a valid YouTube, Vimeo, or direct .mp4/.webm URL.",
  };
}

