import mongoose from 'mongoose';
import CampoMaestroModel from '../modelos/modelos/CampoMaestroModel';

type CrearCampoMaestroInput = {
  nombre: string;
  tipo: 'ingreso' | 'gasto';
  categoria: 'fijo' | 'variable';
};

export default class CampoMaestroService {
  public async obtenerCampos(userId: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return { ok: false, mensaje: 'userId no valido' };
      }

      const data = await CampoMaestroModel.find({
        activo: true,
        $or: [{ scope: 'system' }, { scope: 'user', userId }]
      }).sort({ scope: 1, nombre: 1 });

      return { ok: true, data };
    } catch (error) {
      console.error('Error en obtenerCampos:', error);
      return { ok: false, mensaje: 'Error obteniendo los campos maestros' };
    }
  }

  public async crearCampoUsuario(userId: string, payload: CrearCampoMaestroInput) {
    try {
      const nombre = payload.nombre?.trim();

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return { ok: false, mensaje: 'userId no valido' };
      }

      if (!nombre) {
        return { ok: false, mensaje: 'El nombre es obligatorio' };
      }

      if (!['ingreso', 'gasto'].includes(payload.tipo)) {
        return { ok: false, mensaje: 'Tipo no valido' };
      }

      if (!['fijo', 'variable'].includes(payload.categoria)) {
        return { ok: false, mensaje: 'Categoria no valida' };
      }

      const existente = await CampoMaestroModel.findOne({
        nombre: new RegExp(`^${nombre}$`, 'i'),
        scope: 'user',
        userId
      });

      if (existente) {
        return { ok: false, mensaje: 'Ya tienes un campo maestro con ese nombre' };
      }

      const data = await CampoMaestroModel.create({
        nombre,
        tipo: payload.tipo,
        categoria: payload.categoria,
        scope: 'user',
        userId,
        activo: true
      });

      return { ok: true, data, mensaje: 'Campo maestro creado correctamente' };
    } catch (error) {
      console.error('Error en crearCampoUsuario:', error);
      return { ok: false, mensaje: 'Error creando el campo maestro' };
    }
  }

  public async eliminarCampoUsuario(userId: string, id: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return { ok: false, mensaje: 'userId no valido' };
      }

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return { ok: false, mensaje: 'id no valido' };
      }

      const eliminado = await CampoMaestroModel.findOneAndDelete({
        _id: id,
        scope: 'user',
        userId
      });

      if (!eliminado) {
        return { ok: false, mensaje: 'No encontrado o no permitido' };
      }

      return { ok: true, mensaje: 'Campo maestro eliminado correctamente' };
    } catch (error) {
      console.error('Error en eliminarCampoUsuario:', error);
      return { ok: false, mensaje: 'Error eliminando el campo maestro' };
    }
  }
}
