CREATE TABLE IF NOT EXISTS favoritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  producto_id INT NOT NULL,
  fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id),
  UNIQUE KEY unique_fav (usuario_id, producto_id)
);

-- Seed initial favorites for User 1
INSERT IGNORE INTO favoritos (usuario_id, producto_id) VALUES (1, 1), (1, 3);
