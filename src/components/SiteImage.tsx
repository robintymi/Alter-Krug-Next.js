import Image, { type ImageProps } from "next/image";
import { BLUR_PLACEHOLDER, getOptimizedImageSrc } from "@/lib/site-image";

type SiteImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
};

export function SiteImage({
  src,
  alt,
  placeholder,
  blurDataURL,
  ...props
}: SiteImageProps) {
  const resolvedPlaceholder = placeholder ?? "blur";

  return (
    <Image
      {...props}
      src={getOptimizedImageSrc(src)}
      alt={alt}
      placeholder={resolvedPlaceholder}
      blurDataURL={resolvedPlaceholder === "blur" ? blurDataURL ?? BLUR_PLACEHOLDER : blurDataURL}
    />
  );
}

