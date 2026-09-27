import { useState } from "react";

type CloudinaryImageProps = {
  src: string;
  alt: string;
  width: number;
  loading?: "eager" | "lazy";
};

function optimizeCloudinaryUrl(src: string, width: number): string {
  try {
    const url = new URL(src);
    if (url.hostname !== "res.cloudinary.com") return src;
    url.pathname = url.pathname.replace(
      "/image/upload/",
      `/image/upload/f_auto,q_auto,c_limit,w_${width}/`,
    );
    return url.toString();
  } catch {
    return src;
  }
}

export function CloudinaryImage({
  src,
  alt,
  width,
  loading = "lazy",
}: CloudinaryImageProps) {
  const optimizedSrc = optimizeCloudinaryUrl(src, width);

  return (
    <ImageFrame
      key={optimizedSrc}
      src={optimizedSrc}
      alt={alt}
      loading={loading}
    />
  );
}

function ImageFrame({
  src,
  alt,
  loading,
}: Pick<CloudinaryImageProps, "src" | "alt" | "loading">) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

  return (
    <span className="relative block h-full w-full overflow-hidden">
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-white/5 ${status === "loading" ? "animate-pulse" : ""}`}
      />
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
      />
    </span>
  );
}