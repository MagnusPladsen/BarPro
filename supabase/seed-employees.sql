-- Seed: Employees
-- Run after 002-employees-and-workflow.sql

-- Owners (active)
insert into employees (name, email, phone, role, photo_url, hourly_rate, is_owner, is_active) values
  ('Emil', 'barproda@gmail.com', '90225293', 'Gründer & Bartender', '/images/barpro-emil.jpg', 350, true, true),
  ('Sofie', 'sofie@barpro.no', '47604766', 'Gründer & Bartender', '/images/barpro-sofie.jpg', 350, true, true);

-- Active employees
insert into employees (name, email, phone, role, hourly_rate, is_active) values
  ('Jonas Eriksen', 'jonas.eriksen@gmail.com', '92345678', 'Bartender', 275, true),
  ('Ida Kristoffersen', 'ida.k@outlook.com', '41234567', 'Bartender', 275, true),
  ('Magnus Hagen', 'magnus.h@gmail.com', '99876543', 'Servicepersonell', 250, true);

-- Inactive employees
insert into employees (name, email, phone, role, hourly_rate, is_active) values
  ('Nora Bjerke', 'nora.b@hotmail.com', '48765432', 'Bartender', 275, false),
  ('Lars Ødegård', 'lars.o@gmail.com', '91122334', 'Servicepersonell', 250, false);

-- Assign staff to some confirmed bookings
-- (get booking IDs dynamically)
do $$
declare
  b_kristin uuid;
  b_energi uuid;
  b_hamar uuid;
  b_kari uuid;
  e_emil uuid;
  e_sofie uuid;
  e_jonas uuid;
  e_ida uuid;
  e_magnus uuid;
begin
  select id into e_emil from employees where email = 'barproda@gmail.com';
  select id into e_sofie from employees where email = 'sofie@barpro.no';
  select id into e_jonas from employees where email = 'jonas.eriksen@gmail.com';
  select id into e_ida from employees where email = 'ida.k@outlook.com';
  select id into e_magnus from employees where email = 'magnus.h@gmail.com';

  select id into b_kristin from bookings where customer_name = 'Kristin Haugen' limit 1;
  select id into b_energi from bookings where customer_name = 'Innlandet Energi AS' limit 1;
  select id into b_hamar from bookings where customer_name = 'Hamar Kommune' limit 1;
  select id into b_kari from bookings where customer_name = 'Kari Johansen' limit 1;

  -- Kristin's wedding: Emil + Sofie
  if b_kristin is not null then
    update bookings set start_time = '16:00', end_time = '23:00', estimated_hours = 7 where id = b_kristin;
    insert into booking_assignments (booking_id, employee_id, hours_worked, approved) values
      (b_kristin, e_emil, 7, true),
      (b_kristin, e_sofie, 7, true);
  end if;

  -- Innlandet Energi: Emil + Jonas + Ida + Magnus
  if b_energi is not null then
    update bookings set start_time = '18:00', end_time = '01:00', estimated_hours = 7 where id = b_energi;
    insert into booking_assignments (booking_id, employee_id) values
      (b_energi, e_emil),
      (b_energi, e_jonas),
      (b_energi, e_ida),
      (b_energi, e_magnus);
  end if;

  -- Hamar Kommune: Emil + Ida
  if b_hamar is not null then
    update bookings set start_time = '17:00', end_time = '22:00', estimated_hours = 5 where id = b_hamar;
    insert into booking_assignments (booking_id, employee_id) values
      (b_hamar, e_emil),
      (b_hamar, e_ida);
  end if;

  -- Kari's birthday: Emil
  if b_kari is not null then
    update bookings set start_time = '19:00', end_time = '23:00', estimated_hours = 4 where id = b_kari;
    insert into booking_assignments (booking_id, employee_id) values
      (b_kari, e_emil);
  end if;

  -- Add some costs to the Energi booking
  if b_energi is not null then
    insert into booking_costs (booking_id, description, amount, is_billable) values
      (b_energi, 'Transport av utstyr', 1500, true),
      (b_energi, 'Ekstra ismaskin leie', 800, true),
      (b_energi, 'Parkeringskort', 200, false);
  end if;

  -- Create an offer for Kristin's wedding
  if b_kristin is not null then
    insert into offers (booking_id, estimated_cost, offered_price, markup_percent, status, sent_at, responded_at, notes) values
      (b_kristin, 5600, 7500, 20, 'accepted', now() - interval '5 days', now() - interval '3 days', 'Premium bryllupspakke med 2 bartendere, 7 timer');

    insert into agreements (booking_id, final_price, status, signed_at, notes)
    values (b_kristin, 7500, 'active', now() - interval '2 days', 'Signert via e-post. Inkluderer 2 signaturdrinker og alkoholfri meny.');
  end if;

  -- Chat messages for a booking
  if b_kristin is not null then
    insert into chat_messages (booking_id, sender_type, sender_name, message, message_type, created_at) values
      (b_kristin, 'customer', 'Kristin Haugen', 'Hei! Vi planlegger bryllup 28. mars på Honne Hotell og ønsker Premium-pakken med 2 bartendere. Kan dere sende et tilbud?', 'text', now() - interval '7 days'),
      (b_kristin, 'admin', 'Emil', 'Hei Kristin! Så hyggelig å høre fra dere. Absolutt, vi er ledige den datoen. Sender over et tilbud med detaljer.', 'text', now() - interval '6 days'),
      (b_kristin, 'admin', 'Emil', 'Tilbud sendt: Premium bryllupspakke — 7 500 kr', 'offer', now() - interval '5 days'),
      (b_kristin, 'customer', 'Kristin Haugen', 'Tusen takk! Tilbudet ser bra ut. Vi aksepterer!', 'text', now() - interval '3 days'),
      (b_kristin, 'admin', 'Emil', 'Avtale opprettet. Vi gleder oss til bryllupet deres!', 'agreement', now() - interval '2 days');
  end if;

end $$;
