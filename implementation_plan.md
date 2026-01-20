# Plan de Implementación: App de Delivery (Estilo PedidosYa)

El objetivo es transformar la estructura actual en una aplicación de delivery completa con navegación fluida. Se mantendrán los nombres en español.

## Estructura de Navegación Propuesta

### Navegación Principal (Tabs)

1.  **Inicio** (`index`): Dashboard principal con categorías, promociones y restaurantes recomendados.
2.  **Explorar/Buscar** (`explorar`): Buscador avanzado de comida y locales.
3.  **Pedidos** (`pedidos`): [NUEVO] Historial de pedidos y pedidos en curso.
4.  **Perfil** (`perfil`): Configuración de usuario, direcciones.

### Navegación Secundaria (Stack)

Pantallas a las que se accede desde las pestañas principales:

1.  **Detalle de Restaurante** (`restaurante/[id]`): Menú del restaurante, información.
2.  **Detalle de Producto** (`producto/[id]`): Selección de opciones, cantidad, agregar al carrito.
3.  **Carrito de Compras** (`carrito`): Resumen de pedido, botón de pagar.
4.  **Seguimiento de Pedido** (`seguimiento/[id]`): Estado del pedido en tiempo real.

## Cambios en Archivos

### 1. Nuevas Vistas (`src/vistas`)

- `[NUEVO] PedidosVista.tsx`: Lista de pedidos anteriores y actuales.
- `[NUEVO] RestauranteVista.tsx`: Header con imagen, lista de categorías y productos.
- `[NUEVO] ProductoVista.tsx`: Imagen grande, descripción, selector de cantidad.
- `[NUEVO] CarritoVista.tsx`: Lista de items, subtotal, total, botón pagar.
- `[NUEVO] SeguimientoVista.tsx`: Mapa (mock) y estado del pedido.

### 2. Nuevos Estilos (`src/estilos`)

- `[NUEVO] PedidosEstilos.ts`
- `[NUEVO] RestauranteEstilos.ts`
- `[NUEVO] ProductoEstilos.ts`
- `[NUEVO] CarritoEstilos.ts`
- `[NUEVO] SeguimientoEstilos.ts`

### 3. Rutas Expo Router (`app/`)

- `app/(tabs)/pedidos.tsx`: Nueva pestaña.
- `app/restaurante/[id].tsx`: Ruta dinámica.
- `app/producto/[id].tsx`: Ruta dinámica.
- `app/carrito.tsx`: Pantalla modal o stack.
- `app/seguimiento/[id].tsx`: Ruta dinámica.

### 4. Modificaciones

- `app/(tabs)/_layout.tsx`: Agregar tab de "Pedidos".
- `src/vistas/DashboardVista.tsx`: Adaptar para mostrar "Categorías" y "Restaurantes" que lleven a la vista de restaurante.

## Pasos de Ejecución

1.  Crear las nuevas vistas y sus estilos correspondientes en `src/`.
2.  Crear los archivos de ruta en `app/` conectando con las vistas.
3.  Actualizar el `_layout.tsx` de tabs.
4.  Modificar `DashboardVista` para incluir navegación a `RestauranteVista`.
5.  Verificar el flujo completo: Inicio -> Restaurante -> Producto -> Carrito.
