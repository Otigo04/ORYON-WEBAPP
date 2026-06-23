import Image from "next/image";

type LogoProps = {
  className?: string;
  src?: string;
};

function isSvg(src: string) {
  return src.toLowerCase().endsWith(".svg");
}

export function LogoMark({ className, src = "/logo/otigo-mark.svg" }: LogoProps) {
  return (
    <Image
      src={src}
      alt="OTIGO Digital"
      width={32}
      height={32}
      priority
      unoptimized={isSvg(src)}
      className={className}
    />
  );
}

export function LogoWordmark({ className, src = "/logo/otigo-wordmark.svg" }: LogoProps) {
  return (
    <Image
      src={src}
      alt="OTIGO Digital"
      width={200}
      height={32}
      priority
      unoptimized={isSvg(src)}
      className={className}
      style={{ width: "auto" }}
    />
  );
}
