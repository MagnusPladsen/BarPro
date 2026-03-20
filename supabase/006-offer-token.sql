-- Add customer token to offers for secure access
alter table offers add column if not exists customer_token text default encode(gen_random_bytes(32), 'hex');

-- Backfill existing offers
update offers set customer_token = encode(gen_random_bytes(32), 'hex') where customer_token is null;
