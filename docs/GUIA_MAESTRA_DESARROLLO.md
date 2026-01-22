# GUÍA MAESTRA DE DESARROLLO: PROYECTO "SPEEDY"

Esta guía define el estándar técnico, la estructura y las configuraciones necesarias para replicar o escalar la aplicación "Speedy". Está diseñada para ser interpretada tanto por desarrolladores humanos como por asistentes de IA.

---

## 1. Configuraciones Iniciales del Entorno

Para garantizar un desarrollo fluido, el entorno debe contar con las siguientes herramientas configuradas:

### **Requisitos del Sistema**

- **Node.js**: Versión LTS (v18 o superior).
- **Gestor de Paquetes**: `npm` (incluido con Node.js).
- **Base de Datos**: MySQL (vía **Laragon** o XAMPP). Se recomienda Laragon por su facilidad de uso en Windows.
- **Editor de Código**: Visual Studio Code (VS Code).
- **Dispositivo Móvil**: Aplicación **Expo Go** instalada (Android/iOS) para pruebas en tiempo real.

### **Extensiones VS Code Recomendadas**

- _ES7+ React/Redux/React-Native snippets_ (dsznajder)
- _Prettier - Code formatter_ (esbenp)
- _Expo Tools_ (Expo)

---

## 2. Inicialización y Dependencias

La aplicación se divide en dos componentes principales: **Frontend (App Móvil)** y **Backend (API Intermedia)**.

### **A. Frontend (React Native + Expo)**

Creación del proyecto base:

```bash
npx create-expo-app@latest Speedy --template tabs
```

**Librerías Esenciales a Instalar:**
Ejecutar el siguiente comando para instalar las dependencias nucleares del proyecto:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar expo-linear-gradient expo-image expo-haptics @react-navigation/native @react-navigation/bottom-tabs
```

- **`expo-router`**: Para navegación basada en archivos.
- **`expo-linear-gradient`**: Para los fondos estéticos (Estándar de Diseño Speedy).
- **`expo-constants`**: Crucial para la conexión dinámica por QR.

### **B. Backend (Node.js + Express)**

El backend actúa como puente entre la App Móvil y la Base de Datos MySQL.

Estructura inicial en carpeta `/backend`:

```bash
mkdir backend
cd backend
npm init -y
npm install express mysql2 cors dotenv
npm install -D nodemon
```

---

## 3. Estructura del Proyecto (Patrón MVC)

La organización de carpetas debe seguir estrictamente el patrón **Modelo-Vista-Controlador** (adaptado a React Native) para mantener el orden y la escalabilidad.

### **Árbol de Directorios**

```
Speedy/
├── app/                  # (CONTROLADOR DE RUTAS) Define la navegación
│   ├── (tabs)/           # Pantallas principales con barra inferior
│   ├── _layout.tsx       # Configuración global de navegación
│   └── index.tsx         # Pantalla de Login inicial
│
├── src/
│   ├── modelos/          # (MODELO) Interfaces TypeScript (Tipos de datos)
│   │   ├── Usuario.ts
│   │   └── Producto.ts
│   │
│   ├── vistas/           # (VISTA) Componentes visuales (UI pura)
│   │   ├── DashboardVista.tsx
│   │   ├── ExplorarVista.tsx
│   │   └── PerfilVista.tsx
│   │
│   ├── controladores/    # (CONTROLADOR/SERVICIOS) Lógica de negocio y Datos
│   │   └── BaseDeDatos.ts # Gestión de llamadas a la API
│   │
│   └── estilos/          # Estilos separados para limpieza
│       ├── GlobalEstilos.ts
│       └── DashboardEstilos.ts
│
├── backend/              # API INTERMEDIA
│   ├── server.js         # Lógica del servidor
│   └── .env              # Credenciales DB
│
└── database/             # ARTEFACTOS SQL
    └── mysql_setup.sql   # Script de creación de tablas
```

---

## 4. Conectividad Dinámica (QR Expo)

Para permitir que el celular se conecte al backend (tu PC) sin configurar manualmente la IP cada vez, se debe implementar la siguiente lógica en `src/controladores/BaseDeDatos.ts`.

**Lógica de Detección Automática de IP:**
Utiliza `expo-constants` para leer la IP del host donde corre el Metro Bundler.

```typescript
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiUrl = () => {
  // Web
  if (Platform.OS === "web") return "http://localhost:3000/api";

  // Dispositivo Físico (vía QR)
  const debuggerHost = Constants.expoConfig?.hostUri;
  const localhost = debuggerHost?.split(":")[0];
  if (localhost) return `http://${localhost}:3000/api`;

  // Emulador Android
  if (Platform.OS === "android") return "http://10.0.2.2:3000/api";

  return "http://localhost:3000/api";
};

export const API_URL = getApiUrl();
```

---

## 5. Diseño y Estética (Estándar Speedy)

- **Paleta de Colores**:
  - Primario: Gradiente Rojo (`#9f1239`, `#C21833`, `#e11d48`).
  - Fondos: Blanco puro o paneles semitransparentes sobre gradientes.
- **Responsividad**:
  - Todas las vistas raíz deben usar `SafeAreaView`.
  - Formularios deben usar `KeyboardAvoidingView`.

---

## 6. Pasos para Iniciar el Desarrollo

1.  **Base de Datos**: Importar `database/mysql_setup.sql` en phpMyAdmin.
2.  **Backend**: En una terminal, ir a `backend/` y ejecutar `npm run dev`.
3.  **Frontend**: En otra terminal, en la raíz, ejecutar `npx expo start`.
4.  **Prueba**: Escanear el código QR con Expo Go. La app detectará automáticamente el backend.

Esta guía asegura que cualquier nueva funcionalidad mantenga la coherencia, calidad y estructura del proyecto "Speedy".
