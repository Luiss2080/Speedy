-- Script de Configuración MySQL para 'Speedy'
-- Instrucciones: Importar este archivo en phpMyAdmin o ejecutar en consola MySQL.

-- 1. Crear Base de Datos
CREATE DATABASE IF NOT EXISTS Speedy;
USE Speedy;

-- 2. Crear Tablas

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  icono VARCHAR(50) NOT NULL,
  color VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS restaurantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  imagen TEXT,
  calificacion DECIMAL(3,1),
  tiempo_estimado VARCHAR(50),
  categoria_id INT,
  envio DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurante_id INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen TEXT,
  categoria VARCHAR(100),
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS direcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT DEFAULT 1,
  titulo VARCHAR(100) NOT NULL,
  direccion TEXT NOT NULL,
  referencia TEXT,
  icono VARCHAR(50) DEFAULT 'map-marker',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  estado VARCHAR(50) NOT NULL,
  restaurante VARCHAR(255),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- 3. Insertar Datos de Prueba (Seeders)

-- USUARIOS (IMPORTANTE: Debe insertarse ANTES que direcciones o pedidos)
INSERT INTO usuarios (nombre, email, password, avatar) VALUES 
('Usuario Test', 'demo@user.com', 'demo123', 'user-circle');

-- Categorías
INSERT INTO categorias (nombre, icono, color) VALUES 
('Hamburguesas', 'hamburger', '#ffedd5'), 
('Pizza', 'pizza-slice', '#fee2e2'),
('Sushi', 'fish', '#dcfce7'),
('Postres', 'ice-cream', '#f3e8ff'),
('Bebidas', 'glass-cheers', '#e0f2fe');

-- Restaurantes
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

-- Productos
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

-- Direcciones
INSERT INTO direcciones (usuario_id, titulo, direccion, referencia) VALUES
(1, 'Casa', 'Av. Larco 123, Miraflores', 'Frente al parque'),
(1, 'Oficina', 'Calle Begonias 450, San Isidro', 'Piso 5');