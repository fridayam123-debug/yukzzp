-- Supabase SQL Editor에 붙여넣고 Run 하세요.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

-- 누구나 메시지를 읽을 수 있음 (공개 롤링페이퍼)
create policy "Anyone can read messages"
  on messages for select
  using (true);

-- 누구나 메시지를 남길 수 있음 (익명, 인증 없이 작성)
create policy "Anyone can insert messages"
  on messages for insert
  with check (char_length(message) > 0 and char_length(message) <= 300);

-- 최대 60개까지만 등록 가능 (수강생 정원)
create or replace function check_message_limit()
returns trigger as $$
begin
  if (select count(*) from messages) >= 60 then
    raise exception 'message limit reached';
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists enforce_message_limit on messages;
create trigger enforce_message_limit
  before insert on messages
  for each row execute function check_message_limit();
