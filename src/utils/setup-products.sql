-- Create products table for seller-specific listings
create table if not exists products (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references auth.users not null,
  name text not null,
  description text,
  category text not null,
  base_price decimal(10,2) not null,
  image_url text,
  stock_quantity integer not null default 0,
  is_listed boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on seller_id for faster queries
create index if not exists idx_products_seller_id on products(seller_id);