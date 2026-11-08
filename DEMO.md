# Demo publica

Version de demostracion de Speedy: corre entera en el navegador, sin el
servidor de `backend/` y sin MySQL.

- **URL:** https://speedy-763.pages.dev
- **Usuario:** admin@hagamostech.com
- **Clave:** password

La sesion ya viene puesta, asi que normalmente no hace falta iniciar sesion.

## Como funciona

La rama `demo` agrega `src/demo/activarDemo.ts`. Se enciende solo cuando se
compila con `EXPO_PUBLIC_DEMO=true`: deja la sesion lista en el store
`auth-storage` de zustand e intercepta el `fetch` que usa
`src/servicios/BaseDeDatos.ts`, que en web apunta a http://localhost:3000/api.
Compilada sin esa variable, la rama se comporta igual que `master`.

`metro.config.js` cambia `react-native-maps` por `src/demo/MapaWeb.tsx` solo
cuando la plataforma es web: la libreria importa modulos nativos y rompe el
bundle del navegador. Android e iOS siguen con el mapa de verdad.

## Alcance

- Entra como administrador cualquiera que tenga el enlace. **No subir datos
  reales a esta demo.**
- Lo que se agregue (pedidos, direcciones, favoritos, metodos de pago) vive en
  memoria y se pierde al recargar.
- Los datos son inventados a proposito: no salen de `backend/migrations`, que
  trae hashes de contrasena de verdad. Las fotos son de Unsplash.
- Cupones de prueba: `SPEEDY20` y `ENVIOGRATIS`.

## Como correrla

```bash
npm install
EXPO_PUBLIC_DEMO=true npm run build:web
```

La salida queda en `dist/`.

En Cloudflare Pages: comando `npm run build:web`, carpeta de salida `dist` y
las variables `EXPO_PUBLIC_DEMO=true` y `NODE_VERSION=20`.

Nunca compilar la demo apuntando a una base real.
