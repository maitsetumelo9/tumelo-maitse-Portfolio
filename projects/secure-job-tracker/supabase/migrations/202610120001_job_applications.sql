-- JobTrack: one row per application, owned by the authenticated user.
-- Apply this migration in the Supabase SQL editor or through Supabase CLI.
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  company text not null check (char_length(trim(company)) between 1 and 100),
  role text not null check (char_length(trim(role)) between 1 and 120),
  application_date date not null,
  status text not null default 'Saved'
    check (status in ('Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected')),
  follow_up_date date,
  job_url text,
  notes text not null default '' check (char_length(notes) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint job_applications_url_scheme check (
    job_url is null or job_url ~* '^https?://'
  )
);

create index if not exists job_applications_owner_date_idx
  on public.job_applications (user_id, application_date desc);

alter table public.job_applications enable row level security;

drop policy if exists "Users can view their own job applications" on public.job_applications;
create policy "Users can view their own job applications"
  on public.job_applications for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own job applications" on public.job_applications;
create policy "Users can insert their own job applications"
  on public.job_applications for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own job applications" on public.job_applications;
create policy "Users can update their own job applications"
  on public.job_applications for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own job applications" on public.job_applications;
create policy "Users can delete their own job applications"
  on public.job_applications for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.job_applications to authenticated;
revoke all on public.job_applications from anon;

-- Defense in depth: user_id is always set by auth.uid() when omitted.
-- RLS remains the security boundary; frontend filtering is not authorization.
