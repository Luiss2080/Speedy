const mysql = require("mysql2/promise");
require("dotenv").config();

const NEW_PRODUCTS = [
  // Tacos
  {
    nombre: "Tacos al Pastor",
    descripcion: "3 tacos con piña, cilantro y cebolla",
    precio: 65,
    categoria_kw: "Tacos",
  },
  {
    nombre: "Tacos de Asada",
    descripcion: "3 tacos de sirloin con guacamole",
    precio: 85,
    categoria_kw: "Tacos",
  },
  {
    nombre: "Gringas de Pastor",
    descripcion: "Tortilla de harina con queso y carne al pastor",
    precio: 50,
    categoria_kw: "Tacos",
  },

  // Sushi
  {
    nombre: "Sushi California Roll",
    descripcion: "Rollo con pepino, aguacate y surimi",
    precio: 120,
    categoria_kw: "Sushi",
  },
  {
    nombre: "Sushi Dragon Roll",
    descripcion: "Rollo empanizado con camarón y queso crema",
    precio: 145,
    categoria_kw: "Sushi",
  },
  {
    nombre: "Nigiri Salmón",
    descripcion: "2 piezas de arroz con salmón fresco",
    precio: 60,
    categoria_kw: "Sushi",
  },

  // Ensaladas
  {
    nombre: "Ensalada César",
    descripcion: "Lechuga romana, crutones, parmesano y aderezo",
    precio: 95,
    categoria_kw: "Ensaladas",
  },
  {
    nombre: "Ensalada Griega",
    descripcion: "Pepino, tomate, aceitunas negras y queso feta",
    precio: 110,
    categoria_kw: "Ensaladas",
  },

  // Bebidas
  {
    nombre: "Refresco Coca-Cola",
    descripcion: "Lata 355ml",
    precio: 25,
    categoria_kw: "Bebidas",
  },
  {
    nombre: "Agua de Jamaica",
    descripcion: "Natural 1 Litro",
    precio: 35,
    categoria_kw: "Bebidas",
  },
  {
    nombre: "Jugo Verde",
    descripcion: "Nopal, piña, apio y naranja",
    precio: 45,
    categoria_kw: "Bebidas",
  },

  // Postres
  {
    nombre: "Pastel de Chocolate",
    descripcion: "Rebanada con ganache oscuro",
    precio: 75,
    categoria_kw: "Postres",
  },
  {
    nombre: "Helado de Vainilla",
    descripcion: "Dos bolas con chispas",
    precio: 40,
    categoria_kw: "Postres",
  },

  // Pizza (More variety)
  {
    nombre: "Pizza Hawaiana",
    descripcion: "Jamón, piña y extra queso",
    precio: 180,
    categoria_kw: "Pizza",
  },
  {
    nombre: "Pizza Vegerariana",
    descripcion: "Champiñones, pimientos y cebolla",
    precio: 190,
    categoria_kw: "Pizza",
  },
];

async function seedProducts() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "Speedy",
  });

  try {
    console.log("Seeding products...");

    // We need a restaurant ID to attach these to.
    // Let's get the first available restaurant or create a generic one.
    const [rests] = await connection.query(
      "SELECT id FROM restaurantes LIMIT 1",
    );
    let restId = 1;
    if (rests.length > 0) {
      restId = rests[0].id;
    } else {
      console.log("No restaurants found, skipping seed (or insert one first)");
      return;
    }

    for (const p of NEW_PRODUCTS) {
      // Insert product
      // Note: categoria_kw is just for us to know what it is, we don't insert it into a column since 'categoria' column doesn't exist on products table (based on previous check)
      // We rely on the Name/Description for the inference logic we built.

      await connection.query(
        `INSERT INTO productos (restaurante_id, nombre, descripcion, precio, disponible, imagen) 
             VALUES (?, ?, ?, ?, 1, NULL)`,
        [restId, p.nombre, p.descripcion, p.precio],
      );
      console.log(`Inserted: ${p.nombre}`);
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await connection.end();
  }
}

seedProducts();
