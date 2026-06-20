-- User-owned learning progress (optional sync target for the app).
-- Apply to a hosted project with `supabase db push` after `supabase link`, or merge into a baseline from `supabase db pull`.

create table if not exists public.learning_topic_progress (
    user_id uuid not null references auth.users (id) on delete cascade,
    topic_id text not null,
    completed boolean not null default true,
    updated_at timestamptz not null default now(),
    primary key (user_id, topic_id),
    constraint learning_topic_progress_topic_id_check check (char_length(topic_id) > 0 and char_length(topic_id) <= 64)
);

create index if not exists learning_topic_progress_user_id_idx on public.learning_topic_progress (user_id);

alter table public.learning_topic_progress enable row level security;

create policy learning_topic_progress_select_own
    on public.learning_topic_progress
    for select
    to authenticated
    using ((select auth.uid()) = user_id);

create policy learning_topic_progress_insert_own
    on public.learning_topic_progress
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);

create policy learning_topic_progress_update_own
    on public.learning_topic_progress
    for update
    to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy learning_topic_progress_delete_own
    on public.learning_topic_progress
    for delete
    to authenticated
    using ((select auth.uid()) = user_id);
