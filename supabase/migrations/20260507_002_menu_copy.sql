-- 메뉴 아이템 상세 설명 업데이트 + 흑돼지 김치찌개 추가

-- 시그니처 흑돼지 모듬 — 다부위 설명
update public.menu_items
  set description_ko = '산청 흑돼지목살·삼겹살·이겹살·항정살·가브리살 등 다양한 부위를 한 번에 맛볼 수 있는 인기 메뉴. 신선한 재료와 정성 어린 손질로 육질이 부드럽고 풍부한 육즙을 자랑합니다.'
  where name_ko = '지리산 명품 숙성 흑돼지 모듬';

-- 삼겹살 — 고기 본연의 맛
update public.menu_items
  set description_ko = '육즙이 풍부하고 부드러운 식감이 특징. 고기 본연의 맛을 즐길 수 있습니다.'
  where name_ko = '지리산 숙성 통삼겹살';

-- 항정살 — 고소하고 쫄깃
update public.menu_items
  set description_ko = '특유의 고소한 맛과 쫄깃한 식감이 일품. 고기 마니아들에게 특히 사랑받는 부위입니다.'
  where name_ko = '지리산 숙성 항정살';

-- 가브리살 — 고소하고 쫄깃
update public.menu_items
  set description_ko = '특유의 고소한 맛과 쫄깃한 식감이 일품. 고기 마니아들에게 특히 사랑받는 부위입니다.'
  where name_ko = '지리산 숙성 가브리살';

-- 진꽃살 세트 — 프리미엄 코스
update public.menu_items
  set description_ko = '특별한 날을 위한 프리미엄 세트. 최상급 꽃살과 함께 다양한 사이드 메뉴가 제공되어 풍성한 식사를 즐길 수 있습니다.'
  where name_ko = '진꽃살 세트 (소고기)';

-- 아보카도 육회 — 여성 인기 메뉴
update public.menu_items
  set description_ko = '신선한 육회와 부드러운 아보카도의 조화로운 맛을 즐길 수 있는 특별한 메뉴. 여성 고객들에게 특히 인기입니다.'
  where name_ko = '아보카도 육회';

-- 양념소불고기 정식 — 점심특선
update public.menu_items
  set description_ko = '달콤하고 짭짤한 양념에 재운 부드러운 소불고기. 낙지볶음 소면과 6가지 반찬이 함께 제공되어 풍성한 한 끼.'
  where name_ko = '양념소불고기 정식';

-- 흑돼지 김치찌개 추가 (점심특선, 1인분)
insert into public.menu_items (
  category_id, name_ko, name_en, description_ko,
  price_krw, is_signature, is_lunch_special,
  available_at_yangjae, available_at_euljiro, sort_order
)
select
  id,
  '흑돼지 김치찌개',
  'Black Pork Kimchi Jjigae',
  '신선한 흑돼지와 숙성된 김치로 끓여낸 깔끔하고 시원한 맛의 김치찌개. 라면 사리를 추가하여 즐길 수 있는 인기 메뉴입니다.',
  12000,
  false,
  true,
  true,
  true,
  0
from public.menu_categories
where slug = 'meal';
