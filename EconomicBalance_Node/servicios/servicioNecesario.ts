import Cliente from '../modelos/modelos/UsuarioModel';
import Plantilla from '../modelos/modelos/PlantillaModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const clienteService = {
  registrarCliente: async ({ nombre, email, password }: any) => {
    try {
      const existe = await Cliente.findOne({ email });

      if (existe) {
        return {
          ok: false,
          mensaje: 'El usuario ya existe'
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const nuevoCliente = new Cliente({
        nombre,
        email,
        password: passwordHash
      });

      await nuevoCliente.save();

      return {
        ok: true,
        mensaje: 'Usuario registrado correctamente'
      };
    } catch (error) {
      console.error('Error en registrarCliente:', error);
      return {
        ok: false,
        mensaje: 'Error al registrar usuario'
      };
    }
  },

  loginCliente: async ({ email, password }: any) => {
    try {
      const cliente = await Cliente.findOne({ email });

      if (!cliente) {
        return {
          ok: false,
          mensaje: 'Usuario no encontrado'
        };
      }

      const passwordValido = await bcrypt.compare(password, cliente.password);

      if (!passwordValido) {
        return {
          ok: false,
          mensaje: 'Contraseña incorrecta'
        };
      }

      const token = jwt.sign(
        { id: cliente._id, email: cliente.correo },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      return {
        ok: true,
        mensaje: 'Login correcto',
        data: {
          token,
          usuario: {
            id: cliente._id,
            nombre: cliente.nombre,
            email: cliente.correo
          }
        }
      };
    } catch (error) {
      console.error('Error en loginCliente:', error);
      return {
        ok: false,
        mensaje: 'Error en el login'
      };
    }
  }
};

export const plantillaService = {
  crearPlantilla: async ({ nombre, userId, blocks, graficas }: any) => {
    try {
      const nuevaPlantilla = new Plantilla({
        nombre,
        userId,
        blocks,
        graficas: Array.isArray(graficas) ? graficas : []
      });

      const guardada = await nuevaPlantilla.save();

      return {
        ok: true,
        data: guardada
      };
    } catch (error) {
      console.error('Error en crearPlantilla:', error);
      return {
        ok: false,
        mensaje: 'Error creando la plantilla'
      };
    }
  },

  getPlantillaById: async (id: string) => {
    try {
      const plantilla = await Plantilla.findById(id);

      if (!plantilla) {
        return {
          ok: false,
          mensaje: 'Plantilla no encontrada'
        };
      }

      return {
        ok: true,
        data: plantilla
      };
    } catch (error) {
      console.error('Error en getPlantillaById:', error);
      return {
        ok: false,
        mensaje: 'Error obteniendo la plantilla'
      };
    }
  },

  obtenerPlantillasPorUsuario: async (userId: string) => {
    try {
      const plantillas = await Plantilla.find({ userId }).sort({ updatedAt: -1 });

      return {
        ok: true,
        data: plantillas
      };
    } catch (error) {
      console.error('Error en obtenerPlantillasPorUsuario:', error);
      return {
        ok: false,
        mensaje: 'Error obteniendo las plantillas'
      };
    }
  },

  obtenerPlantillaPorId: async (id: string, userId: string) => {
    try {
      const plantilla = await Plantilla.findOne({ _id: id, userId });

      if (!plantilla) {
        return {
          ok: false,
          mensaje: 'Plantilla no encontrada'
        };
      }

      return {
        ok: true,
        data: plantilla
      };
    } catch (error) {
      console.error('Error en obtenerPlantillaPorId:', error);
      return {
        ok: false,
        mensaje: 'Error obteniendo la plantilla'
      };
    }
  },

  actualizarPlantilla: async (id: string, data: any) => {
    try {
      const { userId, nombre, blocks, graficas } = data;

      const actualizada = await Plantilla.findOneAndUpdate(
        { _id: id, userId },
        { nombre, blocks, graficas: Array.isArray(graficas) ? graficas : [] },
        { new: true }
      );

      if (!actualizada) {
        return {
          ok: false,
          mensaje: 'Plantilla no encontrada'
        };
      }

      return {
        ok: true,
        data: actualizada
      };
    } catch (error) {
      console.error('Error en actualizarPlantilla:', error);
      return {
        ok: false,
        mensaje: 'Error actualizando la plantilla'
      };
    }
  }
};
