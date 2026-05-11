import mongoose, { Schema } from 'mongoose';

const MetaAhorroSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    titulo: {
      type: String,
      required: true,
      trim: true
    },
    objetivo: {
      type: Number,
      required: true,
      min: 0
    },
    actual: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    fechaLimite: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    collection: 'metas_ahorro'
  }
);

export const MetaAhorroModel = mongoose.model('metas_ahorro', MetaAhorroSchema);
