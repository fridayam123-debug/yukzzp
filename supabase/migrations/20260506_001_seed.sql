-- Seed: menu_categories + locations (양재·을지로) + menu_items (18개)

-- menu_categories
insert into public.menu_categories (slug, name_ko, name_en, sort_order) values
  ('signature', '시그니처 흑돼지', 'Signature Black Pork', 1),
  ('beef',       '소고기',           'Beef',                2),
  ('appetizer',  '안주·전채',         'Appetizers',          3),
  ('meal',       '식사·점심특선',     'Meals & Lunch Specials', 4),
  ('drink',      '주류·콜키지',       'Drinks & Corkage',    5);

-- locations: 양재
insert into public.locations (
  slug, name_ko, name_en, category_ko, category_en,
  address_road, address_jibun, postal_code, phone, virtual_phone,
  hours, parking, amenities, rooms, group_seats, geo,
  naver_place_id, catchtable_url, meta_description_ko, meta_description_en
) values (
  'yangjae',
  '육즙관리소 양재역점', 'Yukzzp Yangjae',
  '돼지고기구이', 'Korean BBQ',
  '서울 강남구 강남대로44길 7 1층',
  '서울 강남구 도곡동 952-11',
  '06266',
  '0507-1335-6363',
  '0507-1335-6363',
  '{"weekday":{"open":"11:30","close":"23:00","last_order":"22:00","break":["14:00","16:00"]},"weekend":{"open":"16:00","close":"22:00","last_order":"21:00"}}'::jsonb,
  '{"available":false,"info":"서초구청 / 양재 공영주차장 / SK허브프리모(주차비 지원 X)"}'::jsonb,
  array['콜키지(유료)','유아의자','대기공간','포장','예약','남녀 화장실 분리','간편결제'],
  '{"min":6,"max":20}'::jsonb,
  '{"min":20,"max":40}'::jsonb,
  '{"latitude":37.4836,"longitude":127.0349}'::jsonb,
  '1672141709',
  'https://app.catchtable.co.kr/ct/shop/yanggae___meat',
  '양재역 3번 출구 도보 2분. 룸 6—20인·단체 20—40인. 콜키지·점심특선·가족 친화. 캐치테이블 실시간 예약.',
  'Premium Korean BBQ at Yangjae Station. Lee Won-il chef-recommended Jirisan black pork.'
);

-- locations: 을지로
insert into public.locations (
  slug, name_ko, name_en, category_ko, category_en,
  address_road, address_jibun, postal_code, phone, virtual_phone,
  hours, parking, amenities, rooms, group_seats, geo,
  naver_place_id, catchtable_url, meta_description_ko, meta_description_en
) values (
  'euljiro',
  '육즙관리소 더룸 을지로동대문점', 'Yukzzp The Room Eulji-ro Dongdaemun',
  '육류, 고기요리', 'Meat / BBQ',
  '서울 중구 을지로43길 7 1층, 2층',
  '서울 중구 을지로6가 18-53',
  '04564',
  '02-2275-2322',
  '0507-1461-7228',
  '{"daily":{"open":"11:00","close_next_day":"05:00","last_order":"04:00","break_weekday":["14:30","16:30"]}}'::jsonb,
  '{"available":true,"info":"굿모닝시티 지하 1시간 무료 + 엘리베이터 직통"}'::jsonb,
  array['단체 이용 가능','예약','유아의자','주차','남녀 화장실 분리','간편결제'],
  '{"min":4,"max":16}'::jsonb,
  '{"min":20,"max":40}'::jsonb,
  '{"latitude":37.5664,"longitude":127.0091}'::jsonb,
  '2033717879',
  'https://app.catchtable.co.kr/ct/shop/yukjeup_ddm',
  '동대문 DDP 인근. 매일 11:00—05:00 운영. 룸 4—16인·단체 20—40인. 굿모닝시티 1시간 무료 주차.',
  'Premium Korean BBQ near DDP Dongdaemun. Open daily 11am—5am.'
);

-- menu_items
with cats as (select id, slug from public.menu_categories)
insert into public.menu_items (category_id, name_ko, name_en, description_ko, price_krw, weight_g, is_signature, sort_order) values
  ((select id from cats where slug='signature'), '지리산 명품 숙성 흑돼지 모듬', 'Premium Jirisan Black Pork Platter', '특삼겹·특목살·항정살·가브리살·이겹살', 57000, null, true, 1),
  ((select id from cats where slug='signature'), '지리산 숙성 통삼겹살', 'Aged Pork Belly', null, 19000, 160, false, 2),
  ((select id from cats where slug='signature'), '지리산 숙성 가브리살', 'Aged Gabri-sal', null, 21000, 160, false, 3),
  ((select id from cats where slug='signature'), '지리산 숙성 항정살', 'Aged Jowl Meat', null, 21000, 160, false, 4),
  ((select id from cats where slug='signature'), '지리산 숙성 특이겹살', 'Aged Special Pork', null, 21000, 160, false, 5),
  ((select id from cats where slug='beef'),      '진꽃살 세트 (소고기)', 'Jin Kkotsal Beef Set', '코스 정찬을 위한 프리미엄 소고기 500g', 87000, 500, true, 1),
  ((select id from cats where slug='beef'),      '떡목심살 (소고기)', 'Beef Neck', null, 29000, 150, false, 2),
  ((select id from cats where slug='appetizer'), '아보카도 육회', 'Avocado Yukhoe', '신선한 육회와 부드러운 아보카도', 28000, null, true, 1),
  ((select id from cats where slug='meal'),      '양념소불고기 정식', 'Bulgogi Lunch Set', '점심특선 — 낙지볶음 소면, 6찬', 24000, null, false, 1),
  ((select id from cats where slug='meal'),      '고기듬뿍 고추장찌개', 'Pork Gochujang Stew', '리뷰 이벤트 인기 메뉴', 9000, null, false, 2),
  ((select id from cats where slug='meal'),      '강원도 막된장찌개', 'Doenjang Stew', null, 8000, null, false, 3),
  ((select id from cats where slug='meal'),      '묵은지 물 막국수', 'Cold Buckwheat Noodles', null, 9000, null, false, 4),
  ((select id from cats where slug='meal'),      '묵은지 비빔국수', 'Spicy Buckwheat Noodles', null, 9000, null, false, 5),
  ((select id from cats where slug='meal'),      '폭신폭신 계란찜', 'Fluffy Steamed Egg', null, 6000, null, false, 6),
  ((select id from cats where slug='meal'),      '철판 치즈 김치볶음밥', 'Cheese Kimchi Fried Rice', null, 8000, null, false, 7),
  ((select id from cats where slug='drink'),     '와인 콜키지', 'Wine Corkage', null, 20000, null, false, 1),
  ((select id from cats where slug='drink'),     '위스키 콜키지', 'Whiskey Corkage', '얼음 + 언더락 전용 잔 제공', 30000, null, false, 2),
  ((select id from cats where slug='drink'),     '블랑 생맥주', 'Blanc Draft Beer', null, 9000, null, false, 3);

-- update lunch_special flag
update public.menu_items
  set is_lunch_special = true
  where name_ko in ('양념소불고기 정식','고기듬뿍 고추장찌개','강원도 막된장찌개','묵은지 물 막국수','묵은지 비빔국수','폭신폭신 계란찜','철판 치즈 김치볶음밥');
