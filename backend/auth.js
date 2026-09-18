const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { timingSafeEqual } = require("crypto");

const DEV_SECRET = "speedy-dev-only-secret-do-not-use-in-production";
const TOKEN_TTL = "12h";
const BCRYPT_ROUNDS = 10;

// JWT_SECRET es obligatorio en produccion; en desarrollo/tests se usa un valor de prueba explicito.
function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET es obligatorio en produccion");
  }
  return DEV_SECRET;
}

function signToken(user) {
  return jwt.sign({ sub: String(user.id) }, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: TOKEN_TTL,
  });
}

// Devuelve el id de usuario si el token es valido (firma + expiracion); si no, null.
function verifyToken(token) {
  try {
    const payload = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
    const id = Number(payload.sub);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch (e) {
    return null;
  }
}

const isBcryptHash = (v) => /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(String(v));

function hashPassword(plain) {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

// Si lo guardado no tiene formato bcrypt (cuentas antiguas) se compara en texto plano UNA vez
// y se pide re-guardar con hash (upgrade-on-login).
async function verifyPassword(plain, stored) {
  if (isBcryptHash(stored)) {
    return { ok: await bcrypt.compare(plain, stored), needsUpgrade: false };
  }
  const a = Buffer.from(String(plain));
  const b = Buffer.from(String(stored));
  const ok = a.length === b.length && timingSafeEqual(a, b);
  return { ok, needsUpgrade: ok };
}

// Exige `Authorization: Bearer <jwt>` valido y deja el id en req.userId.
function requireAuth(req, res, next) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || "");
  const id = m ? verifyToken(m[1]) : null;
  if (id === null) {
    return res.status(401).json({ success: false, message: "No autenticado" });
  }
  req.userId = id;
  next();
}

// El recurso pedido debe pertenecer al usuario del token. `where`: "params" o "body".
const requireSelf = (field, where = "params") => (req, res, next) => {
  if (Number(req[where][field]) !== req.userId) {
    return res.status(403).json({ success: false, message: "Prohibido" });
  }
  next();
};

module.exports = {
  getJwtSecret,
  signToken,
  verifyToken,
  isBcryptHash,
  hashPassword,
  verifyPassword,
  requireAuth,
  requireSelf,
};
