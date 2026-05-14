import mongoose from 'mongoose';
import { IMetaAhorro } from '../modelos/interfaces/IMetaAhorro';
import { MetaAhorroModel } from '../modelos/modelos/MetaAhorroModel';
import PlantillaModel from '../modelos/modelos/PlantillaModel';
import { enviarSmsYGuardarNotificacion } from './AuthService';
import { enviarCorreoResumen } from './CorreoService';
import UserModel from '../modelos/modelos/UsuarioModel';

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

  async editarMeta(
    id: string,
    userId: string,
    payload: IMetaAhorro
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    return MetaAhorroModel.findOneAndUpdate(
      {
        _id: id,
        userId
      },
      {
        titulo: payload.titulo,
        objetivo: payload.objetivo,
        actual: payload.actual,
        fechaLimite: payload.fechaLimite
      },
      {
        new: true
      }
    ).lean();
  }

  async enviarResumenCorreo(data: any) {
    try {
      const { metas, resumenMeses, correoDestino, usuarioId } = data;

      const resultado = await enviarCorreoResumen(
        usuarioId,
        correoDestino,
        metas,
        resumenMeses
      );

      if ((resultado as any)?.ok === false) {
        return resultado;
      }

      return { ok: true, mensaje: 'Correo enviado correctamente.' };

    } catch (error) {
      console.error(error);
      return { ok: false, mensaje: 'Error enviando el correo.' };
    }
  }



  async enviarResumenMovil(data: any) {
    try {
      const { resumenMeses, usuarioId, telefono, prefijoTelefono } = data;

      const usuario = await UserModel.findById(usuarioId);
      const nombre = usuario?.nombre || 'usuario';

      const hoy = new Date();
      const mesActual = hoy.toLocaleDateString('es-ES', { month: 'long' });
      const resumenMesActual = resumenMeses.find(
        (r: any) => r.mes.toLowerCase() === mesActual.toLowerCase()
      );

      const totalMes = resumenMesActual ? resumenMesActual.total : 0;

      const mensaje = `Este mes has ahorrado ${totalMes}€. Gracias, ${nombre}.`;

      const resultado = await enviarSmsYGuardarNotificacion({
        usuarioId,
        prefijoTelefono,
        telefono,
        titulo: 'Resumen mensual',
        mensaje
      });

      if ((resultado as any)?.ok === false) {
        return resultado;
      }

      return { ok: true, mensaje: 'Resumen enviado al móvil correctamente.' };

    } catch (error) {
      console.error(error);
      return { ok: false, mensaje: 'Error enviando el resumen al móvil.' };
    }
  }

}