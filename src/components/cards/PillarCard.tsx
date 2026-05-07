export function PillarCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="relative flex flex-col bg-white rounded-[var(--radius-card)] border border-[var(--color-hairline)] px-5 pt-12 pb-5">
      {/* Hole punch */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[18px] h-[18px] rounded-full bg-[var(--color-espresso)]" />

      {/* Brand header */}
      <div className="text-center mb-3">
        <p className="text-[9px] font-bold tracking-[3px] uppercase font-mono text-[var(--color-espresso)]">
          육즙관리소
        </p>
        <p className="text-[8px] tracking-[1.5px] font-mono text-[var(--color-body)] mt-0.5">
          다섯 가지 약속
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

      {/* Icon — illustration area */}
      <div className="flex justify-center py-8">
        <span className="text-[56px] opacity-80" aria-hidden="true">{icon}</span>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--color-hairline)] pt-3">
        <p className="text-[8px] font-bold tracking-[2px] uppercase font-mono text-center text-[var(--color-body)]">
          육즙관리소
        </p>
        <p className="text-[7px] tracking-[1px] font-mono text-center text-[var(--color-forest-mid)] mt-0.5">
          양재 · 을지로동대문
        </p>
      </div>
    </div>
  )
}
