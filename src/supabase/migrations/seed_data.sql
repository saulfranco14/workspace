-- Datos semilla para la aplicación de e-commerce de plantas

-- Categorías para Plantas
INSERT INTO categories (name, description) VALUES
('Plantas de Interior', 'Perfectas para decorar y purificar el aire dentro de tu hogar'),
('Plantas de Exterior', 'Ideales para jardines, balcones y espacios abiertos'),
('Plantas Suculentas', 'Plantas de bajo mantenimiento que almacenan agua en sus hojas'),
('Plantas Colgantes', 'Perfectas para colgar en macetas y añadir un toque verde desde arriba'),
('Cactus', 'Plantas resistentes y de bajo mantenimiento para espacios soleados');

-- Categorías para Accesorios
INSERT INTO categories (name, description) VALUES
('Macetas', 'Variedad de macetas para todo tipo de plantas'),
('Tierra y Sustratos', 'Mezclas especiales para el crecimiento óptimo de tus plantas'),
('Herramientas', 'Herramientas esenciales para el cuidado de tus plantas'),
('Decoración', 'Accesorios para embellecer tu jardín o espacio verde'),
('Sistemas de Riego', 'Soluciones para mantener tus plantas hidratadas');

-- Categorías para Kits
INSERT INTO categories (name, description) VALUES
('Kits para Principiantes', 'Todo lo que necesitas para empezar en el mundo de las plantas'),
('Kits de Cultivo', 'Conjunto de elementos para cultivar tus propias plantas'),
('Kits de Terrarios', 'Para crear mini ecosistemas en recipientes de cristal'),
('Kits de Bonsái', 'Lo necesario para cultivar y mantener bonsáis'),
('Kits de Huerto Urbano', 'Cultiva tus propias hierbas y vegetales en casa');

-- Productos - Plantas de Interior
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('Spider Plant', 'Planta fácil de cuidar con hojas largas y arqueadas, perfecta para purificar el aire', 250.00, 20, '/images/plants/spider-plant.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Interior'), true),
('Snake Plant', 'Planta resistente con hojas erectas y verticales, excelente para principiantes', 280.00, 15, '/images/plants/snake-plant.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Interior'), false),
('Peace Lily', 'Planta con flores blancas elegantes que purifica el aire', 320.00, 12, '/images/plants/peace-lily.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Interior'), true),
('Pothos', 'Planta trepadora con hojas en forma de corazón, ideal para estanterías', 230.00, 25, '/images/plants/pothos.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Interior'), false),
('Monstera Deliciosa', 'Planta tropical con hojas grandes y perforadas', 450.00, 8, '/images/plants/monstera.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Interior'), true),
('Ficus Elastica', 'Planta de interior con hojas grandes y brillantes', 400.00, 10, '/images/plants/ficus.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Interior'), false);

-- Productos - Plantas de Exterior
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('Grey Star Calarthea', 'Planta con hojas ornamentales, perfecta para espacios exteriores', 250.00, 20, '/images/plants/calarthea.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Exterior'), true),
('Banana Plant', 'Planta tropical de rápido crecimiento con grandes hojas', 250.00, 15, '/images/plants/banana-plant.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Exterior'), true),
('Song of India', 'Planta ornamental con hojas variegadas amarillas y verdes', 250.00, 18, '/images/plants/song-india.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Exterior'), false),
('Lavanda', 'Planta aromática con flores púrpuras, ideal para jardines', 220.00, 30, '/images/plants/lavender.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Exterior'), false),
('Helecho Boston', 'Helecho de gran tamaño ideal para áreas sombreadas', 270.00, 15, '/images/plants/boston-fern.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Exterior'), false),
('Hosta', 'Planta perenne con hojas grandes, perfecta para zonas sombreadas', 290.00, 12, '/images/plants/hosta.jpg', (SELECT id FROM categories WHERE name = 'Plantas de Exterior'), false);

