# Plan Final: Funcionalidad Real y Estética Premium

Vamos a convertir los "mocks" visuales en funcionalidad real y elevar el nivel estético con degradados.

## 1. Funcionalidad: Carrito Global (React Context)

Actualmente, el carrito es visual. Implementaremos un estado global.

- **Archivo**: `src/context/ContextoCarrito.tsx`.
- **Funciones**: `agregarItem`, `removerItem`, `limpiarCarrito`, `total`.
- **Integración**:
  - `src/vistas/ProductoVista.tsx`: Usar `agregarItem`.
  - `src/vistas/CarritoVista.tsx`: Listar items reales y calcular total real.

## 2. Funcionalidad: Login Real con SQLite

- **Validación**: El Login verificará si existe el usuario en la tabla `usuarios`.
- **Seed**: Si no hay usuarios, crear uno por defecto (User: `admin`, Pin: `1234`).
- **Actualización**: Modificar `src/vistas/LoginVista.tsx`.

## 3. Estética Premium: Degradados (`expo-linear-gradient`)

Instalar `expo-linear-gradient` para dar profundidad al color rojo plano.

- **Login**: Fondo con degradado rojo suave.
- **Dashboard**: Header con degradado.
- **Botones**: Botones de acción principales con degradado horizontal.

## 4. Modernización Restante

Actualizar las vistas que faltaban por recibir el tratamiento "Modern UI" (Bordes 32px, Sombras Difusas):

- `src/estilos/PedidosEstilos.ts`
- `src/estilos/PerfilEstilos.ts`

## Pasos de Ejecución

1.  **Instalar**: `npx expo install expo-linear-gradient`.
2.  **Contexto**: Crear `ContextoCarrito`.
3.  **Estilos**: Actualizar `Perfil` y `Pedidos` y aplicar degradados en `Dashboard`/`Login`.
4.  **Lógica**: Conectar Login a DB y Carrito a Contexto.
