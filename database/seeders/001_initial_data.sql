-- 001_initial_data.sql
-- Datos iniciales para pruebas (Seeders)

-- 1. Categorías
INSERT INTO categorias (nombre, icono, color) VALUES 
('Hamburguesas', 'hamburger', '#ffedd5'), 
('Pizza', 'pizza-slice', '#fee2e2'),
('Sushi', 'fish', '#dcfce7'),
('Postres', 'ice-cream', '#f3e8ff'),
('Bebidas', 'glass-cheers', '#e0f2fe');

-- 2. Restaurantes
INSERT INTO restaurantes (nombre, descripcion, imagen, calificacion, tiempo_estimado, categoria_id, envio) VALUES
('Burger King', 'Hamburguesas a la parrilla', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add', 4.5, '30-40 min', 1, 5.0),
('McDonalds', 'Me encanta todo esto', 'https://images.unsplash.com/photo-1550547660-d9450f859349', 4.3, '15-20 min', 1, 3.5),
('Bembos', 'Como Bembos no hay otra', 'https://images.unsplash.com/photo-1561758033-d89a9ad46330', 4.7, '30 min', 1, 4.0),
('Pizza Hut', 'Pizzas y pastas', 'https://images.unsplash.com/photo-1590947132387-155cc02f3212', 4.2, '40-50 min', 2, 6.0),
('Papa Johns', 'Mejores ingredientes', 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 4.4, '35-45 min', 2, 5.5),
('Edo Sushi Bar', 'Sushi fusion nikkei', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 4.8, '50-60 min', 3, 8.0),
('Osaka', 'Cocina Nikkei de autor', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252', 4.9, '60 min', 3, 10.0),
('Starbucks', 'Café y postres', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93', 4.6, '15 min', 5, 2.0),
('Dunkin Donuts', 'Donas y cafe', 'https://images.unsplash.com/photo-1551024601-563799a6327c', 4.5, '20 min', 4, 3.0),
('Gelarti', 'Helados gourmet', 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 4.7, '25 min', 4, 4.5);

-- 3. Productos (Ejemplo representativo)
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria) VALUES
(1, 'Whopper Doble', 'Doble carne, queso, lechuga, tomate', 18.50, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Hamburguesas'),
(1, 'Whopper Jr', 'Versión pequeña del clásico', 12.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Hamburguesas'),
(2, 'Big Mac', 'Dos carnes, salsa especial, lechuga', 16.50, 'https://images.unsplash.com/photo-1550547660-d9450f859349', 'Hamburguesas'),
(2, 'McNuggets x10', 'Crujientes trozos de pollo', 14.00, 'https://images.unsplash.com/photo-1562967960-93d43d517c5f', 'Combos'),
(3, 'Hamburguesa Royal', 'Con huevo y plátano frito', 19.90, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5', 'Hamburguesas'),
(4, 'Pizza Pepperoni', 'Masa gruesa, pepperoni, queso extra', 35.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e', 'Pizza'),
(4, 'Pizza Hawaiana', 'Jamón y piña', 34.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591', 'Pizza'),
(5, 'Super Papa', 'Todas las carnes', 42.00, 'https://images.unsplash.com/photo-1574071318000-84318fd1c31a', 'Pizza'),
(6, 'Acevichado Maki', 'Relleno de langostino, cubierto de atún', 28.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', 'Sushi'),
(6, 'California Roll', 'Cangrejo, palta y pepino', 24.00, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252', 'Sushi'),
(7, 'Tiradito Nikkei', 'Finas láminas de pescado', 45.00, 'https://images.unsplash.com/photo-1553621042-f6e147245754', 'Sushi'),
(8, 'Frappuccino Mocha', 'Café, leche y chocolate con hielo', 14.50, 'https://images.unsplash.com/photo-1572490122747-3968b75cc699', 'Bebidas'),
(8, 'Croissant de Jamón', 'Caliente y crujiente', 12.00, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a', 'Bebidas'),
(9, 'Caja x6 Donas', 'Selección variada', 25.00, 'https://images.unsplash.com/photo-1551024601-563799a6327c', 'Postres'),
(9, 'Munchkins x20', 'Centros de dona', 18.00, 'https://images.unsplash.com/photo-1551024601-563799a6327c', 'Postres'),
(10, 'Helado 1 Litro', 'Sabores artesanales', 30.00, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Postres'),
(1, 'Papas Medianas', 'Clásicas y saladas', 6.90, 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054', 'Combos'),
(2, 'McFlurry Oreo', 'Helado de vainilla con galleta', 8.50, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb', 'Postres'),
(3, 'Inka Cola 1.5L', 'La bebida del Perú', 9.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97', 'Bebidas'),
(4, 'Pan de Ajo', '6 unidades con queso', 12.00, 'https://images.unsplash.com/photo-1573140247632-f84660f67126', 'Combos');

-- 4. Direcciones iniciales (Mock)
INSERT INTO direcciones (usuario_id, titulo, direccion, referencia) VALUES
(1, 'Casa', 'Av. Larco 123, Miraflores', 'Frente al parque'),
(1, 'Oficina', 'Calle Begonias 450, San Isidro', 'Piso 5');
