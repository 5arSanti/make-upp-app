-- ===== SEED - APP DE VENTAS (DATOS INICIALES) =====
-- Ejecutar después de database/schema.sql
-- Inserta roles, categorías de venta general y productos de ejemplo

-- 1️⃣ Insert roles
INSERT INTO public.roles (name, description) VALUES
  ('admin', 'Administrador del sistema'),
  ('customer', 'Usuario comprador'),
  ('seller', 'Vendedor de productos')
ON CONFLICT (name) DO NOTHING;

-- 2️⃣ Insert categories (venta en general)
INSERT INTO public.categories (name, description) VALUES
  ('Hogar', 'Productos para el hogar: textiles, decoración, menaje'),
  ('Electrodomésticos', 'Lavadoras, neveras, aire acondicionado, pequeños electrodomésticos'),
  ('Ropa y Accesorios', 'Ropa, calzado y complementos'),
  ('Automotriz', 'Accesorios y repuestos para vehículos'),
  ('Juguetes y Bebés', 'Juguetes, puericultura y artículos para bebés'),
  ('Deportes y Fitness', 'Artículos deportivos y equipamiento fitness'),
  ('Salud y Belleza', 'Cuidado personal, cosméticos y bienestar')
ON CONFLICT (name) DO NOTHING;

-- 3️⃣ Create admin user profile (reemplazar el UUID por el de tu usuario en auth.users)
-- Ejecutar después de crear el usuario admin en Supabase Auth:
/*
INSERT INTO public.profiles (id, username, full_name, role_id, updated_at) VALUES
  ('YOUR_ADMIN_USER_UUID_HERE', 'admin', 'Administrador del Sistema',
   (SELECT id FROM public.roles WHERE name = 'admin'),
   NOW())
ON CONFLICT (id) DO UPDATE SET
  role_id = EXCLUDED.role_id,
  updated_at = EXCLUDED.updated_at;
*/

-- 4️⃣ Insert sample products (opcional - para pruebas)
INSERT INTO public.products (name, description, price, category_id, available) VALUES
  ('Toallas de Baño', 'Toallas de baño de alta calidad, 100% algodón', 45.99,
   (SELECT id FROM public.categories WHERE name = 'Hogar'), true),
  ('Lavadora', 'Lavadora de alta capacidad, 10 kg', 349.99,
   (SELECT id FROM public.categories WHERE name = 'Electrodomésticos'), true),
  ('Secadora', 'Secadora de alta capacidad, 10 kg', 299.99,
   (SELECT id FROM public.categories WHERE name = 'Electrodomésticos'), true),
  ('Aire Acondicionado', 'Aire acondicionado split 12000 BTU', 449.99,
   (SELECT id FROM public.categories WHERE name = 'Electrodomésticos'), true),
  ('Refrigerador', 'Refrigerador no frost 350 L', 549.99,
   (SELECT id FROM public.categories WHERE name = 'Electrodomésticos'), true),
  ('Camiseta Básica', 'Camiseta de algodón orgánico, tallas S a XXL', 19.99,
   (SELECT id FROM public.categories WHERE name = 'Ropa y Accesorios'), true),
  ('Zapatillas Running', 'Zapatillas ligeras para running y caminata', 89.99,
   (SELECT id FROM public.categories WHERE name = 'Deportes y Fitness'), true),
  ('Crema Hidratante', 'Crema facial con ácido hialurónico', 24.99,
   (SELECT id FROM public.categories WHERE name = 'Salud y Belleza'), true)
ON CONFLICT (name) DO NOTHING;

-- 5️⃣ Verify data insertion
SELECT 'Roles created:' AS info, COUNT(*) AS count FROM public.roles;
SELECT 'Categories created:' AS info, COUNT(*) AS count FROM public.categories;
SELECT 'Sample products created:' AS info, COUNT(*) AS count FROM public.products;

-- 6️⃣ Display created data
SELECT 'Roles:' AS section;
SELECT id, name, description FROM public.roles ORDER BY id;

SELECT 'Categories:' AS section;
SELECT id, name, description FROM public.categories ORDER BY id;

SELECT 'Sample Products:' AS section;
SELECT p.id, p.name, p.price, c.name AS category
FROM public.products p
JOIN public.categories c ON p.category_id = c.id
ORDER BY p.id;
