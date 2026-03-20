-- Fix: employees should not expose email/phone/is_owner to public
drop policy if exists "Public can see basic employee info" on employees;
drop policy if exists "Public can see active employees" on employees;
drop policy if exists "Admins can manage employees" on employees;

-- Only authenticated users can read employees (no public access)
create policy "Authenticated can read employees" on employees
  for select using (auth.role() = 'authenticated');

create policy "Admins manage employees" on employees
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Public-safe view for the about page (no email/phone)
create or replace view public_employees as
  select name, role, photo_url
  from employees
  where is_active = true;


-- Fix: offers should NOT expose customer_token to public
drop policy if exists "Public can view offers by id" on offers;
drop policy if exists "Admins can manage offers" on offers;

-- Only admins can read offers (public access goes through API with token validation)
create policy "Admins manage offers" on offers
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
