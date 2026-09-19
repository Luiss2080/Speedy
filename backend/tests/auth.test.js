const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const express = require("express");
const jwt = require("jsonwebtoken");

const {
  getJwtSecret,
  hashPassword,
  isBcryptHash,
  requireAuth,
  requireSelf,
  signToken,
  verifyPassword,
  verifyToken,
} = require("../auth");
const { createAuthRouter } = require("../routes/auth");

// pool falso (mysql2/promise): responde segun el SQL y registra las llamadas.
function fakePool(handlers) {
  const calls = [];
  return {
    calls,
    async query(sql, params) {
      calls.push({ sql, params });
      const key = Object.keys(handlers).find((k) => sql.includes(k));
      return [key ? handlers[key](params) : []];
    },
  };
}

async function start(pool) {
  const app = express();
  app.use(express.json());
  app.use("/api", createAuthRouter(pool));
  app.get("/api/pagos/:usuario_id", requireAuth, requireSelf("usuario_id"), (req, res) =>
    res.json([]),
  );
  const server = await new Promise((r) => {
    const s = app.listen(0, () => r(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (method, path, body, token) => {
    const res = await fetch(base + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return { status: res.status, body: await res.json() };
  };
  return { call, close: () => server.close() };
}

describe("passwords", () => {
  test("bcrypt hash verifies; wrong password fails", async () => {
    const h = await hashPassword("clave-segura");
    assert.ok(isBcryptHash(h));
    assert.deepEqual(await verifyPassword("clave-segura", h), { ok: true, needsUpgrade: false });
    assert.equal((await verifyPassword("mala", h)).ok, false);
  });

  test("legacy plaintext accepted once and flagged for upgrade", async () => {
    assert.deepEqual(await verifyPassword("1234", "1234"), { ok: true, needsUpgrade: true });
    assert.equal((await verifyPassword("4321", "1234")).ok, false);
  });
});

describe("tokens", () => {
  test("round-trip, tamper, foreign secret, unsigned, expired", () => {
    assert.equal(verifyToken(signToken({ id: 12 })), 12);
    const [h, , s] = signToken({ id: 1 }).split(".");
    const forged = Buffer.from(JSON.stringify({ sub: "2" })).toString("base64url");
    assert.equal(verifyToken(`${h}.${forged}.${s}`), null);
    assert.equal(verifyToken(jwt.sign({ sub: "1" }, "otro-secreto")), null);
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
    assert.equal(verifyToken(`${b64({ alg: "none", typ: "JWT" })}.${b64({ sub: "1" })}.`), null);
    assert.equal(verifyToken(jwt.sign({ sub: "1" }, getJwtSecret(), { expiresIn: -10 })), null);
    assert.equal(verifyToken("basura"), null);
  });

  test("JWT_SECRET is required in production", () => {
    const saved = { ...process.env };
    try {
      delete process.env.JWT_SECRET;
      process.env.NODE_ENV = "production";
      assert.throws(() => getJwtSecret(), /JWT_SECRET/);
    } finally {
      process.env = saved;
    }
  });
});

describe("auth routes", () => {
  let hash;
  beforeEach(async () => {
    hash = await hashPassword("clave-segura");
  });

  test("login with hash returns a valid token; user has no password", async () => {
    const pool = fakePool({
      "FROM usuarios WHERE nombre": () => [{ id: 5, nombre: "Ana", email: "a@a.com", rol: "cliente", password: hash }],
    });
    const { call, close } = await start(pool);
    try {
      const r = await call("POST", "/api/login", { usuario: "a@a.com", password: "clave-segura" });
      assert.equal(r.status, 200);
      assert.equal(r.body.success, true);
      assert.equal(r.body.user.password, undefined);
      assert.equal(verifyToken(r.body.token), 5);
    } finally {
      close();
    }
  });

  test("login rejects a wrong password and an unknown user", async () => {
    const pool = fakePool({
      "FROM usuarios WHERE nombre": (p) => (p[0] === "a@a.com" ? [{ id: 5, password: hash }] : []),
    });
    const { call, close } = await start(pool);
    try {
      const bad = await call("POST", "/api/login", { usuario: "a@a.com", password: "mala" });
      const none = await call("POST", "/api/login", { usuario: "x@x.com", password: "mala" });
      assert.equal(bad.status, 401);
      assert.equal(none.status, 401);
      assert.equal(bad.body.token, undefined);
      assert.equal((await call("POST", "/api/login", { usuario: "a@a.com" })).status, 400);
    } finally {
      close();
    }
  });

  test("login upgrades a legacy plaintext password to bcrypt", async () => {
    const pool = fakePool({
      "FROM usuarios WHERE nombre": () => [{ id: 3, nombre: "Old", email: "o@o.com", rol: "cliente", password: "1234" }],
    });
    const { call, close } = await start(pool);
    try {
      const r = await call("POST", "/api/login", { usuario: "Old", password: "1234" });
      assert.equal(r.status, 200);
      const upd = pool.calls.find((c) => c.sql.startsWith("UPDATE usuarios SET password"));
      assert.ok(upd && isBcryptHash(upd.params[0]) && upd.params[1] === 3);
    } finally {
      close();
    }
  });

  test("profile: needs own token, never returns the password, hashes a new one", async () => {
    const pool = fakePool({
      "SELECT id, nombre, email, telefono, avatar, rol": () => [{ id: 5, nombre: "Ana", email: "a@a.com" }],
    });
    const { call, close } = await start(pool);
    try {
      assert.equal((await call("GET", "/api/usuarios/5")).status, 401);
      assert.equal((await call("GET", "/api/usuarios/5", null, signToken({ id: 6 }))).status, 403);
      const me = await call("GET", "/api/usuarios/5", null, signToken({ id: 5 }));
      assert.equal(me.status, 200);
      assert.equal(me.body.password, undefined);
      assert.ok(!pool.calls[0].sql.includes("SELECT *"));

      const body = { nombre: "Ana", email: "a@a.com", password: "nueva-clave" };
      assert.equal((await call("PUT", "/api/usuarios/5", body)).status, 401);
      assert.equal((await call("PUT", "/api/usuarios/5", body, signToken({ id: 6 }))).status, 403);
      assert.equal((await call("PUT", "/api/usuarios/5", body, signToken({ id: 5 }))).status, 200);
      const upd = pool.calls.find((c) => c.sql.startsWith("UPDATE usuarios SET nombre = ?, email = ?, password"));
      assert.ok(isBcryptHash(upd.params[2]));

      // sin contrasena nueva no se toca la columna password
      await call("PUT", "/api/usuarios/5", { nombre: "Ana", email: "a@a.com" }, signToken({ id: 5 }));
      const noPwd = pool.calls.at(-1);
      assert.ok(!noPwd.sql.includes("password"));
    } finally {
      close();
    }
  });

  test("requireAuth/requireSelf guard per-user resources", async () => {
    const { call, close } = await start(fakePool({}));
    try {
      assert.equal((await call("GET", "/api/pagos/5")).status, 401);
      assert.equal((await call("GET", "/api/pagos/5", null, "token-falso")).status, 401);
      assert.equal((await call("GET", "/api/pagos/5", null, signToken({ id: 9 }))).status, 403);
      assert.equal((await call("GET", "/api/pagos/5", null, signToken({ id: 5 }))).status, 200);
    } finally {
      close();
    }
  });
});
