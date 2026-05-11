import mongoose from 'mongoose';
import { IMetaAhorro } from '../modelos/interfaces/IMetaAhorro';
import { MetaAhorroModel } from '../modelos/modelos/MetaAhorroModel';
import PlantillaModel from '../modelos/modelos/PlantillaModel';

export class MetasAhorroService {
  async obtenerMetas(userId: string) {
    return MetaAhorroModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }

  async crearMeta(payload: IMetaAhorro) {
    const meta = new MetaAhorroModel(payload);
    return meta.save();
  }

  async eliminarMeta(id: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return MetaAhorroModel.findOneAndDelete({ _id: id, userId }).lean();
  }

  async obtenerResumenMensual(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }

    const plantillas = await PlantillaModel.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).lean();

    const mesesMap = new Map<string, { mes: string; anio: number; etiqueta: string; total: number }>();

    for (const plantilla of plantillas) {
      const fechaBase = plantilla.createdAt ? new Date(plantilla.createdAt) : new Date();
      const mes = fechaBase.toLocaleDateString('es-ES', { month: 'long' });
      const anio = fechaBase.getFullYear();
      const clave = `${anio}-${String(fechaBase.getMonth() + 1).padStart(2, '0')}`;

      let totalMes = 0;

      for (const block of plantilla.blocks || []) {
        for (const campo of block.campos || []) {
          const importe = Number(campo.importe || 0);

          if (campo.tipo === 'ingreso') totalMes += importe;
          if (campo.tipo === 'gasto') totalMes -= importe;
        }
      }

      const existente = mesesMap.get(clave);

      if (existente) {
        existente.total += totalMes;
      } else {
        mesesMap.set(clave, {
          mes,
          anio,
          etiqueta: `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${anio}`,
          total: totalMes
        });
      }
    }

    return Array.from(mesesMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, valor]) => valor);
  }
}
