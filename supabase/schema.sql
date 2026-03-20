-- BarPro Booking System Schema
-- Run this in the Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enum types
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type package_type as enum ('basis', 'premium', 'eksklusiv');
create type event_type as enum ('wedding', 'corporate', 'private', 'other');
create type message_status as enum ('unread', 'read', 'replied');

-- Available dates (admin manages which dates are bookable)
create table available_dates (
  id uuid default uuid_generate_v4() primary key,
  date date not null unique,
  note text,
  created_at timestamptz default now() not null
);

-- Bookings
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  date date not null references available_dates(date) on delete restrict,
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
create index idx_available_dates_date on available_dates(date);
create index idx_contact_messages_status on contact_messages(status);
create index idx_contact_messages_created_at on contact_messages(created_at desc);

-- Only one booking per date
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
alter table available_dates enable row level security;
alter table bookings enable row level security;
alter table contact_messages enable row level security;

-- Public read access for available dates (customers need to see them)
create policy "Available dates are readable by everyone"
  on available_dates for select
  using (true);

-- Only authenticated users (admins) can manage available dates
create policy "Admins can manage available dates"
  on available_dates for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Anyone can insert bookings (customers submitting)
create policy "Anyone can create bookings"
  on bookings for insert
  with check (true);

-- Public can read their own booking by ID (for confirmation page)
create policy "Bookings readable by admins"
  on bookings for select
  using (auth.role() = 'authenticated');

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
