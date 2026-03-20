-- Add offer_sent status to bookings
alter type booking_status add value if not exists 'offer_sent';

-- Add rejection fields to offers
alter table offers add column if not exists rejection_reason text;
alter table offers add column if not exists wants_new_offer boolean default false;

-- Allow public to view offers by ID (for offer page)
create policy "Public can view offers by id" on offers
  for select using (true);
