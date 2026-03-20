-- Time entries — standalone hour registration
-- Employees can log hours with or without a booking

create table time_entries (
  id uuid default uuid_generate_v4() primary key,
  employee_id uuid not null references employees(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  date date not null,
  hours numeric(5,2) not null,
  start_time time,
  end_time time,
  description text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_by uuid references employees(id),
  approved_at timestamptz,
  created_at timestamptz default now() not null
);

create index idx_time_entries_employee on time_entries(employee_id);
create index idx_time_entries_date on time_entries(date);
create index idx_time_entries_status on time_entries(status);
create index idx_time_entries_booking on time_entries(booking_id);

alter table time_entries enable row level security;

-- Authenticated users can read all (admins see all, employees see own via app logic)
create policy "Authenticated can read time entries" on time_entries
  for select using (auth.role() = 'authenticated');

-- Authenticated can insert (employees log own hours via app)
create policy "Authenticated can insert time entries" on time_entries
  for insert with check (auth.role() = 'authenticated');

-- Authenticated can update (admins approve)
create policy "Authenticated can update time entries" on time_entries
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
