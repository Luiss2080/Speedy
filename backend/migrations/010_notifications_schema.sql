CREATE TABLE IF NOT EXISTS notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(100),
  mensaje TEXT,
  leido BOOLEAN DEFAULT FALSE,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO notificaciones (usuario_id, titulo, mensaje) VALUES 
(1, 'Bienvenido a Speedy', 'Gracias por registrarte. ¡Empieza a pedir ahora!'),
(1, 'Oferta Especial', 'Tienes un 20% de descuento en tu primera compra con el cupón WELCOME20.');
