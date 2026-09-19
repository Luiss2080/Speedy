const express = require("express");
const {
  hashPassword,
  requireAuth,
  requireSelf,
  signToken,
  verifyPassword,
} = require("../auth");

const MIN_PASSWORD = 4; // el cliente usa un PIN (ver loginUsuario); las cuentas de demo tienen claves cortas

// Login y perfil de usuario. `pool` es el pool de mysql2/promise (inyectable para tests).
function createAuthRouter(pool) {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    try {
      const { usuario, password } = req.body || {};
      if (typeof usuario !== "string" || typeof password !== "string" || !usuario || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Datos incompletos" });
      }

      // Busca por nombre O email y verifica la clave en el servidor (ya no va en el WHERE).
      const [rows] = await pool.query(
        "SELECT * FROM usuarios WHERE nombre = ? OR email = ?",
        [usuario, usuario],
      );

      let user = null;
      let needsUpgrade = false;
      for (const row of rows) {
        const check = await verifyPassword(password, String(row.password));
        if (check.ok) {
          user = row;
          needsUpgrade = check.needsUpgrade;
          break;
        }
      }
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Credenciales inválidas" });
      }

      // Upgrade-on-login: las cuentas en texto plano se re-guardan con bcrypt.
      if (needsUpgrade) {
        await pool.query("UPDATE usuarios SET password = ? WHERE id = ?", [
          await hashPassword(password),
          user.id,
        ]);
      }

      let repartidorInfo = null;
      if (user.rol === "repartidor") {
        const [repRows] = await pool.query(
          "SELECT * FROM repartidores WHERE usuario_id = ?",
          [user.id],
        );
        if (repRows.length > 0) repartidorInfo = repRows[0];
      }

      res.json({
        success: true,
        token: signToken(user),
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
          avatar: user.avatar,
        },
        repartidor: repartidorInfo,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error en el servidor" });
    }
  });

  // Perfil: nunca devuelve la contrasena y solo el propio usuario puede leerlo/editarlo.
  router.get("/usuarios/:id", requireAuth, requireSelf("id"), async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT id, nombre, email, telefono, avatar, rol FROM usuarios WHERE id = ?",
        [req.params.id],
      );
      if (rows.length === 0)
        return res.status(404).json({ error: "Usuario no encontrado" });
      res.json(rows[0]);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  });

  router.put("/usuarios/:id", requireAuth, requireSelf("id"), async (req, res) => {
    try {
      const { nombre, email, password } = req.body || {};
      if (!nombre || !email) {
        return res
          .status(400)
          .json({ success: false, message: "Nombre y email son obligatorios" });
      }
      if (password !== undefined && password !== null && password !== "") {
        if (typeof password !== "string" || password.length < MIN_PASSWORD) {
          return res.status(400).json({
            success: false,
            message: `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`,
          });
        }
        await pool.query(
          "UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?",
          [nombre, email, await hashPassword(password), req.params.id],
        );
      } else {
        // Sin contrasena nueva se conserva la actual (antes se intentaba escribir NULL/undefined).
        await pool.query(
          "UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?",
          [nombre, email, req.params.id],
        );
      }
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error al actualizar usuario" });
    }
  });

  return router;
}

module.exports = { createAuthRouter };
