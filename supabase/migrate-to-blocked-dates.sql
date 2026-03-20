-- Migration: Switch from available_dates to blocked_dates
-- Run this in Supabase SQL Editor if you already ran the original schema

-- Drop old table and policies
drop policy if exists "Available dates are readable by everyone" on available_dates;
drop policy if exists "Admins can manage available dates" on available_dates;

-- Remove FK constraint from bookings
alter table bookings drop constraint if exists bookings_date_fkey;

-- Drop old table
drop table if exists available_dates;

-- Create blocked_dates table
create table if not exists blocked_dates (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique,
  reason text,
  created_at timestamptz default now() not null
);

create index if not exists idx_blocked_dates_date on blocked_dates(date);

alter table blocked_dates enable row level security;

create policy "Blocked dates are readable by everyone"
  on blocked_dates for select
  using (true);

create policy "Admins can manage blocked dates"
  on blocked_dates for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Update bookings select policy to allow public to see booked dates
drop policy if exists "Bookings readable by admins" on bookings;

create policy "Public can see booked dates"
  on bookings for select
  using (true);
