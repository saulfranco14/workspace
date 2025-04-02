-- Configuración de esquema para la aplicación de e-commerce

-- Habilitar la extensión pgcrypto para UUIDs
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla de Categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsqueda de productos por nombre
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('spanish', name));

-- Tabla de Perfiles (se relaciona con auth.users de Supabase)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para crear perfil automáticamente cuando se crea un usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Tabla de Carritos
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_fingerprint VARCHAR(100), -- Para carritos de usuarios no autenticados
  UNIQUE(user_id)
);

-- Tabla de Elementos del Carrito
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, product_id)
);

-- Tabla de Colecciones de Favoritos
CREATE TABLE IF NOT EXISTS favorite_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_fingerprint VARCHAR(100), -- Para colecciones de usuarios no autenticados
  UNIQUE(user_id, name)
);

-- Tabla de Elementos Favoritos
CREATE TABLE IF NOT EXISTS favorite_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES favorite_collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
);

-- Políticas de seguridad (RLS - Row Level Security)

-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_items ENABLE ROW LEVEL SECURITY;

-- Política para productos (visible para todos)
CREATE POLICY "Productos visibles para todos" ON products
  FOR SELECT USING (true);

-- Política para categorías (visible para todos)
CREATE POLICY "Categorías visibles para todos" ON categories
  FOR SELECT USING (true);

-- Política para perfiles (ver solo su propio perfil)
CREATE POLICY "Usuarios pueden ver su propio perfil" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para carritos
CREATE POLICY "Usuarios pueden ver sus propios carritos" ON carts
  FOR SELECT USING (auth.uid() = user_id OR device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

CREATE POLICY "Usuarios pueden crear carritos" ON carts
  FOR INSERT WITH CHECK (auth.uid() = user_id OR device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

CREATE POLICY "Usuarios pueden actualizar sus propios carritos" ON carts
  FOR UPDATE USING (auth.uid() = user_id OR device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

CREATE POLICY "Usuarios pueden eliminar sus propios carritos" ON carts
  FOR DELETE USING (auth.uid() = user_id OR device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

-- Políticas para elementos del carrito
CREATE POLICY "Usuarios pueden ver elementos de su propio carrito" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')
    )
  );

CREATE POLICY "Usuarios pueden añadir elementos a su propio carrito" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')
    )
  );

CREATE POLICY "Usuarios pueden actualizar elementos de su propio carrito" ON cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')
    )
  );

CREATE POLICY "Usuarios pueden eliminar elementos de su propio carrito" ON cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM carts
      WHERE carts.id = cart_items.cart_id
      AND (carts.user_id = auth.uid() OR carts.device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint')
    )
  );

-- Políticas para colecciones de favoritos
CREATE POLICY "Usuarios pueden ver sus propias colecciones de favoritos" ON favorite_collections
  FOR SELECT USING (auth.uid() = user_id OR device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

CREATE POLICY "Usuarios pueden crear colecciones de favoritos" ON favorite_collections
  FOR INSERT WITH CHECK (auth.uid() = user_id OR device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

CREATE POLICY "Usuarios pueden actualizar sus propias colecciones de favoritos" ON favorite_collections
  FOR UPDATE USING (auth.uid() = user_id OR device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

CREATE POLICY "Usuarios pueden eliminar sus propias colecciones de favoritos" ON favorite_collections
  FOR DELETE USING (auth.uid() = user_id OR device_fingerprint = current_setting('request.headers')::json->>'x-device-fingerprint');

-- Políticas para elementos favoritos
CREATE POLICY "Usuarios pueden ver elementos de sus colecciones de favoritos" ON favorite_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM favorite_collections
      WHERE favorite_collections.id = favorite_items.collection_id
      AND favorite_collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden añadir elementos a sus colecciones de favoritos" ON favorite_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM favorite_collections
      WHERE favorite_collections.id = favorite_items.collection_id
      AND favorite_collections.user_id = auth.uid()
    )
  );

CREATE POLICY "Usuarios pueden eliminar elementos de sus colecciones de favoritos" ON favorite_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM favorite_collections
      WHERE favorite_collections.id = favorite_items.collection_id
      AND favorite_collections.user_id = auth.uid()
    )
  ); 