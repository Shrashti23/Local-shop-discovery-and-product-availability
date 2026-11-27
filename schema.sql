-- =====================================================================
-- NearShop Karnataka  -  Supabase schema
-- Run this WHOLE file once in: Supabase Dashboard > SQL Editor > New query
-- Safe to re-run (idempotent). Then run seed.sql for demo data.
-- Security model: the browser talks to the database directly, so
-- Row Level Security (RLS) + triggers below ARE the backend. Do not skip them.
-- =====================================================================

-- ---------- Tables ----------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text,
  phone text check (phone is null or phone ~ '^[6-9][0-9]{9}$'),
  role text not null default 'customer' check (role in ('customer','shop_owner','admin')),
  preferred_language text not null default 'en' check (preferred_language in ('en','kn')),
  dpdp_consent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null unique check (char_length(name) between 2 and 80),
  name_kn text,
  icon text not null default '📦'
);

create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  shop_name text not null check (char_length(shop_name) between 2 and 150),
  category_focus text,
  address text not null check (char_length(address) between 5 and 300),
  city text not null check (char_length(city) between 2 and 80),
  district text not null check (char_length(district) between 2 and 80),
  -- Karnataka PIN codes only: 560000-591999
  pincode text not null check (pincode ~ '^(5[6-8][0-9]{4}|59[01][0-9]{3})$'),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  opening_hours text not null default '9:00 AM - 9:00 PM' check (char_length(opening_hours) <= 60),
  latitude numeric(9,6) check (latitude between 11 and 19),
  longitude numeric(9,6) check (longitude between 74 and 79),
  verification_status text not null default 'pending'
    check (verification_status in ('pending','approved','rejected')),
  verification_notes text check (char_length(verification_notes) <= 500),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists shops_one_per_owner on public.shops(owner_id) where owner_id is not null;
create index if not exists shops_city_idx on public.shops(city);
create index if not exists shops_pincode_idx on public.shops(pincode);
create index if not exists shops_status_idx on public.shops(verification_status);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 160),
  brand text check (char_length(brand) <= 80),
  variant text check (char_length(variant) <= 80),
  category_id bigint not null references public.categories(id) on delete restrict,
  description text check (char_length(description) <= 1000),
  image_url text check (image_url is null or image_url ~ '^https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/product-images/'),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
-- Duplicate-product guard (same name + brand + variant, case-insensitive)
create unique index if not exists products_unique_idx on public.products
  (lower(name), lower(coalesce(brand,'')), lower(coalesce(variant,'')));
create index if not exists products_name_idx on public.products(lower(name));
create index if not exists products_cat_idx on public.products(category_id);

create table if not exists public.shop_inventory (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0 and quantity <= 1000000),
  price numeric(10,2) not null check (price > 0 and price <= 10000000),
  availability_status text not null default 'out_of_stock'
    check (availability_status in ('available','low_stock','out_of_stock')),
  last_updated timestamptz not null default now(),
  unique (shop_id, product_id)
);
create index if not exists inv_product_idx on public.shop_inventory(product_id);
create index if not exists inv_shop_idx on public.shop_inventory(shop_id);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  message text not null check (char_length(message) between 3 and 1000),
  customer_phone text not null check (customer_phone ~ '^[6-9][0-9]{9}$'),
  status text not null default 'pending' check (status in ('pending','replied','closed')),
  shop_reply text check (char_length(shop_reply) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists enq_shop_idx on public.enquiries(shop_id, created_at desc);
create index if not exists enq_cust_idx on public.enquiries(customer_id, created_at desc);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  reviewer_name text,
  rating smallint not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 500),
  created_at timestamptz not null default now(),
  unique (customer_id, shop_id)
);
create index if not exists reviews_shop_idx on public.reviews(shop_id);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  shop_id uuid not null references public.shops(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  reason text not null check (reason in ('wrong_stock','wrong_price','fake_shop','wrong_details','other')),
  details text check (char_length(details) <= 1000),
  status text not null default 'open' check (status in ('open','resolved','dismissed')),
  admin_notes text check (char_length(admin_notes) <= 500),
  created_at timestamptz not null default now()
);
create index if not exists reports_status_idx on public.reports(status, created_at desc);

-- ---------- Helper functions (SECURITY DEFINER avoids RLS recursion) --

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.owns_shop(p_shop uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shops where id = p_shop and owner_id = auth.uid());
$$;