-- Productos - Plantas Suculentas
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('Echeveria', 'Suculenta en forma de rosa con hojas carnosas', 180.00, 40, '/images/plants/echeveria.jpg', (SELECT id FROM categories WHERE name = 'Plantas Suculentas'), true),
('Aloe Vera', 'Planta medicinal con propiedades curativas', 200.00, 35, '/images/plants/aloe-vera.jpg', (SELECT id FROM categories WHERE name = 'Plantas Suculentas'), false),
('Haworthia', 'Pequeña suculenta con hojas rayadas y puntiagudas', 170.00, 30, '/images/plants/haworthia.jpg', (SELECT id FROM categories WHERE name = 'Plantas Suculentas'), false),
('Jade Plant', 'Suculenta de crecimiento lento con tallo grueso', 220.00, 20, '/images/plants/jade-plant.jpg', (SELECT id FROM categories WHERE name = 'Plantas Suculentas'), true),
('Sempervivum', 'Suculenta resistente que forma rosetas', 160.00, 50, '/images/plants/sempervivum.jpg', (SELECT id FROM categories WHERE name = 'Plantas Suculentas'), false),
('Sedum', 'Suculenta rastrera ideal para rocallas y jardineras', 150.00, 45, '/images/plants/sedum.jpg', (SELECT id FROM categories WHERE name = 'Plantas Suculentas'), false);

-- Productos - Plantas Colgantes
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('String of Pearls', 'Suculenta colgante con hojas esféricas', 230.00, 20, '/images/plants/string-pearls.jpg', (SELECT id FROM categories WHERE name = 'Plantas Colgantes'), true),
('Hoya', 'Planta colgante con hojas cerosas y flores estrelladas', 250.00, 15, '/images/plants/hoya.jpg', (SELECT id FROM categories WHERE name = 'Plantas Colgantes'), false),
('Philodendron', 'Planta trepadora con hojas en forma de corazón', 270.00, 18, '/images/plants/philodendron.jpg', (SELECT id FROM categories WHERE name = 'Plantas Colgantes'), true),
('Tradescantia', 'Planta colgante con hojas púrpuras y plateadas', 210.00, 25, '/images/plants/tradescantia.jpg', (SELECT id FROM categories WHERE name = 'Plantas Colgantes'), false),
('English Ivy', 'Planta trepadora clásica de hojas verdes', 190.00, 30, '/images/plants/english-ivy.jpg', (SELECT id FROM categories WHERE name = 'Plantas Colgantes'), false),
('Burros Tail', 'Suculenta colgante con hojas que parecen gotas', 220.00, 20, '/images/plants/burros-tail.jpg', (SELECT id FROM categories WHERE name = 'Plantas Colgantes'), false);

-- Productos - Cactus
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('Cactus Barril', 'Cactus globular de crecimiento lento', 200.00, 15, '/images/plants/barrel-cactus.jpg', (SELECT id FROM categories WHERE name = 'Cactus'), true),
('Cactus San Pedro', 'Cactus columnar de rápido crecimiento', 280.00, 10, '/images/plants/san-pedro.jpg', (SELECT id FROM categories WHERE name = 'Cactus'), false),
('Cactus de Navidad', 'Cactus que florece en invierno', 230.00, 20, '/images/plants/christmas-cactus.jpg', (SELECT id FROM categories WHERE name = 'Cactus'), false),
('Opuntia', 'Cactus de paleta ideal para exteriores', 190.00, 25, '/images/plants/opuntia.jpg', (SELECT id FROM categories WHERE name = 'Cactus'), true),
('Mammillaria', 'Pequeño cactus globular con espinas blancas', 170.00, 30, '/images/plants/mammillaria.jpg', (SELECT id FROM categories WHERE name = 'Cactus'), false),
('Rebutia', 'Pequeño cactus con flores coloridas', 180.00, 25, '/images/plants/rebutia.jpg', (SELECT id FROM categories WHERE name = 'Cactus'), false);

