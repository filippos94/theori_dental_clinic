import { getImage, srcSet, fallbackSrc } from "@/lib/images";
import { clinic } from "@/config/clinic";

type Props = {
  name: string; // file name in assets/photos (no extension)
  alt: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  placeholderLabel?: string;
  badgeClassName?: string;
};

/** Responsive <picture> with AVIF + WebP srcset, intrinsic size (no layout shift) and lazy loading. */
export function Picture({ name, alt, sizes, className = "", imgClassName = "", priority = false, placeholderLabel, badgeClassName = "bottom-3 left-3" }: Props) {
  const img = getImage(name);
  if (!img) return <div className={`bg-aqua-100 ${className}`} role="img" aria-label={alt} />;
  return (
    <div className={`relative ${className}`}>
      <picture>
        <source type="image/avif" srcSet={srcSet(name, "avif")} sizes={sizes} />
        <source type="image/webp" srcSet={srcSet(name, "webp")} sizes={sizes} />
        <img
          src={fallbackSrc(name)}
          alt={alt}
          width={img.width}
          height={img.height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          className={`block h-full w-full object-cover ${imgClassName}`}
          style={{ aspectRatio: `${img.width} / ${img.height}` }}
        />
      </picture>
      {img.placeholder && clinic.showPlaceholderNotes && placeholderLabel && (
        <span className={`placeholder-note absolute !text-[0.7rem] ${badgeClassName}`}>{placeholderLabel}</span>
      )}
    </div>
  );
}
