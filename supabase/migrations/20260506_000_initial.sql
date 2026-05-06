-- 육즙관리소 Phase 1 초기 스키마
-- locations · menu_categories · menu_items · faqs · emergency_banner · admin_users + RLS

-- locations
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ko text not null,
  name_en text not null,
  category_ko text not null,
  category_en text not null,
  address_road text not null,
  address_jibun text not null,
  postal_code text,
  phone text not null,
  virtual_phone text,
  hours jsonb not null default '{}'::jsonb,
  parking jsonb default '{}'::jsonb,
  amenities text[] default '{}',
  rooms jsonb default '{}'::jsonb,
  group_seats jsonb default '{}'::jsonb,
  geo jsonb,
  naver_place_id text,
  catchtable_url text,
  hero_image text,
  photos text[] default '{}',
  meta_description_ko text,
  meta_description_en text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ko text not null,
  name_en text not null,
  sort_order int not null default 0
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.menu_categories(id) on delete cascade,
  name_ko text not null,
  name_en text,
  description_ko text,
  description_en text,
  price_krw int,
  weight_g int,
  image_url text,
  is_signature boolean default false,
  is_lunch_special boolean default false,
  available_at_yangjae boolean default true,
  available_at_euljiro boolean default true,
  sort_order int not null default 0,
  updated_at timestamptz default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  question_ko text not null,
  question_en text,
  answer_ko text not null,
  answer_en text,
  category text,
  location_id uuid references public.locations(id) on delete set null,
  sort_order int default 0
);

create table public.emergency_banner (
  id uuid primary key default gen_random_uuid(),
  message_ko text not null,
  message_en text,
  active boolean default false,
  created_at timestamptz default now(),
  expires_at timestamptz
);

create table public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','manager')),
  display_name text,
  created_at timestamptz default now()
);

-- RLS 활성
alter table public.locations enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.faqs enable row level security;
alter table public.emergency_banner enable row level security;
alter table public.admin_users enable row level security;

-- 읽기: 모두 public
create policy "public read locations" on public.locations for select using (true);
create policy "public read menu_categories" on public.menu_categories for select using (true);
create policy "public read menu_items" on public.menu_items for select using (true);
create policy "public read faqs" on public.faqs for select using (true);
create policy "public read active banner" on public.emergency_banner for select using (active = true);

-- 쓰기: owner only
create policy "owner write locations" on public.locations for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'));

create policy "owner write menu_categories" on public.menu_categories for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'));

create policy "owner write menu_items" on public.menu_items for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'));

create policy "owner write faqs" on public.faqs for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'));

create policy "owner write emergency_banner" on public.emergency_banner for all
  using (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'))
  with check (exists (select 1 from public.admin_users where id = auth.uid() and role = 'owner'));

create policy "owner read admin_users" on public.admin_users for select
  using (exists (select 1 from public.admin_users a where a.id = auth.uid() and a.role = 'owner'));

-- updated_at 트리거
create or replace function public.touch_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger touch_locations before update on public.locations for each row execute function public.touch_updated_at();
create trigger touch_menu_items before update on public.menu_items for each row execute function public.touch_updated_at();
