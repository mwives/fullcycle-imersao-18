import Image from "next/image";

export type EventImageProps = {
  src: string;
  alt: string;
};

export function EventImage({ alt, src }: EventImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={277}
      height={277}
      priority
      className="rounded-2xl"
    />
  );
}
