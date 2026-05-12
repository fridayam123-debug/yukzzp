-- supabase/migrations/20260513_005_ai_menu_dev.sql
-- AI 메뉴 개발 도구: ingredient_catalog / ingredient_profile / recipe_usage_log

-- ─── 1. ingredient_catalog ───────────────────────────────────────────────────
create table public.ingredient_catalog (
  id            uuid primary key default gen_random_uuid(),
  category      text not null,
  brand         text not null,
  product_name  text not null,
  sku           text,
  use_cases     text[] not null default '{}',
  flavor_notes  text,
  price_krw     int,
  unit          text,
  retailer      text,
  retailer_url  text,
  source_score  int not null default 50,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index idx_catalog_category  on public.ingredient_catalog(category);
create index idx_catalog_use_cases on public.ingredient_catalog using gin(use_cases);

-- ─── 2. ingredient_profile ───────────────────────────────────────────────────
create table public.ingredient_profile (
  id              uuid primary key default gen_random_uuid(),
  ingredient_name text not null,
  catalog_id      uuid references public.ingredient_catalog(id) on delete set null,
  custom_brand    text,
  custom_note     text,
  vendor          text,
  is_active       boolean not null default true,
  added_at        timestamptz not null default now()
);

-- ─── 3. recipe_usage_log ─────────────────────────────────────────────────────
create table public.recipe_usage_log (
  id            uuid primary key default gen_random_uuid(),
  admin_user_id uuid references public.admin_users(id) on delete set null,
  dish_name     text,
  input_tokens  int,
  output_tokens int,
  cost_usd      numeric(8,4),
  model         text not null default 'gemini-2.0-flash',
  tier          text not null default 'free',
  error         text,
  created_at    timestamptz not null default now()
);
create index idx_usage_date on public.recipe_usage_log(created_at);

-- ─── 4. 일별 사용량 뷰 ───────────────────────────────────────────────────────
create view public.daily_recipe_usage as
select
  date_trunc('day', created_at) as day,
  count(*)                       as call_count,
  sum(input_tokens)              as input_tokens,
  sum(output_tokens)             as output_tokens,
  sum(cost_usd)                  as cost_usd,
  count(*) filter (where error is not null) as error_count
from public.recipe_usage_log
group by 1 order by 1 desc;

-- ─── 5. RLS ──────────────────────────────────────────────────────────────────
alter table public.ingredient_catalog  enable row level security;
alter table public.ingredient_profile  enable row level security;
alter table public.recipe_usage_log    enable row level security;

create policy "admin only" on public.ingredient_catalog
  using (auth.uid() in (select id from public.admin_users));
create policy "admin only" on public.ingredient_profile
  using (auth.uid() in (select id from public.admin_users));
create policy "admin only" on public.recipe_usage_log
  using (auth.uid() in (select id from public.admin_users));

-- ─── 6. 식자재 카탈로그 시드 50개 ────────────────────────────────────────────
insert into public.ingredient_catalog
  (category, brand, product_name, sku, use_cases, flavor_notes, price_krw, unit, retailer)
values
-- 간장 5종
('간장','샘표','양조간장 501호 1.8L','8801073101008',array['무침','드레싱','나물'],'감칠맛 강함, 부드러운 짠맛',8900,'1.8L','식봄'),
('간장','샘표','진간장 701호 1.8L','8801073101015',array['조림','찜','볶음'],'짙고 달콤한 맛, 색깔 진함',9200,'1.8L','식봄'),
('간장','청정원','양조간장 500ml','8801007104004',array['무침','드레싱'],'깔끔한 감칠맛',4800,'500ml','식봄'),
('간장','CJ 백설','진간장 1.8L','8801007104011',array['조림','볶음'],'진한 색, 달콤함',8700,'1.8L','쿠팡 업소용'),
('간장','오뚜기','진간장 1.7L','8801045505151',array['찜','조림'],'균형 잡힌 간장맛',8500,'1.7L','네이버 스토어'),
-- 설탕 3종
('설탕','CJ 백설','정백당 3kg','8801007201009',array['양념','조림','드레싱'],'중립적인 단맛, 가장 범용',12500,'3kg','식봄'),
('설탕','CJ 백설','황설탕 3kg','8801007201016',array['양념','드레싱'],'약한 카라멜 향, 볶음 요리 적합',13000,'3kg','식봄'),
('설탕','큐원','흑설탕 1kg','8801062101003',array['양념','바비큐','찜'],'진한 단맛, 고기 양념 최적',5500,'1kg','쿠팡 업소용'),
-- 식초 4종
('식초','오뚜기','사과식초 1.8L','8801045504048',array['냉면','드레싱','무침'],'과실향, 부드러운 산미',7200,'1.8L','식봄'),
('식초','청정원','현미식초 900ml','8801007203003',array['피클','초밥','냉채'],'깔끔한 산미, 곡물 향',5400,'900ml','식봄'),
('식초','오뚜기','양조식초 1.8L','8801045504055',array['무침','일반 조리'],'표준 식초, 중립적',6500,'1.8L','쿠팡 업소용'),
('식초','오뚜기','2배 식초 900ml','8801045504062',array['냉면 양념','강한 새콤'],'산미 2배, 소량 사용',5800,'900ml','네이버 스토어'),
-- 육수팩 6종
('육수팩','청정원','멸치다시팩 10g×30','8801007301001',array['국물','찌개','조림'],'깔끔한 멸치 감칠맛',8500,'10g×30','식봄'),
('육수팩','오뚜기','사골육수팩 500ml','8801045601001',array['국물','탕','보양식'],'진한 사골 맛',2800,'500ml','식봄'),
('육수팩','사조','명절육수팩 1L','8801007302008',array['국물','밥상'],'다용도 국물',3200,'1L','쿠팡 업소용'),
('육수팩','청정원','채수팩 15g×20','8801007303005',array['채식 국물','비건'],'비건 국물, 채소 감칠맛',7800,'15g×20','식봄'),
('육수팩','오뚜기','닭육수팩 500ml','8801045602008',array['국물','찜'],'담백한 닭 육수',2600,'500ml','네이버 스토어'),
('육수팩','청정원','사골곰탕 육수팩 500ml','8801007304002',array['국물','사골탕'],'진한 사골 국물',3000,'500ml','식봄'),
-- 다시다·미원·조미료 4종
('조미료','CJ 다시다','쇠고기 다시다 300g','8801007401001',array['국물','찌개','볶음'],'쇠고기 감칠맛 강함',7500,'300g','식봄'),
('조미료','CJ 다시다','해물 다시다 300g','8801007401018',array['해물 국물','찌개'],'해물 감칠맛',7500,'300g','식봄'),
('조미료','대상','미원 1kg','8801004201001',array['감칠맛','일반 조리'],'MSG, 범용 감칠맛 보강',8500,'1kg','쿠팡 업소용'),
('조미료','청정원','맛선생 멸치맛 200g','8801007402008',array['국물','나물'],'멸치 기반 천연 조미료',6200,'200g','식봄'),
-- 액젓 3종
('액젓','청정원','멸치액젓 900ml','8801007501001',array['김치','나물','찌개'],'깔끔한 멸치 향',6800,'900ml','식봄'),
('액젓','청정원','까나리액젓 750ml','8801007502008',array['김치','찌개'],'부드러운 액젓 향',5900,'750ml','식봄'),
('액젓','오뚜기','새우젓 500g','8801045701001',array['김치','삼겹살','쌈'],'짭조름한 새우 향',5500,'500g','식봄'),
-- 고춧가루 3종
('고춧가루','청정원','청양고춧가루 100g','8801007601001',array['매운 요리','찌개','볶음'],'매운맛 강함',4200,'100g','식봄'),
('고춧가루','청정원','고운 고춧가루 200g','8801007602008',array['김치','양념'],'선명한 붉은색, 중간 매운맛',7800,'200g','식봄'),
('고춧가루','청정원','굵은 고춧가루 200g','8801007603005',array['볶음','찌개','나물'],'씹히는 식감, 풍부한 향',7500,'200g','쿠팡 업소용'),
-- 된장·고추장 5종
('된장','CJ 해찬들','우리쌀 된장 500g','8801007701001',array['찌개','쌈장','나물'],'구수하고 부드러운 맛',6500,'500g','식봄'),
('된장','청정원','순창 재래된장 500g','8801007702008',array['찌개','나물 무침'],'깊은 발효 향',6800,'500g','식봄'),
('고추장','CJ 해찬들','태양초 고추장 500g','8801007703005',array['비빔밥','볶음','양념'],'단맛+매운맛 균형',7200,'500g','식봄'),
('고추장','청정원','순창 고추장 500g','8801007704002',array['비빔밥','양념'],'순한 맛, 발효 향',7000,'500g','식봄'),
('고추장','오뚜기','태양초 고추장 350g','8801045801001',array['볶음','양념'],'달콤한 매운맛',5800,'350g','쿠팡 업소용'),
-- 청량음료·맛술 4종
('맛술','청하','청하 청주 360ml','8801084501001',array['잡내 제거','향미'],'생선·고기 잡내 제거',2800,'360ml','식봄'),
('맛술','오뚜기','맛술 750ml','8801045901001',array['잡내 제거','생선 요리'],'달콤한 맛술',4500,'750ml','식봄'),
('청량음료','롯데','칠성사이다 1.5L','8801062201001',array['양념 단맛','고기 잡내'],'탄산으로 고기 연화',1800,'1.5L','쿠팡 업소용'),
('청량음료','코카콜라','스프라이트 1.5L','8801062202008',array['양념','고기 잡내'],'탄산, 레몬향',1800,'1.5L','쿠팡 업소용'),
-- 기름 3종
('기름','청정원','참기름 450ml','8801007101001',array['나물','마무리','향미 강화'],'고소하고 진한 참기름 향',12500,'450ml','식봄'),
('기름','오뚜기','들기름 450ml','8801045201001',array['나물','구이'],'들깨 특유의 구수한 향',11000,'450ml','식봄'),
('기름','해표','콩기름 1.8L','8801062301001',array['튀김','볶음','일반 조리'],'중립적인 맛, 고온 적합',7500,'1.8L','식봄'),
-- 깨·기타 조미료 4종
('깨·조미료','농협','국산 통깨 500g','8801062401001',array['나물','마무리','비빔밥'],'고소한 깨 향',12000,'500g','식봄'),
('깨·조미료','사조','통후추 분쇄용 150g','8801062402008',array['육류','서양식','볶음'],'매콤한 후추 향',6500,'150g','쿠팡 업소용'),
('깨·조미료','오뚜기','다진마늘 500g','8801045301001',array['볶음','양념','찌개'],'간편한 다진마늘',4200,'500g','식봄'),
('깨·조미료','오뚜기','참깨 분태 100g','8801045302008',array['드레싱','나물','마무리'],'곱게 갈린 참깨',4800,'100g','네이버 스토어'),
-- 기타 6종
('기타','광천김','맛김가루 200g','8801062501001',array['비빔밥','국수','덮밥'],'바삭하고 짭조름한 김 향',8500,'200g','식봄'),
('기타','오뚜기','맛있는 단무지 1kg','8801045401001',array['비빔밥','볶음밥','냉면'],'아삭한 식감, 약한 단맛',4500,'1kg','식봄'),
('기타','서울우유','무염버터 450g','8801017501001',array['볶음','소테','코팅','돌솥'],'고소한 버터 향, 무염',9800,'450g','쿠팡 업소용'),
('기타','오뚜기','레몬즙 500ml','8801045402008',array['생선 잡내','드레싱','냉면'],'신선한 레몬산미',4200,'500ml','식봄'),
('기타','오뚜기','굴소스 500g','8801045403005',array['중식 볶음','잡채','양념'],'짙은 굴 감칠맛',6800,'500g','식봄'),
('기타','하인즈','우스터소스 290ml','8801062502008',array['스테이크','육류 소스','서양식'],'복합 향신료, 고기 소스',7500,'290ml','네이버 스토어');