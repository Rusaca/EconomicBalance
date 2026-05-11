export interface MetaAhorro {
  id: string;
  titulo: string;
  objetivo: number;
  actual: number;
  fechaLimite: string;
  createdAt?: string;
}

export interface ResumenMensualAhorro {
  mes: string;
  anio: number;
  etiqueta: string;
  total: number;
}

export interface CrearMetaAhorroPayload {
  titulo: string;
  objetivo: number;
  actual: number;
  fechaLimite: string;
}

export interface ApiResponse<T> {
  ok: boolean;
  mensaje: string;
  data?: T;
}

