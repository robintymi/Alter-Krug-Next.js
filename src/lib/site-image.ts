import { optimizedImageMap } from "@/generated/optimized-images";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

function hasBasePathPrefix(src: string) {
  return BASE_PATH && src.startsWith(`${BASE_PATH}/`);
}

export function getOptimizedImageSrc(src: string) {
  if (!src || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:")) {
    return src;
  }

  const normalizedSrc = hasBasePathPrefix(src) ? src.slice(BASE_PATH.length) : src;
  const optimizedSrc = optimizedImageMap[normalizedSrc as keyof typeof optimizedImageMap];

  if (!optimizedSrc) {
    return src;
  }

  return hasBasePathPrefix(src) ? `${BASE_PATH}${optimizedSrc}` : optimizedSrc;
}

export const BLUR_PLACEHOLDER =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwMCcgaGVpZ2h0PSc4MDAnIHZpZXdCb3g9JzAgMCAxMjAwIDgwMCcgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTIwMCcgaGVpZ2h0PSc4MDAnIGZpbGw9JyNGMEU1RDEnLz48cGF0aCBkPSdNMCAyMjBDMjAwIDE4MCAzMDAgMzIwIDQ4MCAyODBDNzAwIDIyMCA4NTAgMTAwIDEyMDAgMTQwVjgwMEgwVjIyMFonIGZpbGw9JyNFNkQ0QjcnLz48L3N2Zz4=";
