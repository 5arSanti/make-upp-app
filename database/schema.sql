-- ===== SUPABASE SCHEMA - APP DE VENTAS =====
-- Ejecutar en el SQL Editor de Supabase (Dashboard > SQL Editor)
-- Requiere: Proyecto Supabase con Auth habilitado

-- Extensión UUID (habitualmente ya está en Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. ROLES
-- ============================================
CREATE TABLE IF NOT EXISTS public.roles (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CATEGORÍAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PERFILES (vinculados a auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  role_id BIGINT REFERENCES public.roles(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda por username
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- ============================================
-- 4. PRODUCTOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
  available BOOLEAN DEFAULT true,
  category_id BIGINT REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON public.products(available);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ============================================
-- 5. CARRITOS
-- ============================================
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_carts_profile_active ON public.carts(profile_id, active);

-- ============================================
-- 6. ITEMS DEL CARRITO
-- ============================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON public.cart_items(cart_id);

-- ============================================
-- 7. PEDIDOS (ORDERS)
-- ============================================
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending',
    'paid',
    'shipped',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total DECIMAL(12, 2) NOT NULL CHECK (total >= 0),
  status order_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_profile ON public.orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ============================================
-- 8. ITEMS DEL PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase DECIMAL(12, 2) NOT NULL CHECK (price_at_purchase >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ============================================
-- 9. FACTURAS
-- ============================================
CREATE TABLE IF NOT EXISTS public.invoices (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  total DECIMAL(12, 2) NOT NULL CHECK (total >= 0),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_order ON public.invoices(order_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Roles y categorías: lectura pública (para catálogo)
CREATE POLICY "roles_select_all" ON public.roles FOR SELECT USING (true);
CREATE POLICY "categories_select_all" ON public.categories FOR SELECT USING (true);

-- Productos: lectura pública
CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (true);

-- Perfiles: cada usuario ve el suyo; admins pueden ver/actualizar más (ajustar según tu lógica)
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Carritos: solo el dueño
CREATE POLICY "carts_select_own" ON public.carts FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "carts_insert_own" ON public.carts FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "carts_update_own" ON public.carts FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "carts_delete_own" ON public.carts FOR DELETE USING (auth.uid() = profile_id);

-- Cart items: a través del carrito del usuario
CREATE POLICY "cart_items_select_own" ON public.cart_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.profile_id = auth.uid()));
CREATE POLICY "cart_items_insert_own" ON public.cart_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.profile_id = auth.uid()));
CREATE POLICY "cart_items_update_own" ON public.cart_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.profile_id = auth.uid()));
CREATE POLICY "cart_items_delete_own" ON public.cart_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.carts c WHERE c.id = cart_items.cart_id AND c.profile_id = auth.uid()));

-- Pedidos: solo el dueño
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "orders_update_own" ON public.orders FOR UPDATE USING (auth.uid() = profile_id);

-- Order items: solo si el pedido es del usuario
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.profile_id = auth.uid()));
CREATE POLICY "order_items_insert_own" ON public.order_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.profile_id = auth.uid()));

-- Facturas: solo si el pedido es del usuario
CREATE POLICY "invoices_select_own" ON public.invoices FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = invoices.order_id AND o.profile_id = auth.uid()));

-- Políticas para escritura en roles, categories, products (solo si tienes rol admin; opcional)
-- Si tu app usa role_id en profiles, puedes crear una función helper:
-- CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
--   SELECT EXISTS (SELECT 1 FROM public.profiles p JOIN public.roles r ON p.role_id = r.id WHERE p.id = auth.uid() AND r.name = 'admin');
-- $$ LANGUAGE sql SECURITY DEFINER STABLE;
-- Luego: CREATE POLICY "products_insert_admin" ON public.products FOR INSERT WITH CHECK (public.is_admin());
-- Aquí se deja comentado; descomenta y crea is_admin() si quieres restringir creación/edición de productos a admins.

-- ============================================
-- TRIGGER: Crear perfil al registrar usuario
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1), 'user_' || SUBSTRING(NEW.id::TEXT, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    (SELECT id FROM public.roles WHERE name = 'customer' LIMIT 1)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Solo crear el trigger si auth.users existe (Supabase)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE public.roles IS 'Roles de usuario: admin, customer, seller';
COMMENT ON TABLE public.categories IS 'Categorías de productos para venta general';
COMMENT ON TABLE public.profiles IS 'Perfiles de usuario vinculados a auth.users';
COMMENT ON TABLE public.products IS 'Catálogo de productos';
COMMENT ON TABLE public.carts IS 'Carritos de compra por usuario';
COMMENT ON TABLE public.orders IS 'Pedidos realizados';
COMMENT ON TABLE public.invoices IS 'Facturas asociadas a pedidos';
