-- ===== MAKE-UPP DATABASE SEED SCRIPT =====
-- This script populates the database with initial data for roles, categories, and admin user

-- 1️⃣ Insert roles
INSERT INTO public.roles (name, description) VALUES
  ('admin', 'Administrador del sistema'),
  ('customer', 'Usuario comprador'),
  ('seller', 'Vendedor de productos')
ON CONFLICT (name) DO NOTHING;

-- 2️⃣ Insert categories
INSERT INTO public.categories (name, description) VALUES
  ('Maquillaje Facial', 'Productos para el rostro: bases, correctores, polvos'),
  ('Maquillaje de Ojos', 'Sombras, delineadores, máscaras de pestañas'),
  ('Maquillaje de Labios', 'Labiales, brillos, delineadores de labios'),
  ('Cuidado de la Piel', 'Cremas, limpiadores, tratamientos faciales'),
  ('Herramientas de Maquillaje', 'Bróchas, esponjas, aplicadores'),
  ('Fragancias', 'Perfumes y colonias'),
  ('Accesorios', 'Bolsos, estuches, organizadores de maquillaje')
ON CONFLICT (name) DO NOTHING;

-- 3️⃣ Create admin user profile (you'll need to replace the UUID with an actual user ID from auth.users)
-- Note: This should be run after creating an admin user in Supabase Auth
-- Example admin user creation (run this in Supabase Auth or via API):
/*
INSERT INTO public.profiles (id, username, full_name, role_id, updated_at) VALUES
  ('YOUR_ADMIN_USER_UUID_HERE', 'admin', 'Administrador del Sistema', 
   (SELECT id FROM public.roles WHERE name = 'admin'), 
   NOW())
ON CONFLICT (id) DO UPDATE SET
  role_id = EXCLUDED.role_id,
  updated_at = EXCLUDED.updated_at;
*/

-- 4️⃣ Insert sample products (optional - for testing)
INSERT INTO public.products (name, description, price, category_id, available) VALUES
  ('Base de Maquillaje Luxury', 'Base de larga duración con acabado natural', 45.99, 
   (SELECT id FROM public.categories WHERE name = 'Maquillaje Facial'), true),
  
  ('Paleta de Sombras Premium', '12 sombras con pigmentos de alta calidad', 32.50, 
   (SELECT id FROM public.categories WHERE name = 'Maquillaje de Ojos'), true),
   
  ('Labial Mate de Larga Duración', 'Labial mate que no se transfiere', 18.75, 
   (SELECT id FROM public.categories WHERE name = 'Maquillaje de Labios'), true),
   
  ('Crema Hidratante Anti-Edad', 'Crema con ácido hialurónico y vitamina C', 65.00, 
   (SELECT id FROM public.categories WHERE name = 'Cuidado de la Piel'), true),
   
  ('Set de Brochas Profesionales', '12 brochas de alta calidad para maquillaje', 89.99, 
   (SELECT id FROM public.categories WHERE name = 'Herramientas de Maquillaje'), true),
   
  ('Perfume Signature', 'Fragancia exclusiva de Make-upp', 125.00, 
   (SELECT id FROM public.categories WHERE name = 'Fragancias'), true)
ON CONFLICT DO NOTHING;

-- 5️⃣ Verify data insertion
SELECT 'Roles created:' as info, COUNT(*) as count FROM public.roles;
SELECT 'Categories created:' as info, COUNT(*) as count FROM public.categories;
SELECT 'Sample products created:' as info, COUNT(*) as count FROM public.products;

-- 6️⃣ Display created data
SELECT 'Roles:' as section;
SELECT id, name, description FROM public.roles ORDER BY id;

SELECT 'Categories:' as section;
SELECT id, name, description FROM public.categories ORDER BY id;

SELECT 'Sample Products:' as section;
SELECT p.id, p.name, p.price, c.name as category 
FROM public.products p 
JOIN public.categories c ON p.category_id = c.id 
ORDER BY p.id;
