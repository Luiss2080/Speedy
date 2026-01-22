-- Migration: Data Expansion (Rich Seeds)
-- Created at: 2026-01-22

-- 1. Usuarios Adicionales
INSERT INTO usuarios (email, password, nombre, apellido, telefono, nivel_id) VALUES
('juan@mail.com', '123456', 'Juan', 'Perez', '999111000', 2), -- Plata
('maria@mail.com', '123456', 'Maria', 'Gomez', '999222000', 3); -- Oro

-- 2. Expandir Categorías
INSERT IGNORE INTO categorias (nombre, slug, icono, color) VALUES
('Pollo', 'pollo', 'drumstick-bite', '#fef3c7'),
('Chifa', 'chifa', 'bowl-rice', '#ffedd5'), 
('Mexicana', 'mexicana', 'pepper-hot', '#fee2e2'),
('Saludable', 'saludable', 'carrot', '#dcfce7');

-- 3. Nuevos Restaurantes
INSERT INTO restaurantes (nombre, descripcion, tiempo_estimado_min, tiempo_estimado_max, costo_envio_base, categoria_id, imagen_logo, imagen_portada) VALUES
('KFC', 'Para chuparse los dedos', 30, 45, 4.50, (SELECT id FROM categorias WHERE slug='pollo'), 'https://i.imgur.com/A6u2k9W.png', 'https://images.unsplash.com/photo-1513639776629-9269d0d3c0fe'),
('Pardos Chicken', 'Sabor peruano', 45, 60, 6.00, (SELECT id FROM categorias WHERE slug='pollo'), 'https://i.imgur.com/example.png', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b'),
('Seven Soup', 'Sopas y criollo 24h', 30, 50, 5.00, (SELECT id FROM categorias WHERE slug='chifa'), 'https://i.imgur.com/example2.png', 'https://images.unsplash.com/photo-1547592166-23acbe54099c'),
('Chilis', 'Tex Mex y Bebidas', 40, 55, 7.00, (SELECT id FROM categorias WHERE slug='mexicana'), 'https://i.imgur.com/example3.png', 'https://images.unsplash.com/photo-1563536310477-c7b4e3a800c2'),
('Freshii', 'Comida saludable y wraps', 20, 35, 3.50, (SELECT id FROM categorias WHERE slug='saludable'), 'https://i.imgur.com/example4.png', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061');

-- 4. Nuevos Productos
-- KFC (ID dinámico, pero asumimos orden secuencial o buscamos)
SET @kfc_id = (SELECT id FROM restaurantes WHERE nombre='KFC' LIMIT 1);
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria_interna) VALUES
(@kfc_id, 'Mega Banquete', '8 Piezas de pollo, papas y ensalada', 59.90, 'https://images.unsplash.com/photo-1513639776629-9269d0d3c0fe', 'Combos'),
(@kfc_id, 'Twister Clásico', 'Wrap de pollo con lechuga y mayonesa', 15.90, 'https://images.unsplash.com/photo-1563536310477-c7b4e3a800c2', 'Wraps');

-- Chilis
SET @chilis_id = (SELECT id FROM restaurantes WHERE nombre='Chilis' LIMIT 1);
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria_interna) VALUES
(@chilis_id, 'Fajitas Clásicas', 'Carne, pollo o mixto con tortillas', 45.00, 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f', 'Fondos'),
(@chilis_id, 'Molten Chocolate Cake', 'Volcán de chocolate con helado', 22.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Postres');

-- 5. Extras Dinámicos (Opciones)

-- Opciones para Fajitas (Término de la carne)
SET @prod_id = (SELECT id FROM productos WHERE nombre='Fajitas Clásicas' LIMIT 1);
INSERT INTO grupos_opciones (producto_id, nombre, tipo_seleccion, es_requerido) VALUES (@prod_id, 'Término de la Carne', 'radio', TRUE);
SET @grp_id = LAST_INSERT_ID();
INSERT INTO opciones_producto (grupo_id, nombre) VALUES 
(@grp_id, 'Bien Cocido'), (@grp_id, 'Tres Cuartos'), (@grp_id, 'Medio');

-- Opciones para Mega Banquete (Gaseosa)
SET @prod_id = (SELECT id FROM productos WHERE nombre='Mega Banquete' LIMIT 1);
INSERT INTO grupos_opciones (producto_id, nombre, tipo_seleccion) VALUES (@prod_id, 'Bebida Familiar', 'radio');
SET @grp_id = LAST_INSERT_ID();
INSERT INTO opciones_producto (grupo_id, nombre, precio_extra) VALUES 
(@grp_id, 'Pepsi 1.5L', 5.00),
(@grp_id, '7Up 1.5L', 5.00);

