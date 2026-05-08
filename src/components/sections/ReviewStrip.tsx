const REVIEWS = [
  {
    text: '육즙관리소 다녀왔는데 고기 퀄 진짜 좋고 육즙 제대로 터져요. 직원분이 직접 구워줘서 편하고, 반찬이랑 조합도 좋아서 계속 손 가는 맛. 깔끔한 분위기까지 있어서 재방문 각입니다.',
    author: 'eni28',
    branch: '양재역점',
  },
  {
    text: '모듬으로 주문했는데 고기 퀄리티 좋고 부위마다 식감이 달라서 먹는 재미가 있습니다. 직원분이 친절하시고 직접 구워주셔서 편했습니다. 서울에서 분위기 좋고 고기 퀄리티까지 갖춰서 안 올 이유가 없어요.',
    author: 'soqek',
    branch: '양재역점',
  },
  {
    text: '매장도 너무 청결해서 좋았고, 음식도 정갈하게 잘 나오더라고요. 겉절이 맛보고 기절. 고기는 역시나 질이 훌륭합니다. 꼭 또 올거예요.',
    author: 'yamjjj',
    branch: '양재역점',
  },
  {
    text: '직접 구워주시는데 삼겹살 진짜 두툼하고 한입 씹으면 육즙이 입안 가득차는게 제가 먹어본 삼겹살 중에 풍미가 제일 좋은 것 같아요. 아보카도 육회도 담백하니 짜지 않고 좋았습니다.',
    author: '신겅겅',
    branch: '을지로동대문점',
  },
  {
    text: '이원일 셰프 추천맛집으로 찾았다가 정말 고기맛집 인정하고 재방문 했어요. 직접 구워주시는데 촉촉 육즙 가득하게 구워주시고 곁들임 반찬 하나하나 안맛있는게 없어요.',
    author: 'Susue3',
    branch: '을지로동대문점',
  },
  {
    text: '인테리어도 넘 고급스럽고 직원분께서 정성스럽게 고기도 맛있게 구워주셨어요. 반찬이 아주 깔끔하고 다 맛있어요. 또 가고 싶은 곳입니다.',
    author: '키디62',
    branch: '을지로동대문점',
  },
]

export function ReviewStrip() {
  return (
    <section className="bg-[var(--color-canvas)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">
          CUSTOMER REVIEWS
        </div>
        <h2 className="text-[32px] md:text-[40px] font-normal text-[var(--color-ink)] mt-3">
          방문자 리뷰
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {REVIEWS.map((r) => (
            <div
              key={r.author}
              className="flex flex-col bg-white rounded-[var(--radius-card)] p-8"
            >
              <span
                className="text-[52px] leading-[0.8] text-[var(--color-hairline)] font-serif select-none"
                aria-hidden="true"
              >
                "
              </span>
              <p className="mt-5 text-[14px] text-[var(--color-ink)] leading-[1.85] flex-1">
                {r.text}
              </p>
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-[var(--color-hairline)]">
                <span className="text-[13px] text-[var(--color-body)]">— {r.author}</span>
                <span className="text-[10px] tracking-[1px] font-mono text-[var(--color-body)] border border-[var(--color-hairline)] rounded-full px-3 py-1">
                  {r.branch}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