create or replace function public.shop_is_approved(p_shop uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shops where id = p_shop and verification_status = 'approved');
$$;

create or replace function public.owns_approved_shop() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shops where owner_id = auth.uid() and verification_status = 'approved');
$$;

create or replace function public.normalize_phone(p text) returns text
language sql immutable as $$
  select case
    when d is null then null
    when length(d) = 12 and left(d,2) = '91' then substr(d,3)
    when length(d) = 11 and left(d,1) = '0' then substr(d,2)
    else d end
  from (select nullif(regexp_replace(coalesce(p,''), '[^0-9]', '', 'g'), '') as d) x;
$$;

-- ---------- Signup trigger: auth.users -> profiles (+ pending shop) ----
-- Role comes from signup metadata but is whitelisted: nobody can self-register
-- as admin. Promote admins manually (see README).

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_role text := case when meta->>'role' = 'shop_owner' then 'shop_owner' else 'customer' end;
  v_name text := nullif(trim(coalesce(meta->>'full_name','')), '');
  s jsonb := meta->'shop';
begin
  insert into public.profiles (id, full_name, email, phone, role, preferred_language)
  values (
    new.id,
    left(coalesce(v_name, nullif(split_part(coalesce(new.email,''), '@', 1), ''), 'User'), 120),
    new.email,
    public.normalize_phone(meta->>'phone'),
    v_role,
    case when meta->>'language' = 'kn' then 'kn' else 'en' end
  );

  if v_role = 'shop_owner' and s is not null and jsonb_typeof(s) = 'object' then
    insert into public.shops (owner_id, shop_name, category_focus, address, city, district,
                              pincode, phone, opening_hours)
    values (
      new.id,
      trim(s->>'shop_name'),
      nullif(trim(coalesce(s->>'category_focus','')), ''),
      trim(s->>'address'),
      trim(s->>'city'),
      trim(s->>'district'),
      trim(s->>'pincode'),
      public.normalize_phone(s->>'phone'),
      coalesce(nullif(trim(coalesce(s->>'opening_hours','')), ''), '9:00 AM - 9:00 PM')
    );
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Integrity triggers ----------------------------------------
-- auth.uid() IS NULL means "SQL editor / service role": trusted, not restricted.

create or replace function public.trg_profiles_protect() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.id := old.id;
    new.role := old.role;          -- no self-promotion, ever
    new.email := old.email;
    new.created_at := old.created_at;
  end if;
  new.phone := public.normalize_phone(new.phone);
  return new;
end $$;
drop trigger if exists profiles_protect on public.profiles;
create trigger profiles_protect before update on public.profiles
  for each row execute function public.trg_profiles_protect();

create or replace function public.trg_shops_protect() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.phone := public.normalize_phone(new.phone);
  if tg_op = 'INSERT' then
    if auth.uid() is not null and not public.is_admin() then
      new.verification_status := 'pending';
      new.verified_at := null;
      new.verification_notes := null;
      new.owner_id := auth.uid();
    end if;
  else
    if auth.uid() is not null and not public.is_admin() then
      new.owner_id := old.owner_id;
      new.verification_notes := old.verification_notes;
      new.verified_at := old.verified_at;
      new.created_at := old.created_at;
      new.verification_status := old.verification_status;
      -- identity-level edits force re-verification
      if old.verification_status = 'approved' and (
           new.shop_name is distinct from old.shop_name or
           new.address   is distinct from old.address   or
           new.city      is distinct from old.city      or
           new.pincode   is distinct from old.pincode) then
        new.verification_status := 'pending';
        new.verified_at := null;
      end if;
    end if;
    new.updated_at := now();
  end if;
  if new.verification_status = 'approved' and new.verified_at is null then
    new.verified_at := now();
  end if;
  return new;
end $$;
drop trigger if exists shops_protect on public.shops;
create trigger shops_protect before insert or update on public.shops
  for each row execute function public.trg_shops_protect();

create or replace function public.trg_inventory_before() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  trusted boolean := (auth.uid() is null or public.is_admin());
begin
  if tg_op = 'UPDATE' and not trusted then
    new.shop_id := old.shop_id;
    new.product_id := old.product_id;
  end if;
  new.availability_status := case
    when new.quantity <= 0 then 'out_of_stock'
    when new.quantity <= 5 then 'low_stock'
    else 'available' end;
  if tg_op = 'INSERT' then
    if not trusted or new.last_updated is null then new.last_updated := now(); end if;
  else
    if not trusted then new.last_updated := now();
    else new.last_updated := coalesce(new.last_updated, now()); end if;
  end if;
  return new;
