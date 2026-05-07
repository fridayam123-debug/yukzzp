export function PillarCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-4 p-8 bg-white rounded-[var(--radius-card)]">
      <div className="text-3xl" aria-hidden="true">{icon}</div>
      <h3 className="text-[18px] font-medium text-[var(--color-ink)]">{title}</h3>
      <p className="text-[13px] text-[var(--color-body)] leading-[1.6]">{description}</p>
    </div>
  )
}
