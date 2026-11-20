-- =============================================================================
-- The Human Perspective  -  Supabase schema
-- Run once: Supabase Dashboard -> SQL Editor -> paste -> Run.
-- Posts stay in Sanity; every table here refers to a post by its Sanity slug.
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------- helpers ----------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- profiles (one row per auth user) ---------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Seeker'
               check (char_length(btrim(display_name)) between 1 and 60),
  bio          text check (char_length(bio) <= 280),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(coalesce(nullif(btrim(new.raw_user_meta_data->>'display_name'), ''),
                  split_part(new.email, '@', 1), 'Seeker'), 60)
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- likes & saves ----------------------------------------------------
create table if not exists public.post_likes (
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  post_slug  text not null check (char_length(post_slug) between 1 and 200),
  created_at timestamptz not null default now(),
  primary key (user_id, post_slug)
);
create table if not exists public.post_saves (
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  post_slug  text not null check (char_length(post_slug) between 1 and 200),
  created_at timestamptz not null default now(),
  primary key (user_id, post_slug)
);

-- ---------- comments (one level of replies) ----------------------------------
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_slug  text not null check (char_length(post_slug) between 1 and 200),
  user_id    uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  parent_id  uuid references public.comments(id) on delete cascade,
  body       text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_slug, created_at);
create trigger comments_touch before update on public.comments
  for each row execute function public.touch_updated_at();

-- ---------- anonymous-safe counters (written only through functions) ---------
create table if not exists public.post_views (
  post_slug  text not null,
  visitor_id text not null,
  day        date not null default current_date,
  primary key (post_slug, visitor_id, day)
);
create table if not exists public.post_shares (
  id         bigserial primary key,
  post_slug  text not null,
  user_id    uuid,
  channel    text,
  created_at timestamptz not null default now()
);
create table if not exists public.site_visits (
  visitor_id text not null,
  day        date not null default current_date,
  primary key (visitor_id, day)
);
create index if not exists site_visits_day_idx on public.site_visits (day);

-- ---------- row level security ----------------------------------------------
alter table public.profiles     enable row level security;
alter table public.post_likes   enable row level security;
alter table public.post_saves   enable row level security;
alter table public.comments     enable row level security;
alter table public.post_views   enable row level security;
alter table public.post_shares  enable row level security;
alter table public.site_visits  enable row level security;

create policy "profiles readable"      on public.profiles   for select using (true);
create policy "profiles update own"    on public.profiles   for update
  using (auth.uid() = id) with check (auth.uid() = id);

create policy "likes read own"         on public.post_likes for select using (auth.uid() = user_id);
create policy "likes insert own"       on public.post_likes for insert with check (auth.uid() = user_id);
create policy "likes delete own"       on public.post_likes for delete using (auth.uid() = user_id);

create policy "saves read own"         on public.post_saves for select using (auth.uid() = user_id);
create policy "saves insert own"       on public.post_saves for insert with check (auth.uid() = user_id);
create policy "saves delete own"       on public.post_saves for delete using (auth.uid() = user_id);

create policy "comments readable"      on public.comments   for select using (true);
create policy "comments insert own"    on public.comments   for insert with check (auth.uid() = user_id);
create policy "comments update own"    on public.comments   for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "comments delete own"    on public.comments   for delete using (auth.uid() = user_id);
-- post_views / post_shares / site_visits: no policies on purpose (functions only)

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.comments to anon, authenticated;
grant update (display_name, bio) on public.profiles to authenticated;
grant select, insert, delete on public.post_likes, public.post_saves to authenticated;
grant insert, update, delete on public.comments to authenticated;

-- ---------- public functions (the only way counters are read / written) ------
create or replace function public.post_stats(p_slugs text[])
returns table (post_slug text, views bigint, likes bigint, saves bigint, comments bigint, shares bigint)
language sql stable security definer set search_path = public as $$
  select s.slug,
    (select count(*) from post_views  v where v.post_slug = s.slug),
    (select count(*) from post_likes  l where l.post_slug = s.slug),
    (select count(*) from post_saves  a where a.post_slug = s.slug),
    (select count(*) from comments    c where c.post_slug = s.slug),
    (select count(*) from post_shares h where h.post_slug = s.slug)
  from unnest(p_slugs) as s(slug);
$$;

-- one view per visitor per post per day
create or replace function public.record_view(p_slug text, p_visitor text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_slug is null or char_length(p_slug) > 200
     or p_visitor is null or char_length(p_visitor) not between 8 and 64 then return; end if;
  insert into post_views (post_slug, visitor_id) values (p_slug, p_visitor)
  on conflict do nothing;
end $$;

create or replace function public.record_share(p_slug text, p_channel text default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  if p_slug is null or char_length(p_slug) > 200 then return; end if;
  insert into post_shares (post_slug, user_id, channel)
  values (p_slug, auth.uid(), left(p_channel, 30));
end $$;

-- visitor counter: pass a visitor id to record today's visit, or null to just read
create or replace function public.site_stats(p_visitor text default null)
returns json language plpgsql security definer set search_path = public as $$
begin
  if p_visitor is not null and char_length(p_visitor) between 8 and 64 then
    insert into site_visits (visitor_id) values (p_visitor) on conflict do nothing;
  end if;
  return json_build_object(
    'total', (select count(distinct visitor_id) from site_visits),
    'today', (select count(*) from site_visits where day = current_date)
  );
end $$;

revoke all on function public.post_stats(text[]), public.record_view(text, text),
  public.record_share(text, text), public.site_stats(text) from public;
grant execute on function public.post_stats(text[]), public.record_view(text, text),
  public.record_share(text, text), public.site_stats(text) to anon, authenticated;
