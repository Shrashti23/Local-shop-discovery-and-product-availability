-- NearShop Karnataka: starter directory of real businesses from public listings.
-- Run AFTER schema.sql. This file is safe to re-run (stable IDs + ON CONFLICT).
-- IMPORTANT:
-- 1) These are directory records, not owner-claimed/owner-verified accounts.
-- 2) Product rows below are catalogue entries only. No shop-specific stock or prices
--    are inserted because public sources did not verify branch-level price/quantity.
-- 3) Ask each shop to claim its listing and confirm details before treating them as verified.

insert into public.shops
(id, owner_id, shop_name, category_focus, address, city, district, pincode, phone,
 opening_hours, latitude, longitude, verification_status, verification_notes, verified_at)
values
('a1000000-0000-4000-8000-000000000001', null, 'Apple Mart Hypermarket - Attavar', 'Supermarket & Grocery',
 'Ivory Enclave, SL Mathias Road, Attavar', 'Mangaluru', 'Dakshina Kannada', '575001', '8244269665',
 'Contact store for current hours', null, null, 'approved',
 'Directory listing sourced from applemart.in. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000002', null, 'Vishal Mega Mart - Surathkal', 'Shopping, Fashion & Grocery',
 'MRPL Road, near Chokka Bettu Cross, Surathkal', 'Mangaluru', 'Dakshina Kannada', '575014', '9620473539',
 '10:00 AM - 10:00 PM', null, null, 'approved',
 'Directory listing sourced from stores.vishalmegamart.com. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000003', null, 'Vishal Mega Mart - Nellikai Road', 'Shopping, Fashion & Grocery',
 'Nellikai Road, near State Bank Chowk', 'Mangaluru', 'Dakshina Kannada', '575001', '8851915520',
 '10:00 AM - 10:00 PM', null, null, 'approved',
 'Directory listing sourced from stores.vishalmegamart.com. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000004', null, 'Reliance SMART Bazaar - Bondel', 'Supermarket & Grocery',
 'Colaco Hospital Trust Building, near St. Lawrence Church, Bondel', 'Mangaluru', 'Dakshina Kannada', '575008', '6360032334',
 'Contact store for current hours', null, null, 'approved',
 'Directory listing sourced from stores.reliancesmartbazaar.com. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000005', null, 'MK Retail Supermarket', 'Supermarket & Grocery',
 '734, Chinmaya Mission Hospital Road, Indiranagar 1st Stage', 'Bengaluru', 'Bengaluru Urban', '560038', '8041694848',
 '8:30 AM - 9:30 PM', null, null, 'approved',
 'Public business directory listing. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000006', null, 'Shree Kandhan Stores', 'Indian Grocery & Provisions',
 '48, Dwaraka Plaza, Kempegowda Road, Ramamurthy Nagar', 'Bengaluru', 'Bengaluru Urban', '560016', '8025656669',
 '9:00 AM - 8:00 PM', null, null, 'approved',
 'Public business directory listing. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000007', null, 'S M Fresh Mart', 'Grocery & Supermarket',
 '809, Kodigehalli Main Road, near Vivekanand School', 'Bengaluru', 'Bengaluru Urban', '560092', '9538214846',
 '7:30 AM - 10:00 PM', null, null, 'approved',
 'Public business directory listing. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000008', null, 'New Mangalore Stores', 'Indian Grocery & General Store',
 'No. 52/2, Babusapalya, Bank Avenue Colony, Kalyan Nagar', 'Bengaluru', 'Bengaluru Urban', '560113', '9945061037',
 '9:30 AM - 9:30 PM', null, null, 'approved',
 'Public business directory listing. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000009', null, 'Grocer''s Supermarket - Thokottu', 'Supermarket & Grocery',
 'Ishrath Complex, Edapally - Panvel Highway, Thokottu', 'Mangaluru', 'Dakshina Kannada', '575017', '9606691923',
 '8:45 AM - 9:30 PM', null, null, 'approved',
 'Public business directory listing. Public listing only; branch details and product stock/prices require confirmation by the shop.', now()),
('a1000000-0000-4000-8000-000000000010', null, 'Kalmargi Stores', 'Indian Grocery & General Store',
 'Shiriyara', 'Udupi', 'Udupi', '576210', '9980933973',
 '8:00 AM - 7:00 PM', null, null, 'approved',
 'Public business directory listing. Public listing only; branch details and product stock/prices require confirmation by the shop.', now())
on conflict (id) do update set
  shop_name = excluded.shop_name,
  category_focus = excluded.category_focus,
  address = excluded.address,
  city = excluded.city,
  district = excluded.district,
  pincode = excluded.pincode,
  phone = excluded.phone,
  opening_hours = excluded.opening_hours,
  verification_status = excluded.verification_status,
  verification_notes = excluded.verification_notes,
  verified_at = excluded.verified_at;

-- Shared catalogue products. These are product catalogue records, NOT claims
-- that every listed shop stocks them. Add shop_inventory only after shop confirmation.
insert into public.products (name, brand, variant, category_id, description)
values
('Sona Masoori Rice', 'Generic', '5 kg', (select id from public.categories where name='Grocery & Staples'), 'Catalogue item. Confirm brand, pack size, price and availability with the shop.'),
('Basmati Rice', 'India Gate', '1 kg', (select id from public.categories where name='Grocery & Staples'), 'Catalogue item. Confirm variant, price and availability with the shop.'),
('Toor Dal', 'Tata Sampann', '1 kg', (select id from public.categories where name='Grocery & Staples'), 'Catalogue item. Confirm pack, price and availability with the shop.'),
('Sunflower Oil', 'Fortune', '1 L', (select id from public.categories where name='Grocery & Staples'), 'Catalogue item. Confirm pack, price and availability with the shop.'),
('Toned Milk', 'Nandini', '500 ml', (select id from public.categories where name='Grocery & Staples'), 'Catalogue item. Confirm pack, price and availability with the shop.'),
('Sugar', 'Generic', '1 kg', (select id from public.categories where name='Grocery & Staples'), 'Catalogue item. Confirm price and availability with the shop.'),
('LED Bulb', 'Philips', '9 W', (select id from public.categories where name='Hardware & Agri'), 'Catalogue item. Confirm exact model, price and availability with the shop.'),
('Notebook', 'Classmate', '200 pages', (select id from public.categories where name='Stationery & Books'), 'Catalogue item. Confirm ruling, price and availability with the shop.'),
('Gel Pen', 'Reynolds', 'Pack of 10', (select id from public.categories where name='Stationery & Books'), 'Catalogue item. Confirm pack, price and availability with the shop.'),
('Wireless Earbuds', 'boAt', 'Airdopes series', (select id from public.categories where name='Electronics & Mobile'), 'Catalogue item. Confirm exact model, price and availability with the shop.'),
('USB-C Cable', 'Ambrane', '1 m', (select id from public.categories where name='Electronics & Mobile'), 'Catalogue item. Confirm connector specification, price and availability with the shop.')
on conflict do nothing;
