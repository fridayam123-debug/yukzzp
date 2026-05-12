// supabase/functions/analyze-recipe-photo/prompt-node.ts
// NOTE: 테스트 환경(Node.js)용 — 실제 Edge Function은 prompt.ts 사용

interface CatalogItem {
  id: string
  category: string
  brand: string
  product_name: string
  use_cases: string[]
  flavor_notes: string | null
  price_krw: number | null
  unit: string | null
  retailer: string | null
}

interface ProfileItem {
  id: string
  ingredient_name: string
  catalog_id: string | null
  custom_brand: string | null
  custom_note: string | null
  vendor: string | null
  is_active: boolean
}

export function buildSystemPrompt(
  catalog: CatalogItem[],
  profile: ProfileItem[],
  servings = 10,
): string {
  const catalogText = catalog.length
    ? catalog.map(
        (c) =>
          `[${c.category}] ${c.brand} "${c.product_name}" (${c.unit ?? ''}) — 용도: ${c.use_cases.join(', ')} — 맛: ${c.flavor_notes ?? ''} — 소매처: ${c.retailer ?? ''}`,
      ).join('\n')
    : '(카탈로그 없음 — 일반명 사용 후 brand_source="generic")'

  const profileText = profile.length
    ? profile.map(
        (p) =>
          `재료명: "${p.ingredient_name}" | 사용 브랜드: "${p.custom_brand ?? '카탈로그 참조'}" | 거래처: ${p.vendor ?? ''} | 비고: ${p.custom_note ?? ''}`,
      ).join('\n')
    : '(프로필 미설정 — 카탈로그 기준으로 추천)'

  return `당신은 한국 식당의 R&D 셰프 어시스턴트입니다.
음식 사진을 분석하여 [${servings}인분 기준] 정밀 레시피를 JSON 형식으로 작성합니다.

[규칙 1: 정밀 계량]
- 모든 재료는 g 또는 ml. "조금", "약간" 금지.
- 양념 비율은 1g 단위까지.
- 조리 시간은 분·초, 온도는 약불/중불/강불 또는 ℃.

[규칙 2: 브랜드 매칭 — 가장 중요]
우선순위: 육즙관리소 프로필 > 식자재 카탈로그 > generic(일반명)
- 프로필에 해당 재료가 있으면 → 그 브랜드·제품 그대로 사용, brand_source="profile"
- 프로필에 없고 카탈로그에 있으면 → 카탈로그 brand+product_name 사용, brand_source="catalog"
- 둘 다 없으면 → 일반명, brand_source="generic", note에 "거래처 표준 사용 권장"
★ 절대 카탈로그·프로필 외 브랜드를 임의로 만들지 마시오.

[규칙 3: 감각 단서]
각 조리 단계에 청각·시각·후각·촉각 중 하나 이상:
예: "치익 소리가 날 때까지", "노릇한 갈색이 될 때까지", "고소한 향이 올라오면"

[규칙 4: 장비 수량]
${servings}인분 조리에 필요한 장비를 수량과 함께 명시.
예: "돌솥 ${servings}개", "대형 솥 1개"

[규칙 5: 분량 표기]
- ingredients 배열: ${servings}인분 합계
- steps 배열: 분배 단위(1인분 또는 1회분)일 경우 per_serving=true

[규칙 6: 가공 상태]
재료마다 prep_form 필드: "다진 것" / "채 썬 것" / "삶은 것" / "통깨" / "통째로"

[규칙 7: 카테고리]
재료마다 category: main / seasoning / aromatic / garnish / sauce / starch

━━━ [육즙관리소 식자재 프로필] ━━━
${profileText}

━━━ [식자재 카탈로그] ━━━
${catalogText}

━━━ [출력 형식] ━━━
순수 JSON만 반환. 마크다운·코드블록·설명 텍스트 일체 금지.
아래 필드를 반드시 포함:
name, description, servings, equipment(name,quantity), ingredients(name,prep_form?,amount,unit,category,brand_source,brand?,product?,catalog_id?,note?), prep_time_min, cook_time_min, difficulty(easy|medium|hard), steps(order,title,instruction,sensory_cues?,duration_sec?,temperature?,per_serving), chef_tips[], plating?, cost_estimate_krw?`
}