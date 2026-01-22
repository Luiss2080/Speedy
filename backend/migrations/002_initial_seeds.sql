-- Migration: Initial Seeds
-- Created at: 2026-01-22

-- Niveles
INSERT IGNORE INTO niveles_fidelidad (nombre, puntos_minimos, beneficios_json) VALUES
('Bronce', 0, '{"envio_gratis": false}'),
('Plata', 1000, '{"envio_gratis": "50% off"}'),
('Oro', 5000, '{"envio_gratis": true, "soporte_prioritario": true}');

-- Usuarios
INSERT IGNORE INTO usuarios (email, password, nombre, apellido, telefono, nivel_id) VALUES
('demo@user.com', 'demo123', 'Luis', 'Usuario', '999111222', 1);

-- Categorías
INSERT IGNORE INTO categorias (nombre, slug, icono, color) VALUES
('Hamburguesas', 'hamburguesas', 'hamburger', '#ffedd5'),
('Pizza', 'pizza', 'pizza-slice', '#fee2e2');

-- Restaurantes
INSERT IGNORE INTO restaurantes (nombre, tiempo_estimado_min, tiempo_estimado_max, costo_envio_base, categoria_id) VALUES
('Burger King', 25, 40, 5.00, 1),
('Pizza Hut', 40, 60, 7.00, 2);

-- Productos
INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen, categoria_interna, calorias) VALUES
(1, 'Whopper Doble', 'Doble carne a la parrilla, vegetales frescos y mayonesa.', 18.50, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', 'Hamburguesas', 900),
(1, 'Papas Supremas', 'Papas fritas con queso cheddar y tocino.', 12.00, 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054', 'Acompañamientos', 600);

-- Extras
INSERT INTO grupos_opciones (producto_id, nombre, tipo_seleccion) VALUES (1, 'Adicionales', 'checkbox');
SET @grp_id = LAST_INSERT_ID();
INSERT INTO opciones_producto (grupo_id, nombre, precio_extra) VALUES 
(@grp_id, 'Queso Extra', 1.50),
(@grp_id, 'Tocino', 2.00),
(@grp_id, 'Huevo Frito', 1.00);

INSERT INTO grupos_opciones (producto_id, nombre, tipo_seleccion, es_requerido) VALUES (1, 'Bebida', 'radio', TRUE);
SET @grp_id = LAST_INSERT_ID();
INSERT INTO opciones_producto (grupo_id, nombre, precio_extra) VALUES 
(@grp_id, 'Coca Cola', 0.00),
(@grp_id, 'Inka Cola', 0.00),
(@grp_id, 'Agua', 0.00);
