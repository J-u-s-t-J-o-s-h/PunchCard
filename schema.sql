-- Enable PostGIS for location features (optional, but good for distance)
-- generic extensions
create extension if not exists "uuid-ossp";

-- ROLES
create type user_role as enum ('employee', 'admin');

-- PROFILES (Public information about users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  role user_role default 'employee',
  team_id uuid, -- foreign key added later after teams table
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TEAMS
create table public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamptz default now()
);

-- JOB SITES (Geofencing)
create table public.job_sites (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  latitude double precision not null,
  longitude double precision not null,
  radius_meters int default 100,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- TIME ENTRIES
create table public.time_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  site_id uuid references public.job_sites(id),
  clock_in timestamptz default now(),
  clock_out timestamptz,
  clock_in_lat double precision,
  clock_in_lng double precision,
  clock_out_lat double precision,
  clock_out_lng double precision,
  location_verified boolean default false,
  notes text
);

-- RELATIONS
alter table public.profiles add constraint fk_team foreign key (team_id) references public.teams(id);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.job_sites enable row level security;
alter table public.time_entries enable row level security;

-- Profiles: Public read, User update own
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Job Sites: Read by all (employees need to see where to clock in), Admin write
create policy "Job sites viewable by everyone"
  on job_sites for select
  using ( true );

create policy "Admins can insert/update job sites"
  on job_sites for all
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- Time Entries:
-- Employee: select own, insert own, update own (clock out)
-- Admin: select all, update/delete all

create policy "Users can view own time entries"
  on time_entries for select
  using ( auth.uid() = user_id );

create policy "Admins can view all time entries"
  on time_entries for select
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

create policy "Users can insert own time entry"
  on time_entries for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own time entry (clock out)"
  on time_entries for update
  using ( auth.uid() = user_id );

create policy "Admins can manage all time entries"
  on time_entries for all
  using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );

-- HELPER FUNCTIONS for distance (if PostGIS not available)
create or replace function calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float)
returns float as $$
declare
    R float := 6371000; -- Earth radius in meters
    dLat float;
    dLon float;
    a float;
    c float;
begin
    dLat := radians(lat2 - lat1);
    dLon := radians(lon2 - lon1);
    a := sin(dLat/2) * sin(dLat/2) +
         cos(radians(lat1)) * cos(radians(lat2)) *
         sin(dLon/2) * sin(dLon/2);
    c := 2 * atan2(sqrt(a), sqrt(1-a));
    return R * c;
end;
$$ language plpgsql immutable;

-- TRIGGER for auto-creating profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'employee');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
