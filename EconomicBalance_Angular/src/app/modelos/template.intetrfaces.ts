export interface Campo {
  id: string;
  tipo: 'ingreso' | 'gasto';
  categoria: string;
  nombre: string;
  cantidad: number;
}

export interface Bloque {
  id: string;
  titulo: string;
  x: number;
  y: number;
  fijado: boolean;
  campos: Campo[];
}

export interface Plantilla {
  id: string;
  nombre: string;
  userId: string;
  blocks: Bloque[];
  createdAt?: string;
  updatedAt?: string;
}