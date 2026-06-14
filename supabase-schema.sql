-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text not null,
  plan text default 'free',
  plan_status text default 'active',
  plan_started_at timestamp with time zone,
  plan_expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
create policy "Users can read own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users can update own profile" on public.profiles for update using ( auth.uid() = id );

create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Chats Table
create table public.chats (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  title text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.chats enable row level security;
create policy "Users can manage own chats" on public.chats for all using ( auth.uid() = user_id );


-- 3. Messages Table
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  chat_id uuid references public.chats on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now()
);

alter table public.messages enable row level security;
create policy "Users can manage own messages" on public.messages for all using ( auth.uid() = user_id );


-- 4. Generated Websites Table
create table public.generated_websites (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  chat_id uuid references public.chats on delete set null,
  title text not null,
  website_type text,
  prompt text,
  generated_files jsonb not null default '[]'::jsonb,
  deployment_steps text,
  suggestions text,
  created_at timestamp with time zone default now()
);

alter table public.generated_websites enable row level security;
create policy "Users can manage own generated websites" on public.generated_websites for all using ( auth.uid() = user_id );


-- 5. Usage Limits Table
create table public.usage_limits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null unique,
  weekly_generation_count integer default 0,
  last_generation_at timestamp with time zone,
  next_free_generation_at timestamp with time zone,
  total_generations integer default 0,
  updated_at timestamp with time zone default now()
);

alter table public.usage_limits enable row level security;
create policy "Users can read own usage limits" on public.usage_limits for select using ( auth.uid() = user_id );

create or replace function public.handle_new_user_limit()
returns trigger as $$
begin
  insert into public.usage_limits (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created_limit
  after insert on auth.users
  for each row execute procedure public.handle_new_user_limit();


-- 6. Payments Table
create table public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  plan text not null,
  amount integer not null,
  currency text default 'INR',
  status text default 'pending' check (status in ('pending', 'success', 'failed', 'cancelled')),
  payment_provider text default 'razorpay',
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.payments enable row level security;
create policy "Users can read own payments" on public.payments for select using ( auth.uid() = user_id );
