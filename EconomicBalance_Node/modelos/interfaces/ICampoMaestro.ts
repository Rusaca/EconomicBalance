import { Document, Types } from 'mongoose';

export interface ICampoMaestro extends Document {
  nombre: string;
  tipo: 'ingreso' | 'gasto';
  categoria: 'fijo' | 'variable';
  scope: 'system' | 'user';
  userId?: Types.ObjectId | null;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
