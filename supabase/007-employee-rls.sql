-- Restrict employees to their own time entries for insert/update
-- They can read all (for admin), but can only insert their own

drop policy if exists "Authenticated can insert time entries" on time_entries;

create policy "Employees can insert own time entries" on time_entries
  for insert with check (
    employee_id = (
      select e.id from employees e where e.auth_user_id = auth.uid()
    )
    or auth.uid() in (select e.auth_user_id from employees e where e.is_owner = true)
  );
