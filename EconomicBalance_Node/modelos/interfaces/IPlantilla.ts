import { Document, Types } from 'mongoose';

export interface IMovimientoCampo {
  id: string;
  fecha: string;
  descripcion: string;
  importe: number;
}

export interface IReferenciaImportacion {
  templateId: string;
  templateNombre: string;
  bloqueId?: string;
  bloqueTitulo?: string;
  campoId?: string;
  campoConcepto?: string;
  importedAt: string;
}


export interface ICampo {
  id: string;
  tipo: 'ingreso' | 'gasto' | 'total';
  categoria: 'fijo' | 'variable' | 'resumen';
  concepto: string;
  importe: number;
  movimientos?: IMovimientoCampo[];
  importedFrom?: IReferenciaImportacion;
}


export interface IBloque {
  id: string;
  titulo: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fijado: boolean;
  campos: ICampo[];
  importedFrom?: IReferenciaImportacion;
}

export interface IGraficaPlantilla {
  id: string;
  bloqueId: string;
  titulo: string;
  tipo: 'bar' | 'pie' | 'doughnut' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  fijado: boolean;
  createdAt: string;
}

export interface IPlantilla extends Document {
  nombre: string;
  userId: Types.ObjectId;
  blocks: IBloque[];
  graficas?: IGraficaPlantilla[];
  createdAt?: Date;
  updatedAt?: Date;
}
