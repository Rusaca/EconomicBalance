export interface MovimientoCampo {
  id: string;
  fecha: string;
  descripcion: string;
  importe: number;
}

export interface Campo {
  id: string;
  tipo: 'ingreso' | 'gasto' | 'total';
  categoria: 'fijo' | 'variable' | 'resumen';
  concepto: string;
  importe: number;
  movimientos?: MovimientoCampo[];
}

export interface Bloque {
  id: string;
  titulo: string;
  x: number;
  y: number;
  fijado: boolean;
  campos: Campo[];
}

export interface GraficaPlantilla {
  id: string;
  bloqueId: string;
  titulo: string;
  tipo: 'bar' | 'pie' | 'doughnut' | 'line';
  createdAt: string;
}

export interface Plantilla {
  id: string;
  nombre: string;
  userId: string;
  blocks: Bloque[];
  graficas?: GraficaPlantilla[];
  createdAt?: string;
  updatedAt?: string;
}
