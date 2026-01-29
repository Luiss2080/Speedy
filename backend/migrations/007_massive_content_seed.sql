-- Migration: Massive Content Seed
-- Created at: 2026-01-22

-- 1. Nuevas Categorías
INSERT IGNORE INTO categorias (nombre, slug, icono, color, orden_visual) VALUES
('Cafetería', 'cafeteria', 'coffee', '#f5ebe0', 5),
('Japonesa', 'japonesa', 'fish', '#dbeafe', 6),
('Parrillas', 'parrillas', 'fire', '#fee2e2', 7),
('Postres', 'postres', 'cookie-bite', '#fce7f3', 8),
('Hamburguesas', 'hamburguesas', 'hamburger', '#ffedd5', 2);

-- 2. Nuevos Restaurantes
INSERT INTO restaurantes (nombre, descripcion, tiempo_estimado_min, tiempo_estimado_max, costo_envio_base, categoria_id, imagen_logo, imagen_portada, latitud, longitud) VALUES
('Starbucks', 'Café de calidad y snacks', 15, 25, 3.50, (SELECT id FROM categorias WHERE slug='cafeteria'), 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93', -12.119, -77.030),

('Bembos', 'Como a ti te gusta', 25, 40, 4.50, (SELECT id FROM categorias WHERE slug='hamburguesas'), 'https://upload.wikimedia.org/wikipedia/commons/8/88/Bembos_logo.png', 'https://images.unsplash.com/photo-1550547660-d9450f859349', -12.122, -77.035),

('Edo Sushi Bar', 'La mejor fusión nikkei', 40, 60, 6.00, (SELECT id FROM categorias WHERE slug='japonesa'), 'https://pbs.twimg.com/profile_images/1118949807536975872/tA20K-b__400x400.png', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', -12.100, -77.040),

('La Bistecca', 'Parrillas y pastas ilimitadas', 45, 70, 7.00, (SELECT id FROM categorias WHERE slug='parrillas'), 'https://media-cdn.tripadvisor.com/media/photo-s/05/e6/5d/7c/la-bistecca.jpg', 'https://images.unsplash.com/photo-1544025162-d76690b68695', -12.095, -77.025),

('Manolo', 'Churros y tradición', 20, 35, 3.00, (SELECT id FROM categorias WHERE slug='postres'), 'https://media-cdn.tripadvisor.com/media/photo-s/0e/cc/0a/dc/churros-rellenos.jpg', 'https://images.unsplash.com/photo-1624324378932-4d22e0322301', -12.120, -77.028);

-- 3. Productos (Para los nuevos restaurantes)

-- Starbucks
SET @sb_id = (SELECT id FROM restaurantes WHERE nombre='Starbucks' LIMIT 1);
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria_interna) VALUES
(@sb_id, 'Caramel Frappuccino', 'Dulce y refrescante con crema batida', 18.50, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', 'Bebidas Frías'),
(@sb_id, 'Cappuccino', 'Espresso y leche vaporizada', 12.00, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d', 'Bebidas Calientes'),
(@sb_id, 'Croissant de Jamón y Queso', 'Clásico desayuno', 14.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a', 'Comida');

-- Bembos
SET @bb_id = (SELECT id FROM restaurantes WHERE nombre='Bembos' LIMIT 1);
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria_interna) VALUES
(@bb_id, 'Hamburguesa Royal', 'Queso, huevo y tocino', 24.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Hamburguesas'),
(@bb_id, 'Papas Tumbao', 'Papas fritas con queso y hot dog', 16.90, 'https://images.unsplash.com/photo-1630384060421-a4379e0274bb', 'Complementos');

-- Edo Sushi
SET @edo_id = (SELECT id FROM restaurantes WHERE nombre='Edo Sushi Bar' LIMIT 1);
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria_interna) VALUES
(@edo_id, 'Acevichado Roll', 'Nuestro clásico bestseller', 39.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 'Makis'),
(@edo_id, 'Sashimi Variado', 'Cortes frescos del día', 45.00, 'https://images.unsplash.com/photo-1534483854371-b723386bebbb', 'Sashimi');

-- La Bistecca
SET @lb_id = (SELECT id FROM restaurantes WHERE nombre='La Bistecca' LIMIT 1);
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria_interna) VALUES
(@lb_id, 'Bife Angosto 300g', 'Jugoso corte a la parrilla', 65.00, 'https://images.unsplash.com/photo-1600891964092-4316c288032e', 'Carnes'),
(@lb_id, 'Fettuccine a la Huancaína', 'Con lomo saltado', 48.00, 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb', 'Pastas');

-- Manolo
SET @man_id = (SELECT id FROM restaurantes WHERE nombre='Manolo' LIMIT 1);
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria_interna) VALUES
(@man_id, 'Churros Rellenos (3 unid)', 'Rellenos de manjarblanco o chocolate', 18.00, 'https://images.unsplash.com/photo-1624324378932-4d22e0322301', 'Churros'),
(@man_id, 'Chocolate Caliente', 'Espeso estilo español', 15.00, 'https://images.unsplash.com/photo-1544787219-7f47ccb76544', 'Bebidas');


-- 4. Nuevos Repartidores
INSERT INTO repartidores (nombre, telefono, dni, foto_perfil, tipo_vehiculo, placa_vehiculo, modelo_vehiculo, estado, latitud_actual, longitud_actual) VALUES
('Carlos Veloz', '999888771', '40000001', 'https://randomuser.me/api/portraits/men/32.jpg', 'moto', 'MC-9988', 'Yamaha FZ', 'disponible', -12.120, -77.030),
('Ana Rápida', '999888772', '40000002', 'https://randomuser.me/api/portraits/women/44.jpg', 'bicicleta', NULL, 'Trek Marlin', 'disponible', -12.122, -77.033),
('Miguel Auto', '999888773', '40000003', 'https://randomuser.me/api/portraits/men/85.jpg', 'auto', 'ABC-123', 'Toyota Yaris', 'disponible', -12.115, -77.025),
('Sofia Scooter', '999888774', '40000004', 'https://randomuser.me/api/portraits/women/65.jpg', 'moto', 'SC-2023', 'Honda Elite', 'disponible', -12.125, -77.035),
('Jorge Delivery', '999888775', '40000005', 'https://randomuser.me/api/portraits/men/12.jpg', 'moto', 'JD-5555', 'Pulsar 200', 'ocupado', -12.118, -77.028);
