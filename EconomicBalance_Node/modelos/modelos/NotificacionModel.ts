import mongoose from 'mongoose';

const NotificacionSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    titulo: {
      type: String,
      required: true
    },
    mensaje: {
      type: String,
      required: true
    },
    leida: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Notificacion', NotificacionSchema, 'notificaciones');
