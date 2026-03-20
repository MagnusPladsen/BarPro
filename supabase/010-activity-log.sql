-- Activity log for tracking admin actions
create table activity_log (
  id uuid default uuid_generate_v4() primary key,
  user_email text not null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  details text,
  created_at timestamptz default now() not null
);

create index idx_activity_log_created on activity_log(created_at desc);
create index idx_activity_log_entity on activity_log(entity_type, entity_id);

alter table activity_log enable row level security;

create policy "Admins can read activity log" on activity_log
  for select using (auth.role() = 'authenticated');

create policy "Admins can write activity log" on activity_log
  for insert with check (auth.role() = 'authenticated');
