-- Migration to add difficulty to profiles and create user_goals and user_streaks tables.

-- 1. Add difficulty column to public.profiles if not exists
alter table public.profiles 
add column if not exists difficulty text constraint profiles_difficulty_check check (difficulty in ('beginner', 'intermediate', 'advanced'));

-- 2. Create user_goals table
create table if not exists public.user_goals (
    user_id uuid primary key references auth.users (id) on delete cascade,
    daily_minutes integer not null,
    created_at timestamptz not null default now()
);

-- Enable RLS for user_goals
alter table public.user_goals enable row level security;

-- Policies for user_goals
create policy user_goals_select_own
    on public.user_goals
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy user_goals_insert_own
    on public.user_goals
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy user_goals_update_own
    on public.user_goals
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy user_goals_delete_own
    on public.user_goals
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- 3. Create user_streaks table
create table if not exists public.user_streaks (
    user_id uuid primary key references auth.users (id) on delete cascade,
    current_streak integer not null default 0,
    last_active_date date,
    created_at timestamptz not null default now()
);

-- Enable RLS for user_streaks
alter table public.user_streaks enable row level security;

-- Policies for user_streaks
create policy user_streaks_select_own
    on public.user_streaks
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy user_streaks_insert_own
    on public.user_streaks
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy user_streaks_update_own
    on public.user_streaks
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy user_streaks_delete_own
    on public.user_streaks
    for delete
    to authenticated
    using (auth.uid() = user_id);