-- Productos - Macetas
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('White Planta Pots', 'Conjunto de macetas blancas de cerámica en diferentes tamaños', 250.00, 20, '/images/accessories/white-pots.jpg', (SELECT id FROM categories WHERE name = 'Macetas'), true),
('Lemon Pots', 'Conjunto de macetas en tonos verde limón y blanco', 250.00, 15, '/images/accessories/lemon-pots.jpg', (SELECT id FROM categories WHERE name = 'Macetas'), true),
('Rosewood Pots', 'Macetas en tono rosa suave y blanco', 250.00, 25, '/images/accessories/rosewood-pots.jpg', (SELECT id FROM categories WHERE name = 'Macetas'), true),
('Dove Grey Pots', 'Elegantes macetas en tonos gris paloma y blanco', 250.00, 20, '/images/accessories/grey-pots.jpg', (SELECT id FROM categories WHERE name = 'Macetas'), true),
('Maceta Colgante', 'Maceta diseñada para colgar plantas', 180.00, 30, '/images/accessories/hanging-pot.jpg', (SELECT id FROM categories WHERE name = 'Macetas'), false),
('Maceta Autorriego', 'Maceta con sistema de autorriego para plantas', 320.00, 15, '/images/accessories/self-watering.jpg', (SELECT id FROM categories WHERE name = 'Macetas'), false);

-- Productos - Herramientas
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('Shovels', 'Set de palas pequeñas para jardinería', 250.00, 20, '/images/accessories/shovels.jpg', (SELECT id FROM categories WHERE name = 'Herramientas'), true),
('Kit de Herramientas', 'Kit básico de herramientas para el cuidado de plantas', 450.00, 10, '/images/accessories/tool-kit.jpg', (SELECT id FROM categories WHERE name = 'Herramientas'), false),
('Tijeras de Podar', 'Tijeras de precisión para podar plantas', 200.00, 25, '/images/accessories/pruning-shears.jpg', (SELECT id FROM categories WHERE name = 'Herramientas'), false),
('Regadera', 'Regadera metálica con boquilla fina', 280.00, 15, '/images/accessories/watering-can.jpg', (SELECT id FROM categories WHERE name = 'Herramientas'), true),
('Guantes de Jardín', 'Guantes resistentes para proteger tus manos', 150.00, 30, '/images/accessories/garden-gloves.jpg', (SELECT id FROM categories WHERE name = 'Herramientas'), false);

-- Productos - Decoración
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('SAIC Bottle', 'Botella decorativa blanca para arreglos florales', 250.00, 15, '/images/accessories/saic-bottle.jpg', (SELECT id FROM categories WHERE name = 'Decoración'), true),
('Xiaoda Bottle', 'Elegante botella decorativa minimalista', 250.00, 20, '/images/accessories/xiaoda-bottle.jpg', (SELECT id FROM categories WHERE name = 'Decoración'), true),
('Finn Terrazzo', 'Base decorativa de terrazzo para plantas', 250.00, 15, '/images/accessories/finn-terrazzo.jpg', (SELECT id FROM categories WHERE name = 'Decoración'), true),
('Piedras Decorativas', 'Piedras de colores para decorar macetas', 120.00, 50, '/images/accessories/decorative-stones.jpg', (SELECT id FROM categories WHERE name = 'Decoración'), false),
('Figuritas de Jardín', 'Pequeñas figuritas para decorar jardines', 180.00, 25, '/images/accessories/garden-figures.jpg', (SELECT id FROM categories WHERE name = 'Decoración'), false);

-- Productos - Kits
INSERT INTO products (name, description, price, stock, image_url, category_id, is_featured) VALUES
('Lemon Balm Grow Kit', 'Kit completo para cultivar melisa con semillas, tierra y maceta', 350.00, 15, '/images/kits/lemon-balm-kit.jpg', (SELECT id FROM categories WHERE name = 'Kits para Principiantes'), true),
('Kit Suculentas', 'Kit para cultivar 3 tipos diferentes de suculentas', 400.00, 20, '/images/kits/succulent-kit.jpg', (SELECT id FROM categories WHERE name = 'Kits para Principiantes'), false),
('Kit Huerto Urbano', 'Todo lo necesario para empezar tu huerto en casa', 500.00, 10, '/images/kits/urban-garden-kit.jpg', (SELECT id FROM categories WHERE name = 'Kits de Huerto Urbano'), true),
('Kit Terrario', 'Materiales para crear tu propio terrario', 450.00, 15, '/images/kits/terrarium-kit.jpg', (SELECT id FROM categories WHERE name = 'Kits de Terrarios'), false),
('Kit Bonsái', 'Kit completo para cultivar y cuidar un bonsái', 600.00, 8, '/images/kits/bonsai-kit.jpg', (SELECT id FROM categories WHERE name = 'Kits de Bonsái'), true); 