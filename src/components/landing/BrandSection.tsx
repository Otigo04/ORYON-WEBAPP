import Image from "next/image";

export function BrandSection() {
  return (
    <section className="bg-black py-14 flex flex-col items-center justify-center border-t border-white/5">
      <Image
        src="/logo/tas_wordmark.svg"
        alt="TAS Webworks"
        width={360}
        height={110}
        unoptimized
        priority
        className="h-20 w-auto sm:h-24"
      />
    </section>
  );
}