end $$;
drop trigger if exists inventory_before on public.shop_inventory;
create trigger inventory_before before insert or update on public.shop_inventory
  for each row execute function public.trg_inventory_before();

create or replace function public.trg_products_before() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' and auth.uid() is not null then
    new.created_by := auth.uid();
  end if;
  return new;
end $$;
drop trigger if exists products_before on public.products;
create trigger products_before before insert on public.products
  for each row execute function public.trg_products_before();

create or replace function public.trg_enquiries_before() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.customer_phone := public.normalize_phone(new.customer_phone);
  if tg_op = 'INSERT' then
    if (select count(*) from public.enquiries
         where customer_id = new.customer_id and created_at > now() - interval '24 hours') >= 20 then
      raise exception 'Enquiry limit reached (20 per 24 hours)';
    end if;
    new.status := 'pending'; new.shop_reply := null;
  elsif auth.uid() is not null and not public.is_admin() then
    -- shop owners may change ONLY status and reply
    new.customer_id := old.customer_id; new.shop_id := old.shop_id;
    new.product_id := old.product_id;   new.message := old.message;
    new.customer_phone := old.customer_phone; new.created_at := old.created_at;
    if new.shop_reply is not null and new.shop_reply <> '' and new.status = 'pending' then
      new.status := 'replied';
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists enquiries_before on public.enquiries;
create trigger enquiries_before before insert or update on public.enquiries
  for each row execute function public.trg_enquiries_before();

create or replace function public.trg_reviews_before() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.reviewer_name := (select split_part(full_name, ' ', 1) from public.profiles where id = new.customer_id);
  return new;
end $$;
drop trigger if exists reviews_before on public.reviews;
create trigger reviews_before before insert or update on public.reviews
  for each row execute function public.trg_reviews_before();

create or replace function public.trg_reports_before() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if (select count(*) from public.reports
         where reporter_id = new.reporter_id and created_at > now() - interval '24 hours') >= 20 then
      raise exception 'Report limit reached (20 per 24 hours)';
    end if;
    new.status := 'open'; new.admin_notes := null;
  end if;
  return new;
end $$;
drop trigger if exists reports_before on public.reports;
create trigger reports_before before insert or update on public.reports
  for each row execute function public.trg_reports_before();

-- DPDP Act: right to erasure. Deletes the caller's auth user; everything cascades.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if public.is_admin() then raise exception 'Admin accounts cannot self-delete'; end if;
  delete from auth.users where id = auth.uid();
end $$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------- Row Level Security ----------------------------------------

alter table public.profiles       enable row level security;
alter table public.categories     enable row level security;
alter table public.shops          enable row level security;
alter table public.products       enable row level security;
alter table public.shop_inventory enable row level security;
alter table public.enquiries      enable row level security;
alter table public.reviews        enable row level security;
alter table public.reports        enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
drop policy if exists profiles_delete on public.profiles;  -- no delete policy: erasure goes through delete_my_account()

-- categories
drop policy if exists categories_select on public.categories;
create policy categories_select on public.categories for select to anon, authenticated using (true);
drop policy if exists categories_admin on public.categories;
create policy categories_admin on public.categories for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- shops
drop policy if exists shops_select on public.shops;
create policy shops_select on public.shops for select to anon, authenticated
  using (verification_status = 'approved' or owner_id = auth.uid() or public.is_admin());
drop policy if exists shops_update on public.shops;
create policy shops_update on public.shops for update to authenticated
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());
drop policy if exists shops_admin_ins on public.shops;
create policy shops_admin_ins on public.shops for insert to authenticated
  with check (public.is_admin());
drop policy if exists shops_admin_del on public.shops;
create policy shops_admin_del on public.shops for delete to authenticated
  using (public.is_admin());

-- products (shared catalogue)
drop policy if exists products_select on public.products;
create policy products_select on public.products for select to anon, authenticated using (true);
drop policy if exists products_insert on public.products;
create policy products_insert on public.products for insert to authenticated
  with check (public.is_admin() or public.owns_approved_shop());
drop policy if exists products_admin_upd on public.products;
create policy products_admin_upd on public.products for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists products_admin_del on public.products;
create policy products_admin_del on public.products for delete to authenticated
  using (public.is_admin());

