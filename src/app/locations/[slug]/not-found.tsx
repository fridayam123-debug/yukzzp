export default function NotFound() {
  return (
    <main className="max-w-[600px] mx-auto py-32 text-center px-6">
      <h1 className="text-[32px] font-normal text-[var(--color-ink)]">지점을 찾을 수 없습니다</h1>
      <p className="mt-4 text-[var(--color-body)]">
        <a href="/" className="underline">홈으로 돌아가기</a>
      </p>
    </main>
  )
}
