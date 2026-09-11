-- RLS работает на уровне строк, а не колонок: политика "profiles are
-- viewable by everyone" всё ещё отдавала бы contact через прямой REST-
-- запрос, даже без подтверждённой сделки. Сужаем публичный SELECT до
-- колонок без contact, а сам contact отдаём только через функцию,
-- которая проверяет, что вызывающий — подтверждённый визави по сделке.

revoke select on delivery.profiles from anon, authenticated;
grant select (id, role, name, avatar_url, bio, created_at)
  on delivery.profiles to anon, authenticated;

create function delivery.get_counterpart_contact(p_match_id uuid)
returns text
language plpgsql
security definer
set search_path = delivery, public
as $$
declare
  v_contact text;
begin
  select p.contact into v_contact
  from delivery.matches m
  join delivery.requests r on r.id = m.request_id
  join delivery.trips t on t.id = m.trip_id
  join delivery.profiles p
    on p.id = case
      when r.sender_id = auth.uid() then t.carrier_id
      when t.carrier_id = auth.uid() then r.sender_id
    end
  where m.id = p_match_id
    and m.status = 'confirmed'
    and (r.sender_id = auth.uid() or t.carrier_id = auth.uid());

  return v_contact;
end;
$$;

grant execute on function delivery.get_counterpart_contact(uuid) to authenticated;
