export function PillarCard({
  icon,
  title,
  description,
  ordinal,
}: {
  icon: string
  title: string
  description: string
  ordinal: string
}) {
  return (
    <div className="relative flex flex-col bg-white rounded-[var(--radius-card)] border border-[var(--color-hairline)] px-5 pt-12 pb-5">
      {/* Hole punch — canvas-soft matches the section bg, giving a real-hole effect */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full bg-[var(--color-canvas-soft)] border border-[var(--color-hairline)]" />

      {/* Ordinal header */}
      <div className="text-center mb-3">
        <p className="text-[15px] tracking-[1.5px] font-mono text-[var(--color-body)]">
          {ordinal}
        </p>
      </div>

      <div className="border-t border-[var(--color-hairline)] mb-4" />

      {/* Title */}
      <h3 className="text-[20px] font-bold text-[var(--color-espresso)] leading-[1.2] break-keep mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[10.5px] text-[var(--color-body)] leading-[1.7] flex-1">
        {description}
      </p>

      {/* Hanja — decorative illustration area */}
      <div className="flex justify-center py-6">
        <span
          className="text-[62px] leading-none select-none text-[var(--color-hairline)] font-serif"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>


    </div>
  )
}
