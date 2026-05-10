import mongoose, { Schema } from 'mongoose';
import { IPlantilla } from '../interfaces/IPlantilla';

const MovimientoCampoSchema = new Schema(
  {
    id: { type: String, required: true },
    fecha: { type: String, required: true },
    descripcion: { type: String, default: '' },
    importe: { type: Number, required: true, default: 0 }
  },
  { _id: false }
);

const ReferenciaImportacionSchema = new Schema(
  {
    templateId: { type: String, required: true },
    templateNombre: { type: String, required: true },
    bloqueId: { type: String, default: null },
    bloqueTitulo: { type: String, default: null },
    campoId: { type: String, default: null },
    campoConcepto: { type: String, default: null },
    importedAt: { type: String, required: true }
  },
  { _id: false }
);


const CampoSchema = new Schema(
  {
    id: { type: String, required: true },
    tipo: { type: String, enum: ['ingreso', 'gasto', 'total'], required: true },
    categoria: {
      type: String,
      enum: ['fijo', 'variable', 'resumen'],
      default: 'fijo'
    },
    concepto: { type: String, required: true, trim: true },
    importe: { type: Number, required: true, default: 0 },
    movimientos: { type: [MovimientoCampoSchema], default: [] },
    importedFrom: { type: ReferenciaImportacionSchema, default: null }
  },
  { _id: false }
);

const BloqueSchema = new Schema(
  {
    id: { type: String, required: true },
    titulo: { type: String, required: true, trim: true },
    x: { type: Number, required: true, default: 0 },
    y: { type: Number, required: true, default: 0 },
    width: { type: Number, required: true, default: 260 },
    height: { type: Number, required: true, default: 140 },
    fijado: { type: Boolean, default: false },
    campos: { type: [CampoSchema], default: [] },
    importedFrom: { type: ReferenciaImportacionSchema, default: null }
  },
  { _id: false }
);

const GraficaPlantillaSchema = new Schema(
  {
    id: { type: String, required: true },
    bloqueId: { type: String, required: true },
    titulo: { type: String, required: true, trim: true },
    tipo: { type: String, enum: ['bar', 'pie', 'doughnut', 'line'], required: true },
    x: { type: Number, required: true, default: 340 },
    y: { type: Number, required: true, default: 40 },
    width: { type: Number, required: true, default: 420 },
    height: { type: Number, required: true, default: 300 },
    fijado: { type: Boolean, required: true, default: false },
    createdAt: { type: String, required: true }
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
    },
    graficas: {
      type: [GraficaPlantillaSchema],
      default: []
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default mongoose.model<IPlantilla>('plantillas', PlantillaSchema);
