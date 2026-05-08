import Image from 'next/image'

export function InteriorBanner() {
  return (
    <div className="relative w-full h-[56vw] max-h-[720px] min-h-[320px] overflow-hidden">
      <Image
        src="/photos/interior/euljiro-interior.jpg"
        alt="육즙관리소 을지로동대문점 내부 — 파동숙성 웨이브 아트월과 프리미엄 다이닝 공간"
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={false}
      />
    </div>
  )
}
