-- Migration: Initial Schema (Full Ultimate Version)
-- Created at: 2026-01-22

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS 
  usuarios, categorias, restaurantes, productos, 
  grupos_opciones, opciones_producto, cupones, 
  cupones_usuario, direcciones, metodos_pago, 
  tarjetas, repartidores, pedidos, detalle_pedido, 
  resenas, tickets_soporte, mensajes_chat, 
  niveles_fidelidad, historial_puntos;
SET FOREIGN_KEY_CHECKS=1;

-- 1. Tablas de Control de Migraciones (Si no existe)
CREATE TABLE IF NOT EXISTS _migrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Esquema Principal
CREATE TABLE IF NOT EXISTS niveles_fidelidad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  puntos_minimos INT NOT NULL,
  beneficios_json JSON
);

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255),
  telefono VARCHAR(20),
  avatar VARCHAR(255) DEFAULT 'https://i.pravatar.cc/150?img=12',
  fecha_nacimiento DATE,
  genero ENUM('M', 'F', 'Otro', 'Prefiero no decir'),
  bio TEXT,
  preferencias_json JSON,
  puntos_actuales INT DEFAULT 0,
  nivel_id INT DEFAULT 1,
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_login TIMESTAMP,
  estado ENUM('activo', 'suspendido', 'banned') DEFAULT 'activo',
  FOREIGN KEY (nivel_id) REFERENCES niveles_fidelidad(id)
);

