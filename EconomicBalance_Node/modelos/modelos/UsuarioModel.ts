import mongoose, { Schema } from 'mongoose';
import { IUsuario } from '../interfaces/IUsuario';

const UserSchema = new Schema<IUsuario>(
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
    },

    activo: {
      type: Boolean,
      default: false
    },

    tokenActivacion: {
      type: String,
      required: false
    }
  },
  {
    versionKey: false
  }
);

export default mongoose.model<IUsuario>('usuarios', UserSchema);
