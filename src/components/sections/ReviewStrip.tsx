import { Link } from '@/i18n/navigation'
import { getReviews, type Review } from '@/lib/fetchers/reviews'

const FALLBACK_YANGJAE: Review[] = [
  { id: '1', location_slug: 'yangjae', author: 'eni28', rec_count: 0, rating: 5, source: 'naver', visited_at: null, text: '육즙관리소 다녀왔는데 고기 퀄 진짜 좋고 육즙 제대로 터져요. 직원분이 직접 구워줘서 편하고, 반찬이랑 조합도 좋아서 계속 손 가는 맛. 깔끔한 분위기까지 있어서 재방문 각입니다.' },
  { id: '2', location_slug: 'yangjae', author: 'soqek', rec_count: 0, rating: 5, source: 'naver', visited_at: null, text: '모듬으로 주문했는데 고기 퀄리티 좋고 부위마다 식감이 달라서 먹는 재미가 있습니다. 직원분이 친절하시고 직접 구워주셔서 편했습니다.' },
  { id: '3', location_slug: 'yangjae', author: 'yamjjj', rec_count: 0, rating: 5, source: 'naver', visited_at: null, text: '매장도 너무 청결해서 좋았고, 음식도 정갈하게 잘 나오더라고요. 겉절이 맛보고 기절. 고기는 역시나 질이 훌륭합니다.' },
  { id: '4', location_slug: 'yangjae', author: 'jiyeon_k', rec_count: 0, rating: 5, source: 'naver', visited_at: null, text: '점심특선 먹으러 왔다가 가성비에 놀랐어요. 고기 퀄리티는 저녁이랑 똑같은데 가격이 합리적이라 자주 올 것 같습니다.' },
]

const FALLBACK_EULJIRO: Review[] = [
  { id: '5', location_slug: 'euljiro', author: '신겅겅', rec_count: 0, rating: 5, source: 'naver', visited_at: null, text: '직접 구워주시는데 삼겹살 진짜 두툼하고 한입 씹으면 육즙이 입안 가득차는게 제가 먹어본 삼겹살 중에 풍미가 제일 좋은 것 같아요.' },
  { id: '6', location_slug: 'euljiro', author: 'Susue3', rec_count: 0, rating: 5, source: 'naver', visited_at: null, text: '이원일 셰프 추천맛집으로 찾았다가 정말 고기맛집 인정하고 재방문 했어요. 직접 구워주시는데 촉촉 육즙 가득하게 구워주시고 곁들임 반찬 하나하나 안맛있는게 없어요.' },
  { id: '7', location_slug: 'euljiro', author: '키디62', rec_count: 0, rating: 5, source: 'naver', visited_at: null, text: '인테리어도 넘 고급스럽고 직원분께서 정성스럽게 고기도 맛있게 구워주셨어요. 반찬이 아주 깔끔하고 다 맛있어요.' },
  { id: '8', location_slug: 'euljiro', author: 'night_ddp', rec_count: 0, rating: 5, source: 'naver', visited_at: null, text: 'DDP 근처에 이런 퀄리티 고기집이 있다니 놀랐어요. 새벽에도 운영해서 회식 후에도 자주 오게 될 것 같아요. 하향식 덕트라 옷에 냄새 안 배는 것도 너무 좋고 공간이 럭셔리합니다.' },
]

function ReviewCard({ text, author }: { text: string; author: string }) {
  return (
    <div className="flex flex-col bg-white rounded-[var(--radius-card)] p-6">
      <span className="text-[48px] leading-[0.8] text-[var(--color-hairline)] font-serif select-none" aria-hidden="true">"</span>
      <p className="mt-4 text-[13px] text-[var(--color-ink)] leading-[1.85] flex-1">{text}</p>
      <div className="mt-6 pt-4 border-t border-[var(--color-hairline)]">
        <span className="text-[12px] text-[var(--color-body)]">— {author}</span>
      </div>
    </div>
  )
}

export async function ReviewStrip() {
  const [yangjae, euljiro] = await Promise.all([
    getReviews('yangjae', 8),
    getReviews('euljiro', 8),
  ])

  const yangjaeReviews = yangjae.length > 0 ? yangjae : FALLBACK_YANGJAE
  const euljiroReviews = euljiro.length > 0 ? euljiro : FALLBACK_EULJIRO

  const yangjaeSlice = yangjaeReviews.slice(0, 4)
  const euljiroSlice = euljiroReviews.slice(0, 4)

  return (
    <section id="reviews" className="bg-[var(--color-canvas)] py-16 md:py-24 px-6 md:px-24">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)]">CUSTOMER REVIEWS</div>
        <h2 className="text-[32px] md:text-[40px] font-normal text-[var(--color-ink)] mt-3" style={{ fontFamily: "'Cafe24Classictype', serif" }}>
          방문자 리뷰
        </h2>

        <div className="mt-12">
          <p className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)] mb-5">YANGJAE · 양재역본점</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {yangjaeSlice.map((r) => <ReviewCard key={r.id} text={r.text} author={r.author} />)}
          </div>
          <div className="mt-5 text-right">
            <Link href="/locations/yangjae" className="text-[12px] tracking-[1px] font-mono text-[var(--color-body)] hover:text-[var(--color-ink)] transition-colors">
              리뷰 더보기 →
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-[11px] tracking-[2px] font-mono text-[var(--color-body)] mb-5">EULJI-RO · 더룸 을지로동대문점</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {euljiroSlice.map((r) => <ReviewCard key={r.id} text={r.text} author={r.author} />)}
          </div>
          <div className="mt-5 text-right">
            <Link href="/locations/euljiro" className="text-[12px] tracking-[1px] font-mono text-[var(--color-body)] hover:text-[var(--color-ink)] transition-colors">
              리뷰 더보기 →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
