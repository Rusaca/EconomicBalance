import mongoose from 'mongoose';
import PlantillaModel from '../modelos/modelos/PlantillaModel';

export default class PlantillaService {
  public async crearPlantilla(data: { nombre: string; userId: string }) {
    const { nombre, userId } = data;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        ok: false,
        mensaje: 'userId no válido'
      };
    }

    const nuevaPlantilla = new PlantillaModel({
      nombre,
      userId,
      blocks: []
    });

    const guardada = await nuevaPlantilla.save();

    return {
      ok: true,
      mensaje: 'Plantilla creada correctamente',
      data: this.mapearPlantilla(guardada)
    };
  }

  public async obtenerPlantillaPorId(id: string, userId: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        ok: false,
        mensaje: 'Id de plantilla no válido'
      };
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        ok: false,
        mensaje: 'userId no válido'
      };
    }

    const plantilla = await PlantillaModel.findOne({ _id: id, userId });

    if (!plantilla) {
      return {
        ok: false,
        mensaje: 'Plantilla no encontrada'
      };
    }

    return {
      ok: true,
      mensaje: 'Plantilla obtenida correctamente',
      data: this.mapearPlantilla(plantilla)
    };
  }

  public async actualizarPlantilla(
    id: string,
    data: {
      nombre: string;
      userId: string;
      blocks: any[];
    }
  ) {
    const { nombre, userId, blocks } = data;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return {
        ok: false,
        mensaje: 'Id de plantilla no válido'
      };
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        ok: false,
        mensaje: 'userId no válido'
      };
    }

    const plantilla = await PlantillaModel.findOne({ _id: id, userId });

    if (!plantilla) {
      return {
        ok: false,
        mensaje: 'Plantilla no encontrada o no pertenece al usuario'
      };
    }

    plantilla.nombre = nombre;
    plantilla.blocks = Array.isArray(blocks) ? blocks : [];

    const actualizada = await plantilla.save();

    return {
      ok: true,
      mensaje: 'Plantilla actualizada correctamente',
      data: this.mapearPlantilla(actualizada)
    };
  }

  private mapearPlantilla(plantilla: any) {
    return {
      id: plantilla._id.toString(),
      nombre: plantilla.nombre,
      userId: plantilla.userId.toString(),
      blocks: plantilla.blocks || [],
      createdAt: plantilla.createdAt,
      updatedAt: plantilla.updatedAt
    };
  }
}