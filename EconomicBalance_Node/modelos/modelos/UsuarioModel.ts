import mongoose, { Schema } from 'mongoose';
import { IUsuario } from '../interfaces/IUsusario';

const UserSchema = new Schema< IUsuario>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    apellidos: {
      type: String,
      required: true,
      trim: true
    },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    // timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IUsuario>('usuarios', UserSchema);