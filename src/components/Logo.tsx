import Image from "next/image";

type LogoProps = {
  className?: string;
  src?: string;
};

function isSvg(src: string) {
  return src.toLowerCase().endsWith(".svg");
}

export function LogoMark({ className, src = "/logo/tas_mark.svg" }: LogoProps) {
  // width/height entsprechen dem echten viewBox (86×104), damit das
  // Seitenverhältnis stimmt. Sichtbare Größe steuert die Höhen-Klasse (h-*),
  // die Breite läuft per width:auto mit – behebt die Next/Image-Aspect-Warnung.
  return (
    <Image
      src={src}
      alt="TAS Webworks"
      width={86}
      height={104}
      priority
      unoptimized={isSvg(src)}
      className={className}
      style={{ width: "auto" }}
    />
  );
}

export function LogoWordmark({ className, src = "/logo/tas_wordmark.svg" }: LogoProps) {
  // Echtes viewBox 360×110 – siehe LogoMark.
  return (
    <Image
      src={src}
      alt="TAS Webworks"
      width={360}
      height={110}
      priority
      unoptimized={isSvg(src)}
      className={className}
      style={{ width: "auto" }}
    />
  );
}
