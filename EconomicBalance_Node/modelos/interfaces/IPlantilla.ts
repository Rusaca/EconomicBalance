import { Document, Types } from 'mongoose';

export interface ICampo {
  id: string;
  tipo: 'ingreso' | 'gasto' | 'total';
  categoria: string;
  nombre: string;
  cantidad: number;
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