-- Create all_products table
create table if not exists all_products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text not null,
  base_price decimal(10,2) not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert sample data
insert into all_products (name, description, category, base_price, image_url) values
('Organic Tomatoes', 'Fresh, locally grown organic tomatoes', 'Vegetables', 40.00, 'https://example.com/tomatoes.jpg'),
('Premium Rice', 'High-quality basmati rice', 'Grains', 120.00, 'https://example.com/rice.jpg'),
('Fresh Apples', 'Crisp and sweet apples from local orchards', 'Fruits', 80.00, 'https://example.com/apples.jpg'),
('Organic Wheat Flour', 'Stone-ground organic wheat flour', 'Grains', 45.00, 'https://example.com/flour.jpg'),
('Fresh Carrots', 'Organic carrots, perfect for cooking and juicing', 'Vegetables', 35.00, 'https://example.com/carrots.jpg');