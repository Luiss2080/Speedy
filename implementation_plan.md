# Plan de Implementación: Rediseño Rojo, Login y Base de Datos

Se aplicará un rediseño completo basado en la tonalidad roja proporcionada, se implementará una pantalla de Login fiel al diseño de referencia y se configurará una base de datos SQLite local para la aplicación.

## 1. Rediseño Visual (Tonalidad Roja)

**Color Principal**: `#C21833` (Rojo Intenso - Estimado de la imagen).
**Estilo General**: Fondos rojos para pantallas principales/auth, tarjetas blancas redondeadas, texto oscuro sobre blanco.

### Tareas:

- **Actualizar Estilos Existentes**: Modificar todos los archivos en `src/estilos/` (Dashboard, Explorar, Perfil, etc.) para reemplazar azules/naranjas con el nuevo rojo corporativo.
- **Nueva Fuente/Tipografía**: Asegurar consistencia (propiedad visual).

## 2. Pantalla de Login (Nueva)

Implementar una vista que coincida con la imagen de referencia.

### Componentes:

- **Fondo**: Rojo completo (`#C21833`).
- **Logo/Header**: "Inicio de Sesión", texto de bienvenida.
- **Tarjeta Central (Blanca)**:
  - Input Usuario (Icono persona).
  - Input Contraseña (Estilo PIN o Clave).
  - Botón "Ingresar" (o validación automática).
- **Ubicación**: `app/index.tsx` pasará a ser el Login. El Dashboard se moverá a `app/(tabs)`.

### Archivos:

- `src/vistas/LoginVista.tsx`: Nueva vista.
- `src/estilos/LoginEstilos.ts`: Estilos específicos.
- `app/login.tsx` (o modificar `index.tsx` para redirigir).

## 3. Base de Datos (SQLite)

Implementar persistencia de datos local para la app de delivery.

### Tablas Necesarias:

1.  **usuarios**: id, nombre, email, password, avatar.
2.  **restaurantes**: id, nombre, descripcion, imagen, calificacion, tiempo_estimado.
3.  **categorias**: id, nombre, icono, color.
4.  **productos**: id, restaurante_id, nombre, descripcion, precio, imagen.
5.  **pedidos**: id, usuario_id, fecha, total, estado.
6.  **detalle_pedido**: id, pedido_id, producto_id, cantidad, precio_unitario.

### Archivos:

- `src/servicios/BaseDeDatos.ts`: Singleton para inicializar la conexión y crear tablas si no existen.
- `src/modelos/`: Definiciones de tipos/interfaces.

## Pasos de Ejecución

1.  **Base de Datos**: Crear el servicio de BD e inicializar tablas.
2.  **Login**: Crear vista y estilos. Configurar navegación para que sea la primera pantalla.
3.  **Rediseño Global**: Actualizar los estilos de las vistas existentes para usar la nueva paleta de colores.
