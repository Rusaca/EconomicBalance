import Cliente from '../modelos/modelos/UsuarioModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PlantillaService from './PlantillaService';
import CampoMaestroService from './CampoMaestroService';

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

export const plantillaService = new PlantillaService();
export const campoMaestroService = new CampoMaestroService();

