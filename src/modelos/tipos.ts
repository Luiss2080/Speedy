export interface Usuario {
  nombre: string;
  email: string;
  avatar: string;
}

export interface Estadistica {
  id: string;
  titulo: string;
  valor: string;
  icono: string;
  color: string;
}

export interface Accion {
  id: string;
  titulo: string;
  icono: string;
  colorFondo: string;
  colorIcono: string;
}

export interface Actividad {
  id: string;
  descripcion: string;
  tiempo: string;
  icono: string;
}

export interface Recurso {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  imagen: string; // URL o nombre de asset local
}

export interface Extra {
  id: string;
  nombre: string;
  precio: number;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  restaurante: string;
  calorias?: number;
  tiempoPreparacion?: string;
  extrasDisponibles?: Extra[];
}

export interface ItemCarrito {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  restaurante: string;
  extrasSeleccionados?: Extra[];
  instrucciones?: string;
}
