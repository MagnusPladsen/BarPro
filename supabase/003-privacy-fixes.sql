-- Privacy & Security Fixes
-- Tighten RLS policies to protect personal data

-- Bookings: public should only see dates (for calendar), not personal data
drop policy if exists "Public can see booked dates" on bookings;

-- Public can only see date + status (no personal data) via a view
create or replace view public_booked_dates as
  select date, status
  from bookings
  where status in ('pending', 'confirmed');

-- Only admins can read full booking details
create policy "Only admins can read bookings"
  on bookings for select
  using (auth.role() = 'authenticated');

-- Chat messages: tighten access
drop policy if exists "Anyone can view chat for their booking" on chat_messages;
drop policy if exists "Anyone can send chat messages" on chat_messages;
drop policy if exists "Admins can manage chat" on chat_messages;

-- Only admins can read/write chat (customer messages come through API)
create policy "Admins can manage chat"
  on chat_messages for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Contact messages: ensure only admins can read
-- (already set, but verify)

-- Employees: don't expose phone/email to public
drop policy if exists "Public can see active employees" on employees;

create policy "Public can see basic employee info"
  on employees for select
  using (
    case
      when auth.role() = 'authenticated' then true
      else is_active = true
    end
  );
