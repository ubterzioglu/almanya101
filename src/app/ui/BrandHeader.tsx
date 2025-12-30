import Image from "next/image";

export default function BrandHeader() {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="relative h-12 w-12 overflow-hidden rounded-xl border bg-white">
        <Image
          src="/brand-logo.png"
          alt="almanya101 logo"
          fill
          className="object-contain p-2"
          priority
        />
      </div>

      <div>
        <div className="text-xl font-black tracking-tight">ALMANYA101</div>
        <div className="text-sm text-gray-600">
          Almanya’da aklına takılan her şey — kısa, net, pratik cevaplar.
        </div>
      </div>
    </div>
  );
}
