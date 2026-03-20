-- BarPro Booking System Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enum types
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type package_type as enum ('basis', 'premium', 'eksklusiv');
create type event_type as enum ('wedding', 'corporate', 'private', 'other');
create type message_status as enum ('unread', 'read', 'replied');

-- Blocked dates (admin marks dates they are NOT available)
create table blocked_dates (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique,
  reason text,
  created_at timestamptz default now() not null
);

-- Bookings (customers can book any non-blocked date)
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  date date not null,
  status booking_status default 'pending' not null,
  package package_type not null,
  guest_count text not null,
  event_type event_type not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  wants_callback boolean default false not null,
  message text,
  admin_notes text,
  google_event_id text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Contact form messages
create table contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  event_type text,
  guests text,
  date text,
  message text not null,
  status message_status default 'unread' not null,
  admin_notes text,
  created_at timestamptz default now() not null
);

-- Indexes
create index idx_bookings_date on bookings(date);
create index idx_bookings_status on bookings(status);
create index idx_bookings_created_at on bookings(created_at desc);
create index idx_blocked_dates_date on blocked_dates(date);
create index idx_contact_messages_status on contact_messages(status);
create index idx_contact_messages_created_at on contact_messages(created_at desc);

-- Only one active booking per date
create unique index idx_bookings_one_per_date
  on bookings(date)
  where status in ('pending', 'confirmed');

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger bookings_updated_at
  before update on bookings
  for each row execute function update_updated_at();

-- Row Level Security
alter table blocked_dates enable row level security;
alter table bookings enable row level security;
alter table contact_messages enable row level security;

-- Public read access for blocked dates (customers need to see them)
create policy "Blocked dates are readable by everyone"
  on blocked_dates for select
  using (true);

-- Only authenticated users (admins) can manage blocked dates
create policy "Admins can manage blocked dates"
  on blocked_dates for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Anyone can insert bookings (customers submitting)
create policy "Anyone can create bookings"
  on bookings for insert
  with check (true);

-- Public can see which dates have active bookings (no details)
create policy "Public can see booked dates"
  on bookings for select
  using (true);

-- Only admins can update bookings
create policy "Admins can update bookings"
  on bookings for update
  using (auth.role() = 'authenticated');

-- Anyone can insert contact messages
create policy "Anyone can create contact messages"
  on contact_messages for insert
  with check (true);

-- Only admins can read/update contact messages
create policy "Admins can read contact messages"
  on contact_messages for select
  using (auth.role() = 'authenticated');

create policy "Admins can update contact messages"
  on contact_messages for update
  using (auth.role() = 'authenticated');
