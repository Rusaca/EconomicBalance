import { Document } from 'mongoose';

export interface IUsuario extends Document {
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;
//   createdAt?: Date;
//   updatedAt?: Date;
}