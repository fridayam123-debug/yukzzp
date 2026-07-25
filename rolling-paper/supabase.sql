-- Supabase SQL Editor에 붙여넣고 Run 하세요.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

-- 누구나 메시지를 읽을 수 있음 (공개 롤링페이퍼)
create policy "Anyone can read messages"
  on messages for select
  using (true);

-- 누구나 메시지를 남길 수 있음 (인증 없이 작성)
create policy "Anyone can insert messages"
  on messages for insert
  with check (char_length(message) > 0 and char_length(message) <= 300);

-- 초기 8개 시드 메시지 (수강생들이 쓰기 전, 첫 화면이 비어보이지 않도록)
insert into messages (name, message, created_at) values
  ('이지수', '전승기 강사님 첫 강의 정말 잘 들었습니다! 설명이 귀에 쏙쏙 들어왔어요.', now() - interval '70 minutes'),
  ('익명', '떨리셨을 텐데 전혀 티 안 나셨어요. 다음 강의도 기대할게요!', now() - interval '61 minutes'),
  ('김민준', '첫 강의라고 믿기지 않을 만큼 준비를 알차게 해주셔서 감사했습니다.', now() - interval '52 minutes'),
  ('박서연', '어려운 내용도 쉽게 풀어주셔서 이해가 잘 됐어요. 응원합니다 :)', now() - interval '43 minutes'),
  ('익명', '목소리가 좋으셔서 그런지 집중이 잘 됐습니다. 고생하셨어요!', now() - interval '34 minutes'),
  ('최유진', '전승기를 만나면 전성기가 온다더니 진짜였네요. 감사합니다 강사님!', now() - interval '25 minutes'),
  ('정하늘', '질문에도 친절하게 답해주셔서 편하게 들을 수 있었어요. 응원합니다!', now() - interval '16 minutes'),
  ('익명', '첫 강의 완주 축하드려요! 다음 시간도 기대하고 있을게요.', now() - interval '7 minutes');