-- shop_inventory
drop policy if exists inv_select on public.shop_inventory;
create policy inv_select on public.shop_inventory for select to anon, authenticated
  using (public.shop_is_approved(shop_id) or public.owns_shop(shop_id) or public.is_admin());
drop policy if exists inv_insert on public.shop_inventory;
create policy inv_insert on public.shop_inventory for insert to authenticated
  with check (public.owns_shop(shop_id) or public.is_admin());
drop policy if exists inv_update on public.shop_inventory;
create policy inv_update on public.shop_inventory for update to authenticated
  using (public.owns_shop(shop_id) or public.is_admin())
  with check (public.owns_shop(shop_id) or public.is_admin());
drop policy if exists inv_delete on public.shop_inventory;
create policy inv_delete on public.shop_inventory for delete to authenticated
  using (public.owns_shop(shop_id) or public.is_admin());

-- enquiries
drop policy if exists enq_select on public.enquiries;
create policy enq_select on public.enquiries for select to authenticated
  using (customer_id = auth.uid() or public.owns_shop(shop_id) or public.is_admin());
drop policy if exists enq_insert on public.enquiries;
create policy enq_insert on public.enquiries for insert to authenticated
  with check (customer_id = auth.uid() and public.shop_is_approved(shop_id));
drop policy if exists enq_update on public.enquiries;
create policy enq_update on public.enquiries for update to authenticated
  using (public.owns_shop(shop_id) or public.is_admin())
  with check (public.owns_shop(shop_id) or public.is_admin());
drop policy if exists enq_delete on public.enquiries;
create policy enq_delete on public.enquiries for delete to authenticated
  using (public.is_admin());

-- reviews
drop policy if exists rev_select on public.reviews;
create policy rev_select on public.reviews for select to anon, authenticated
  using (public.shop_is_approved(shop_id));
drop policy if exists rev_insert on public.reviews;
create policy rev_insert on public.reviews for insert to authenticated
  with check (customer_id = auth.uid() and public.shop_is_approved(shop_id) and not public.owns_shop(shop_id));
drop policy if exists rev_update on public.reviews;
create policy rev_update on public.reviews for update to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());
drop policy if exists rev_delete on public.reviews;
create policy rev_delete on public.reviews for delete to authenticated
  using (customer_id = auth.uid() or public.is_admin());

-- reports
drop policy if exists rep_select on public.reports;
create policy rep_select on public.reports for select to authenticated
  using (reporter_id = auth.uid() or public.is_admin());
drop policy if exists rep_insert on public.reports;
create policy rep_insert on public.reports for insert to authenticated
  with check (reporter_id = auth.uid() and public.shop_is_approved(shop_id));
drop policy if exists rep_update on public.reports;
create policy rep_update on public.reports for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists rep_delete on public.reports;
create policy rep_delete on public.reports for delete to authenticated
  using (public.is_admin());

-- ---------- Explicit grants (newer Supabase projects don't auto-grant) --
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.shops,
                public.shop_inventory, public.reviews to anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.categories, public.shops,
      public.products, public.shop_inventory, public.enquiries, public.reviews,
      public.reports to authenticated;

-- ---------- Storage: product images ------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 2097152,
        array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = true, file_size_limit = 2097152,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];

drop policy if exists "product images upload" on storage.objects;
create policy "product images upload" on storage.objects for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (public.is_admin() or public.owns_approved_shop())
  );
drop policy if exists "product images delete" on storage.objects;
create policy "product images delete" on storage.objects for delete to authenticated
  using (bucket_id = 'product-images'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- ---------- Default categories -----------------------------------------
insert into public.categories (name, name_kn, icon) values
  ('Grocery & Staples',    'ದಿನಸಿ ಮತ್ತು ಧಾನ್ಯಗಳು',        '🛒'),
  ('Electronics & Mobile', 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಮೊಬೈಲ್', '🔌'),
  ('Stationery & Books',   'ಸ್ಟೇಷನರಿ ಮತ್ತು ಪುಸ್ತಕಗಳು',   '📚'),
  ('Pharmacy & Health',    'ಔಷಧಾಲಯ ಮತ್ತು ಆರೋಗ್ಯ',        '💊'),
  ('Clothing & Apparel',   'ಬಟ್ಟೆ ಮತ್ತು ಉಡುಪು',          '👕'),
  ('Hardware & Agri',      'ಹಾರ್ಡ್‌ವೇರ್ ಮತ್ತು ಕೃಷಿ',      '🔧')
on conflict (name) do nothing;
