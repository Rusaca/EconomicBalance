import mongoose, { Schema } from 'mongoose';
import { ICampoMaestro } from '../interfaces/ICampoMaestro';

const CampoMaestroSchema = new Schema<ICampoMaestro>(
  {
    nombre: { type: String, required: true, trim: true },
    tipo: { type: String, enum: ['ingreso', 'gasto'], required: true },
    categoria: { type: String, enum: ['fijo', 'variable'], required: true },
    scope: { type: String, enum: ['system', 'user'], required: true, default: 'user' },
    userId: { type: Schema.Types.ObjectId, ref: 'usuarios', default: null },
    activo: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'campos_maestros'
  }
);

CampoMaestroSchema.index({ scope: 1, userId: 1, nombre: 1 }, { unique: false });

export default mongoose.model<ICampoMaestro>('campos_maestros', CampoMaestroSchema);