CREATE TABLE IF NOT EXISTS historial_puntos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cantidad INT NOT NULL,
  concepto VARCHAR(255),
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  icono VARCHAR(50) NOT NULL, 
  color VARCHAR(20) NOT NULL,
  imagen_cover VARCHAR(255),
  orden_visual INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS restaurantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  imagen_logo VARCHAR(255),
  imagen_portada VARCHAR(255),
  calificacion DECIMAL(3,1) DEFAULT 5.0,
  tiempo_estimado_min INT DEFAULT 30,
  tiempo_estimado_max INT DEFAULT 45,
  costo_envio_base DECIMAL(10,2) DEFAULT 0.00,
  pedido_minimo DECIMAL(10,2) DEFAULT 0.00,
  categoria_id INT,
  etiquetas_json JSON,
  direccion_texto VARCHAR(255),
  latitud DECIMAL(10,8),
  longitud DECIMAL(10,8),
  telefono_contacto VARCHAR(20),
  estado ENUM('abierto', 'cerrado', 'fuera_de_servicio') DEFAULT 'abierto',
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS horarios_restaurante (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurante_id INT NOT NULL,
  dia_semana TINYINT NOT NULL,
  hora_apertura TIME NOT NULL,
  hora_cierre TIME NOT NULL,
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  restaurante_id INT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  precio_descuento DECIMAL(10,2),
  imagen VARCHAR(255),
  calorias INT,
  es_vegetariano BOOLEAN DEFAULT FALSE,
  es_picante BOOLEAN DEFAULT FALSE,
  es_gluten_free BOOLEAN DEFAULT FALSE,
  tiempo_preparacion_min INT, 
  disponible BOOLEAN DEFAULT TRUE,
  categoria_interna VARCHAR(100),
  orden_visual INT DEFAULT 0,
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grupos_opciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  tipo_seleccion ENUM('checkbox', 'radio', 'cantidad') DEFAULT 'checkbox',
  minimo_seleccion INT DEFAULT 0,
  maximo_seleccion INT DEFAULT 10,
  es_requerido BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS opciones_producto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  grupo_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  precio_extra DECIMAL(10,2) DEFAULT 0.00,
  estado ENUM('disponible', 'agotado') DEFAULT 'disponible',
  FOREIGN KEY (grupo_id) REFERENCES grupos_opciones(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cupones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  descripcion VARCHAR(255),
  tipo_descuento ENUM('porcentaje', 'monto_fijo', 'envio_gratis') NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  pedido_minimo DECIMAL(10,2) DEFAULT 0.00,
  tope_reintegro DECIMAL(10,2),
  fecha_inicio DATETIME,
  fecha_expiracion DATETIME,
  limite_usos_total INT,
  limite_usos_usuario INT DEFAULT 1,
  activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS cupones_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cupon_id INT NOT NULL,
  fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pedido_id INT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS direcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(50),
  calle_numero TEXT NOT NULL,
  piso_depto VARCHAR(50),
  referencia TEXT,
  ciudad VARCHAR(100),
  codigo_postal VARCHAR(20),
  latitud DECIMAL(10,8),
  longitud DECIMAL(10,8),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS metodos_pago (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(50) NOT NULL,
  numero_enmascarado VARCHAR(20),
  titular VARCHAR(100),
  icono VARCHAR(50),
  es_predeterminado BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tarjetas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  marca VARCHAR(20),
  ultimos_cuatro CHAR(4),
  token_pasarela VARCHAR(255),
  expiracion_mes CHAR(2),
  expiracion_anio CHAR(4),
  es_billetera BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS repartidores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  dni VARCHAR(20) UNIQUE,
  foto_perfil VARCHAR(255),
  tipo_vehiculo ENUM('moto', 'bicicleta', 'auto') DEFAULT 'moto',
  placa_vehiculo VARCHAR(20),
  modelo_vehiculo VARCHAR(100),
  estado ENUM('disponible', 'ocupado', 'fuera_servicio') DEFAULT 'fuera_servicio',
  latitud_actual DECIMAL(10,8),
  longitud_actual DECIMAL(10,8),
  ultima_actualizacion TIMESTAMP,
  calificacion_promedio DECIMAL(3,1) DEFAULT 5.0
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo_seguimiento VARCHAR(20) UNIQUE,
  usuario_id INT NOT NULL,
  restaurante_id INT NOT NULL,
  repartidor_id INT,
  direccion_entrega_id INT,
  estado ENUM('pendiente', 'confirmado', 'preparando', 'listo_recojo', 'en_camino', 'entregado', 'cancelado') DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_entrega_estimada DATETIME,
  fecha_entrega_real DATETIME,
  subtotal DECIMAL(10,2) NOT NULL,
  costo_envio DECIMAL(10,2) NOT NULL,
  costo_servicio DECIMAL(10,2) DEFAULT 0.00,
  descuento_aplicado DECIMAL(10,2) DEFAULT 0.00,
  total_final DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(50),
  estado_pago ENUM('pendiente', 'pagado', 'reembolsado') DEFAULT 'pendiente',
  notas_instrucciones TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id),
  FOREIGN KEY (repartidor_id) REFERENCES repartidores(id),
  FOREIGN KEY (direccion_entrega_id) REFERENCES direcciones(id)
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  nombre_producto_snapshot VARCHAR(255),
  extras_json JSON,
  notas_item TEXT,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE IF NOT EXISTS resenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  usuario_id INT NOT NULL,
  restaurante_id INT NOT NULL,
  repartidor_id INT,
  calificacion_restaurante TINYINT NOT NULL,
  comentario_restaurante TEXT,
  calificacion_repartidor TINYINT,
  comentario_repartidor TEXT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
);

CREATE TABLE IF NOT EXISTS tickets_soporte (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  pedido_id INT,
  asunto VARCHAR(255) NOT NULL,
  estado ENUM('abierto', 'en_proceso', 'resuelto', 'cerrado') DEFAULT 'abierto',
  prioridad ENUM('baja', 'media', 'alta') DEFAULT 'media',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);

CREATE TABLE IF NOT EXISTS mensajes_chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT,
  pedido_id INT,
  emisor_tipo ENUM('usuario', 'soporte', 'repartidor') NOT NULL,
  emisor_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  leido BOOLEAN DEFAULT FALSE
);
