import mongoose, { Schema } from 'mongoose';
import { IPlantilla } from '../interfaces/IPlantilla';

const CampoSchema = new Schema(
  {
    id: { type: String, required: true },
    tipo: { type: String, enum: ['ingreso', 'gasto', 'total'], required: true },
    categoria: { type: String, default: '' },
    nombre: { type: String, required: true, trim: true },
    cantidad: { type: Number, required: true, default: 0 }
  },
  { _id: false }
);

const BloqueSchema = new Schema(
  {
    id: { type: String, required: true },
    titulo: { type: String, required: true, trim: true },
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    fijado: { type: Boolean, default: false },
    campos: { type: [CampoSchema], default: [] }
  },
  { _id: false }
);

const PlantillaSchema = new Schema<IPlantilla>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'usuarios',
      required: true
    },
    blocks: {
      type: [BloqueSchema],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IPlantilla>('plantillas', PlantillaSchema);