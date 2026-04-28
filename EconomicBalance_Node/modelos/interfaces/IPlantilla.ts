import { Document, Types } from 'mongoose';

export interface IMovimientoCampo {
  id: string;
  fecha: string;
  descripcion: string;
  importe: number;
}


export interface ICampo {
  id: string;
  tipo: 'ingreso' | 'gasto' | 'total';
  categoria: 'fijo' | 'variable' | 'resumen';
  concepto: string;
  importe: number;
  movimientos?: IMovimientoCampo[];
}


export interface IBloque {
  id: string;
  titulo: string;
  x: number;
  y: number;
  fijado: boolean;
  campos: ICampo[];
}

export interface IPlantilla extends Document {
  nombre: string;
  userId: Types.ObjectId;
  blocks: IBloque[];
  createdAt?: Date;
  updatedAt?: Date;
}