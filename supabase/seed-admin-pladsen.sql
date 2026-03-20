-- Link admin@pladsen.dev to an employee record as owner
-- Run AFTER creating the user in Supabase Dashboard > Authentication > Users

-- Create employee record (or update if exists)
insert into employees (name, email, role, hourly_rate, is_owner, is_active, auth_user_id)
values (
  'Magnus',
  'admin@pladsen.dev',
  'Admin',
  0,
  true,
  true,
  (select id from auth.users where email = 'admin@pladsen.dev')
)
on conflict (email) do update set
  is_owner = true,
  is_active = true,
  auth_user_id = (select id from auth.users where email = 'admin@pladsen.dev');
