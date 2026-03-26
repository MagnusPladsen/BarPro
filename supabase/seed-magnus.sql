-- Create test employee: Magnus
-- Run in Supabase SQL Editor

-- First create auth user (use Supabase Dashboard > Authentication > Users > Add user)
-- Email: magnus_pladsen@hotmail.com
-- Password: Test123

-- Then insert employee record (run after creating auth user)
insert into employees (name, email, phone, role, hourly_rate, is_active, is_owner)
values ('Magnus', 'magnus_pladsen@hotmail.com', '99999999', 'Bartender', 275, true, false);

-- To link auth user after creation, run:
-- update employees set auth_user_id = (select id from auth.users where email = 'magnus_pladsen@hotmail.com') where email = 'magnus_pladsen@hotmail.com';
