// Supabase Schema and Sample Data

// all_products table schema
/*
create table all_products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  category text not null,
  base_price decimal(10,2) not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
*/

// Sample data for all_products table
export const allProductsSampleData = [
  {
    name: 'Organic Tomatoes',
    description: 'Fresh, locally grown organic tomatoes',
    category: 'Vegetables',
    base_price: 40.00,
    image_url: 'https://example.com/tomatoes.jpg'
  },
  {
    name: 'Premium Rice',
    description: 'High-quality basmati rice',
    category: 'Grains',
    base_price: 120.00,
    image_url: 'https://example.com/rice.jpg'
  },
  {
    name: 'Fresh Apples',
    description: 'Crisp and sweet apples from local orchards',
    category: 'Fruits',
    base_price: 80.00,
    image_url: 'https://example.com/apples.jpg'
  },
  {
    name: 'Organic Wheat Flour',
    description: 'Stone-ground organic wheat flour',
    category: 'Grains',
    base_price: 45.00,
    image_url: 'https://example.com/flour.jpg'
  },
  {
    name: 'Fresh Carrots',
    description: 'Organic carrots, perfect for cooking and juicing',
    category: 'Vegetables',
    base_price: 35.00,
    image_url: 'https://example.com/carrots.jpg'
  }
];