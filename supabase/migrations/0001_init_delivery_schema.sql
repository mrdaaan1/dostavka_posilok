-- Товарище — доставка посылок с попутчиками
-- Отдельная схема "delivery", чтобы не пересекаться с другими проектами
-- в этой же Supabase-организации (в public уже что-то есть в этом проекте).

create schema if not exists delivery;

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------

create type delivery.user_role as enum ('sender', 'carrier');

create type delivery.request_status as enum (
  'open', 'matched', 'in_transit', 'delivered', 'cancelled'
);

create type delivery.trip_status as enum (
  'open', 'matched', 'completed', 'cancelled'
);

create type delivery.match_status as enum (
  'pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'
);

-- ---------------------------------------------------------------------
-- profiles — 1:1 с auth.users. Роль выбирается один раз при регистрации.
-- ---------------------------------------------------------------------

create table delivery.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role delivery.user_role not null,
  name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now()
);

-- Автосоздание профиля при регистрации: роль приходит из
-- supabase.auth.signUp({ options: { data: { role: 'sender' | 'carrier' } } })
create function delivery.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into delivery.profiles (id, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'sender')::delivery.user_role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function delivery.handle_new_user();

-- ---------------------------------------------------------------------
-- requests — заявки отправителей
-- ---------------------------------------------------------------------

create table delivery.requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references delivery.profiles (id) on delete cascade,
  from_city text not null,
  to_city text not null,
  weight_kg numeric(6, 2),
  length_cm numeric(6, 1),
  width_cm numeric(6, 1),
  height_cm numeric(6, 1),
  ready_date date,
  deadline_date date,
  description text,
  status delivery.request_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- trips — поездки перевозчиков
-- ---------------------------------------------------------------------

create table delivery.trips (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references delivery.profiles (id) on delete cascade,
  from_city text not null,
  to_city text not null,
  departure_date date not null,
  capacity_kg numeric(6, 2),
  capacity_note text,
  status delivery.trip_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- matches — связка заявки и поездки, подтверждение сделки обеими сторонами
-- ---------------------------------------------------------------------

create table delivery.matches (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references delivery.requests (id) on delete cascade,
  trip_id uuid not null references delivery.trips (id) on delete cascade,
  status delivery.match_status not null default 'pending',
  confirmed_by_sender boolean not null default false,
  confirmed_by_carrier boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, trip_id)
);

-- ---------------------------------------------------------------------
-- messages — переписка сторон внутри сделки
-- ---------------------------------------------------------------------

create table delivery.messages (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references delivery.matches (id) on delete cascade,
  sender_id uuid not null references delivery.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- ratings — рейтинги и отзывы после сделки (фича "скоро" на лендинге,
-- но таблица закладывается сразу)
-- ---------------------------------------------------------------------

create table delivery.ratings (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references delivery.matches (id) on delete cascade,
  rater_id uuid not null references delivery.profiles (id) on delete cascade,
  ratee_id uuid not null references delivery.profiles (id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (match_id, rater_id)
);

-- ---------------------------------------------------------------------
-- Индексы под основные паттерны поиска
-- ---------------------------------------------------------------------

create index requests_route_idx on delivery.requests (from_city, to_city, status);
create index trips_route_idx on delivery.trips (from_city, to_city, status);
create index matches_request_idx on delivery.matches (request_id);
create index matches_trip_idx on delivery.matches (trip_id);
create index messages_match_idx on delivery.messages (match_id, created_at);

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------

alter table delivery.profiles enable row level security;
alter table delivery.requests enable row level security;
alter table delivery.trips enable row level security;
alter table delivery.matches enable row level security;
alter table delivery.messages enable row level security;
alter table delivery.ratings enable row level security;

-- profiles: публично читаемы (нужно видеть, с кем имеешь дело),
-- редактировать можно только свой профиль
create policy "profiles are viewable by everyone"
  on delivery.profiles for select
  using (true);

create policy "users can update own profile"
  on delivery.profiles for update
  using (auth.uid() = id);

-- requests: открытые заявки видны всем авторизованным,
-- создавать/менять может только владелец
create policy "open requests are viewable by authenticated users"
  on delivery.requests for select
  to authenticated
  using (true);

create policy "senders manage own requests"
  on delivery.requests for insert
  to authenticated
  with check (auth.uid() = sender_id);

create policy "senders update own requests"
  on delivery.requests for update
  to authenticated
  using (auth.uid() = sender_id);

create policy "senders delete own requests"
  on delivery.requests for delete
  to authenticated
  using (auth.uid() = sender_id);

-- trips: симметрично requests
create policy "open trips are viewable by authenticated users"
  on delivery.trips for select
  to authenticated
  using (true);

create policy "carriers manage own trips"
  on delivery.trips for insert
  to authenticated
  with check (auth.uid() = carrier_id);

create policy "carriers update own trips"
  on delivery.trips for update
  to authenticated
  using (auth.uid() = carrier_id);

create policy "carriers delete own trips"
  on delivery.trips for delete
  to authenticated
  using (auth.uid() = carrier_id);

-- matches: видны только двум участникам сделки (через владельцев заявки/поездки)
create policy "participants view own matches"
  on delivery.matches for select
  to authenticated
  using (
    exists (
      select 1 from delivery.requests r
      where r.id = request_id and r.sender_id = auth.uid()
    )
    or exists (
      select 1 from delivery.trips t
      where t.id = trip_id and t.carrier_id = auth.uid()
    )
  );

create policy "participants create matches"
  on delivery.matches for insert
  to authenticated
  with check (
    exists (
      select 1 from delivery.requests r
      where r.id = request_id and r.sender_id = auth.uid()
    )
    or exists (
      select 1 from delivery.trips t
      where t.id = trip_id and t.carrier_id = auth.uid()
    )
  );

create policy "participants update own matches"
  on delivery.matches for update
  to authenticated
  using (
    exists (
      select 1 from delivery.requests r
      where r.id = request_id and r.sender_id = auth.uid()
    )
    or exists (
      select 1 from delivery.trips t
      where t.id = trip_id and t.carrier_id = auth.uid()
    )
  );

-- messages: видны и создаются только участниками соответствующего match
create policy "participants view match messages"
  on delivery.messages for select
  to authenticated
  using (
    exists (
      select 1 from delivery.matches m
      join delivery.requests r on r.id = m.request_id
      join delivery.trips t on t.id = m.trip_id
      where m.id = match_id
        and (r.sender_id = auth.uid() or t.carrier_id = auth.uid())
    )
  );

create policy "participants send match messages"
  on delivery.messages for insert
  to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from delivery.matches m
      join delivery.requests r on r.id = m.request_id
      join delivery.trips t on t.id = m.trip_id
      where m.id = match_id
        and (r.sender_id = auth.uid() or t.carrier_id = auth.uid())
    )
  );

-- ratings: читать может любой (публичный рейтинг), оставлять — только
-- участник сделки про своего контрагента
create policy "ratings are viewable by everyone"
  on delivery.ratings for select
  using (true);

create policy "participants rate their counterpart"
  on delivery.ratings for insert
  to authenticated
  with check (
    rater_id = auth.uid()
    and exists (
      select 1 from delivery.matches m
      join delivery.requests r on r.id = m.request_id
      join delivery.trips t on t.id = m.trip_id
      where m.id = match_id
        and (
          (r.sender_id = auth.uid() and t.carrier_id = ratee_id)
          or (t.carrier_id = auth.uid() and r.sender_id = ratee_id)
        )
    )
  );
