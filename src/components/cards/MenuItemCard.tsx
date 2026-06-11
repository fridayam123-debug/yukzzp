import Image from 'next/image'

export function MenuItemCard({
  name,
  description,
  priceKrw,
  priceLabel,
  isSignature,
  image,
}: {
  name: string
  description?: string | null
  priceKrw?: number | null
  priceLabel?: string | null
  isSignature?: boolean
  image?: string | null
}) {
  const priceText = priceLabel ?? (typeof priceKrw === 'number' ? `${priceKrw.toLocaleString()}원` : null)

  return (
    <div className="flex flex-col gap-2.5 md:gap-3">
      {/* 이미지 / 서비스 플레이스홀더 */}
      {image ? (
        <div className="relative aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-canvas-soft)]">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="relative aspect-[4/5] rounded-[var(--radius-card)] overflow-hidden bg-[var(--color-espresso)] flex flex-col items-center justify-between text-center px-4 py-8">
          <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-[var(--color-cream-gold)]">
            Signature Service
          </span>
          <div
            className="text-[var(--color-canvas)] leading-[1.1] text-[22px] md:text-[32px] font-normal"
            style={{ fontFamily: "'Cafe24Classictype', serif" }}
          >
            전담 서버의<br />그릴링 서비스
          </div>
          <div className="text-[9px] md:text-[11px] tracking-[0.05em] text-[var(--color-canvas)]/70 leading-[1.5]">
            가장 맛있는 타이밍에<br />완성되는 한 점
          </div>
        </div>
      )}

      {/* 텍스트 정보 */}
      <div className="flex flex-col gap-1">
        {/* 이름 */}
        <h3
          className="text-[13px] md:text-[17px] font-normal text-[var(--color-ink)] tracking-[-0.005em] leading-[1.4] [word-break:keep-all]"
        >
          {name}
        </h3>

        {/* SIGNATURE 배지 */}
        {isSignature && (
          <span className="text-[9px] tracking-[0.25em] uppercase text-[var(--color-cream-gold)] border-b border-[var(--color-cream-gold)] pb-px w-fit">
            SIGNATURE
          </span>
        )}

        {/* 가격 — 모바일: 이름 바로 아래 / 데스크톱: 이름 옆 */}
        {priceText && (
          <span className="text-[12px] md:text-[15px] tracking-[0.02em] text-[var(--color-ink)]">
            {priceText}
          </span>
        )}

        {/* 설명 — 모바일 숨김 */}
        {description && (
          <p className="hidden md:block text-[13px] text-[var(--color-body)] mt-0.5 leading-[1.5] [word-break:keep-all]">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
