-- Employee blocked dates (days they are not available)
create table employee_blocked_dates (
  id uuid default uuid_generate_v4() primary key,
  employee_id uuid not null references employees(id) on delete cascade,
  date date not null,
  reason text,
  created_at timestamptz default now() not null,
  unique(employee_id, date)
);

create index idx_emp_blocked_employee on employee_blocked_dates(employee_id);
create index idx_emp_blocked_date on employee_blocked_dates(date);

alter table employee_blocked_dates enable row level security;

create policy "Authenticated can read employee blocked dates" on employee_blocked_dates
  for select using (auth.role() = 'authenticated');

create policy "Authenticated can manage own blocked dates" on employee_blocked_dates
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
