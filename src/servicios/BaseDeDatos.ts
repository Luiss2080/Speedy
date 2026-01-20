import * as SQLite from "expo-sqlite";

export const initDB = async () => {
  const db = await SQLite.openDatabaseAsync("delivery_app.db");

  // Habilitar claves foráneas
  await db.execAsync("PRAGMA foreign_keys = ON;");

  // Crear tablas
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT
    );

    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      icono TEXT NOT NULL,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS restaurantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      imagen TEXT,
      calificacion REAL,
      tiempo_estimado TEXT
    );

    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurante_id INTEGER NOT NULL,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      imagen TEXT,
      FOREIGN KEY (restaurante_id) REFERENCES restaurantes(id)
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
      total REAL NOT NULL,
      estado TEXT NOT NULL,
      FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE IF NOT EXISTS detalle_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      producto_id INTEGER NOT NULL,
      cantidad INTEGER NOT NULL,
      precio_unitario REAL NOT NULL,
      FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
      FOREIGN KEY (producto_id) REFERENCES productos(id)
    );
  `);

  console.log("Base de datos inicializada");
  return db;
};

// Función helper para semillas (datos de prueba)
export const seedDB = async () => {
  const db = await SQLite.openDatabaseAsync("delivery_app.db");

  // Verificar si hay datos
  const result = await db.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM categorias",
  );

  if (result && result.count === 0) {
    await db.execAsync(`
      INSERT INTO categorias (nombre, icono, color) VALUES 
      ('Hamburguesas', 'hamburger', '#ffedd5'), 
      ('Pizza', 'pizza-slice', '#fee2e2'),
      ('Sushi', 'fish', '#dcfce7');

      INSERT INTO restaurantes (nombre, descripcion, imagen, calificacion, tiempo_estimado) VALUES
      ('Burger King', 'Hamburguesas a la parrilla', 'https://images.unsplash.com/photo-1571091718767-18b5b1457add', 4.5, '30-40 min'),
      ('Pizza Hut', 'Pizzas y pastas', 'https://images.unsplash.com/photo-1590947132387-155cc02f3212', 4.2, '40-50 min');
      
      INSERT INTO productos (restaurante_id, nombre, descripcion, precio, imagen) VALUES
      (1, 'Whopper Doble', 'Doble carne, queso, lechuga, tomate', 8.50, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
      (2, 'Pizza Pepperoni', 'Masa gruesa, pepperoni, queso extra', 12.00, 'https://images.unsplash.com/photo-1628840042765-356cda07504e');
    `);
    console.log("Datos de prueba insertados");
  }
};
