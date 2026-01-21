# 04_Metodología de Desarrollo

## Flujo de Trabajo

1.  **Diseño (Vista)**: Se crean los componentes visuales en `src/vistas`. Se usa `StyleSheet` separado en `src/estilos` para mantener limpieza.
2.  **Lógica (Controlador)**: Toda la lógica (estados, llamadas a BD, validaciones) se abstrae en Custom Hooks dentro de `src/controladores`. Las Vistas solo deben "pintar" datos.
3.  **Datos (Modelo/Servicio)**:
    - Las interfaces TS definen la estructura.
    - `BaseDeDatos.ts` centraliza las operaciones SQL.
    - Se usa un patrón "Seed" para poblar datos iniciales si la DB está vacía.

## Patrones Utilizados

- **Separation of Concerns (SoC)**: Vistas tontas, Controladores inteligentes.
- **Provider Pattern**: Para estados globales (Favoritos, Carrito) que necesitan ser accesibles desde cualquier lugar.
- **Persistence**: SQLite para datos críticos (Usuarios, Direcciones, Pedidos) en lugar de AsyncStorage (que es solo clave-valor).

## Estándares

- Nombres de archivos en PascalCase (`MiComponente.tsx`).
- Variables y funciones en camelCase (`miFuncion`).
- Interfaces en PascalCase (`MiInterfaz`).
