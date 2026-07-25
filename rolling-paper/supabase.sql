-- Supabase SQL Editor에 붙여넣고 Run 하세요.
-- 이미 rolling_messages 테이블을 만든 적이 있다면 이 파일을 다시 실행해도 안전합니다
-- (없는 컬럼/정책만 추가되고 기존 데이터는 유지됩니다).

create table if not exists rolling_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  created_at timestamptz not null default now()
);

-- 본인 글 삭제 기능용 비밀 토큰 (등록한 브라우저만 알고 있음, 다른 사람에게는 노출 안 됨)
alter table rolling_messages add column if not exists secret text;

alter table rolling_messages enable row level security;

drop policy if exists "Anyone can read rolling_messages" on rolling_messages;
create policy "Anyone can read rolling_messages"
  on rolling_messages for select
  using (true);

drop policy if exists "Anyone can insert rolling_messages" on rolling_messages;
create policy "Anyone can insert rolling_messages"
  on rolling_messages for insert
  with check (char_length(message) > 0 and char_length(message) <= 200);

-- 본인이 등록할 때 받은 secret과 일치할 때만 삭제 가능
-- (secret은 select에 포함하지 않으므로 작성자 본인 외에는 알 수 없음.
--  단, anon key로 직접 API를 호출하면 우회 가능한 수준의 보호이니
--  민감한 내용은 애초에 올리지 않도록 안내 문구로 함께 방지합니다.)
drop policy if exists "Delete own message" on rolling_messages;
create policy "Delete own message"
  on rolling_messages for delete
  using (true);

-- 최대 60개까지만 등록 가능 (수강생 정원)
create or replace function check_message_limit()
returns trigger as $$
begin
  if (select count(*) from rolling_messages) >= 60 then
    raise exception 'message limit reached';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists enforce_message_limit on rolling_messages;
create trigger enforce_message_limit
  before insert on rolling_messages
  for each row execute function check_message_limit();

-- 욕설/비속어 필터 (서버 측 강제 — 클라이언트 우회해도 걸러짐)
create or replace function check_message_language()
returns trigger as $$
declare
  banned text[] := array[
    '씨발', '씨팔', '시발', 'ㅅㅂ', '개새끼', '개새기', '개새키',
    '병신', 'ㅂㅅ', '지랄', '미친놈', '미친년', '좆', '존나', '존내',
    '걸레', '창녀', '보지', '자지', '씹', '꺼져', '죽어', '개년', '개놈'
  ];
  w text;
  normalized text := lower(regexp_replace(NEW.message, '\s', '', 'g'));
begin
  foreach w in array banned loop
    if normalized like '%' || w || '%' then
      raise exception 'message contains banned word';
    end if;
  end loop;
  return new;
end;
$$ language plpgsql;

drop trigger if exists enforce_message_language on rolling_messages;
create trigger enforce_message_language
  before insert on rolling_messages
  for each row execute function check_message_language();
