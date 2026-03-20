-- Phase 2: Employees, Assignments, Offers, Chat, Costs
-- Run in Supabase SQL Editor

-- Offer/Agreement status
create type offer_status as enum ('draft', 'sent', 'accepted', 'declined', 'expired');
create type agreement_status as enum ('active', 'completed', 'cancelled');

-- Employees
create table employees (
  id uuid default uuid_generate_v4() primary key,
  auth_user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null unique,
  phone text,
  role text not null default 'Bartender',
  photo_url text,
  hourly_rate numeric(10,2) not null default 0,
  is_owner boolean default false not null,
  is_active boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_employees_active on employees(is_active);
create index idx_employees_email on employees(email);

-- Add time fields to bookings
alter table bookings add column if not exists start_time time;
alter table bookings add column if not exists end_time time;
alter table bookings add column if not exists estimated_hours numeric(5,2);

-- Booking staff assignments
create table booking_assignments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid not null references bookings(id) on delete cascade,
  employee_id uuid not null references employees(id) on delete cascade,
  hours_worked numeric(5,2),
  extra_pay numeric(10,2) default 0,
  approved boolean default false not null,
  notes text,
  created_at timestamptz default now() not null,
  unique(booking_id, employee_id)
);

create index idx_assignments_booking on booking_assignments(booking_id);
create index idx_assignments_employee on booking_assignments(employee_id);

-- Booking costs (internal cost tracking)
create table booking_costs (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid not null references bookings(id) on delete cascade,
  description text not null,
  amount numeric(10,2) not null,
  is_billable boolean default false not null,
  created_at timestamptz default now() not null
);

create index idx_costs_booking on booking_costs(booking_id);

-- Offers (tilbud)
create table offers (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid not null references bookings(id) on delete cascade,
  estimated_cost numeric(10,2) not null,
  offered_price numeric(10,2) not null,
  markup_percent numeric(5,2),
  status offer_status default 'draft' not null,
  notes text,
  sent_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_offers_booking on offers(booking_id);
create index idx_offers_status on offers(status);

-- Agreements (avtaler — binding after offer accepted)
create table agreements (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid not null references bookings(id) on delete cascade,
  offer_id uuid references offers(id) on delete set null,
  final_price numeric(10,2) not null,
  status agreement_status default 'active' not null,
  notes text,
  signed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_agreements_booking on agreements(booking_id);

-- Chat messages (for booking conversations)
create table chat_messages (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid not null references bookings(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer', 'admin')),
  sender_name text not null,
  message text not null,
  message_type text not null default 'text' check (message_type in ('text', 'offer', 'agreement', 'system')),
  reference_id uuid,
  created_at timestamptz default now() not null
);

create index idx_chat_booking on chat_messages(booking_id);
create index idx_chat_created on chat_messages(created_at);

-- Triggers
create trigger employees_updated_at
  before update on employees
  for each row execute function update_updated_at();

create trigger offers_updated_at
  before update on offers
  for each row execute function update_updated_at();

create trigger agreements_updated_at
  before update on agreements
  for each row execute function update_updated_at();

-- RLS
alter table employees enable row level security;
alter table booking_assignments enable row level security;
alter table booking_costs enable row level security;
alter table offers enable row level security;
alter table agreements enable row level security;
alter table chat_messages enable row level security;

-- Employees: public can see active employees (for about page etc), admins can manage
create policy "Public can see active employees" on employees
  for select using (is_active = true or auth.role() = 'authenticated');

create policy "Admins can manage employees" on employees
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Assignments: only admins
create policy "Admins can manage assignments" on booking_assignments
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Costs: only admins
create policy "Admins can manage costs" on booking_costs
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Offers: admins can manage, public can view their own (by booking)
create policy "Admins can manage offers" on offers
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Agreements: same as offers
create policy "Admins can manage agreements" on agreements
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Chat: admins can manage, public can insert (customer messages)
create policy "Anyone can view chat for their booking" on chat_messages
  for select using (true);

create policy "Anyone can send chat messages" on chat_messages
  for insert with check (true);

create policy "Admins can manage chat" on chat_messages
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
