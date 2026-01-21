# 01_Estructura del Proyecto

## Estructura de Carpetas (MVC)

El proyecto sigue una arquitectura **Modelo-Vista-Controlador (MVC)** adaptada a React Native con Expo.

- **`app/`**: Rutas y navegación (Expo Router).
  - `_layout.tsx`: Configuración global (Contextos, Splash).
  - `(tabs)/`: Vistas principales con navegación por pestañas.

- **`src/`**: Código fuente principal.
  - **`modelos/`**: Definiciones de tipos TypeScript (`tipos.ts`).
  - **`vistas/`**: Pantallas de la UI (Componentes visuales).
  - **`controladores/`**: Lógica de negocio y gestión de estado (`hooks`).
  - **`estilos/`**: Hojas de estilo separadas por componente.
  - **`context/`**: Estados globales (Carrito, Favoritos).
  - **`servicios/`**: Conexiones externas (Base de Datos SQLite).

- **`assets/`**: Imágenes, fuentes y recursos estáticos.
