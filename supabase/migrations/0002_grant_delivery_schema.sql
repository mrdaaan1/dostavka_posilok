-- В отличие от "public", кастомная схема не даёт ролям anon/authenticated
-- доступ автоматически — RLS-политики применяются только поверх базовых
-- GRANT-прав. Без этого PostgREST отвечает "permission denied for schema".

grant usage on schema delivery to anon, authenticated, service_role;

grant all on all tables in schema delivery to anon, authenticated, service_role;
grant all on all sequences in schema delivery to anon, authenticated, service_role;
grant all on all routines in schema delivery to anon, authenticated, service_role;

alter default privileges in schema delivery
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema delivery
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema delivery
  grant all on routines to anon, authenticated, service_role;
