-- Create a table for teachers
-- This table is linked to the auth.users table via the 'id' (Primary Key)
create table public.teachers (
  id uuid references auth.users not null primary key,
  name text not null,
  bio text,
  location text,
  hourly_rate numeric,
  styles text[], -- Array of strings for dance styles
  image_url text, -- URL to the profile image
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.teachers enable row level security;

-- Policy: Anyone can read teacher profiles
create policy "Public profiles are viewable by everyone."
  on public.teachers for select
  using ( true );

-- Policy: Users can insert their own profile
create policy "Users can create their own profile."
  on public.teachers for insert
  with check ( auth.uid() = id );

-- Policy: Users can update their own profile
create policy "Users can update their own profile."
  on public.teachers for update
  using ( auth.uid() = id );
