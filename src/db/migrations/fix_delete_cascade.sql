-- Fix Profiles FK to delete profile when auth.user is deleted
alter table public.profiles
  drop constraint if exists profiles_id_fkey,
  add constraint profiles_id_fkey
    foreign key (id)
    references auth.users(id)
    on delete cascade;

-- Fix Time Entries FK to delete entries when profile is deleted
alter table public.time_entries
  drop constraint if exists time_entries_user_id_fkey,
  add constraint time_entries_user_id_fkey
    foreign key (user_id)
    references public.profiles(id)
    on delete cascade;
