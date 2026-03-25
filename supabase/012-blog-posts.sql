-- Blog posts table
create table blog_posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  author_id uuid references employees(id),
  published_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_blog_posts_slug on blog_posts(slug);
create index idx_blog_posts_status on blog_posts(status);
create index idx_blog_posts_published on blog_posts(published_at desc);

create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_updated_at();

alter table blog_posts enable row level security;

-- Public can read published posts
create policy "Public can read published posts" on blog_posts
  for select using (status = 'published' or auth.role() = 'authenticated');

-- Admins can manage all posts
create policy "Admins can manage posts" on blog_posts
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
