-- Баг из 0004: contact запрещён к прямому SELECT для всех (это верно —
-- виден только подтверждённому визави). Но owner тоже не мог прочитать
-- СВОЙ contact при открытии экрана профиля — а Postgres валит весь select
-- целиком, если хоть одна запрошенная колонка недоступна, так что вместе
-- с contact переставали читаться и name/bio в том же запросе.
-- Даём владельцу профиля отдельный путь для чтения своего же contact.

create function delivery.get_own_contact()
returns text
language sql
security definer
set search_path = delivery, public
stable
as $$
  select contact from delivery.profiles where id = auth.uid();
$$;

grant execute on function delivery.get_own_contact() to authenticated;
