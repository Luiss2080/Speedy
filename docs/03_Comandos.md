# 03_Comandos del Proyecto

## Scripts de Ejecución (`package.json`)

### Iniciar Proyecto (Recomendado)

```bash
npm run start:offline
```

_Inicia el servidor de desarrollo omitiendo comprobaciones de red (evita errores de fetch)._

### Iniciar Estándar

```bash
npx expo start
```

_Comando estándar de Expo._

### Limpiar Caché

```bash
npx expo start -c
```

_Útil si tienes problemas de estilos o dependencias "pegadas"._

## Verificación de Tipos

```bash
npx tsc --noEmit
```

_Ejecuta el compilador de TypeScript para buscar errores sin generar archivos._

## resetear Base de Datos

La base de datos se inicializa en `initDB` (BaseDeDatos.ts). Para resetearla completamente, puede ser necesario limpiar los datos de la app en el dispositivo o emulador.
