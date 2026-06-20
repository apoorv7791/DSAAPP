-- Profile row created on sign-up from the app. Tied to auth.users with ON DELETE CASCADE
-- so manual admin deletes stay consistent; the delete-account Edge Function also removes rows explicitly.

create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    username text,
    created_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
    on public.profiles
    for select
    to authenticated
    using ((select auth.uid()) = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
    on public.profiles
    for insert
    to authenticated
    with check ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
    on public.profiles
    for update
    to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);

drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own
    on public.profiles
    for delete
    to authenticated
    using ((select auth.uid()) = id);
