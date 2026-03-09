import bcrypt from 'bcryptjs';
import UserModel from '../modelos/modelos/UsuarioModel';

export default class AuthService {
  public async registrarUsuario(data: {
    nombre: string;
    apellidos: string;
    correo: string;
    password: string;
  }) {
    const { nombre, apellidos, correo, password } = data;

    const usuarioExistente = await UserModel.findOne({
      correo: correo.toLowerCase()
    });

    if (usuarioExistente) {
      return {
        ok: false,
        mensaje: 'Ya existe un usuario con ese correo'
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = new UserModel({
      nombre,
      apellidos,
      correo: correo.toLowerCase(),
      password: passwordHash
    });

    await nuevoUsuario.save();

    return {
      ok: true,
      mensaje: 'Usuario registrado correctamente',
      data: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        apellidos: nuevoUsuario.apellidos,
        email: nuevoUsuario.correo
      }
    };
  }

  public async loginUsuario(data: { correo: string; password: string }) {
    const { correo, password } = data;

    const usuario = await UserModel.findOne({
      correo: correo.toLowerCase()
    });

    if (!usuario) {
      return {
        ok: false,
        mensaje: 'Correo o contraseña incorrectos'
      };
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      return {
        ok: false,
        mensaje: 'Correo o contraseña incorrectos'
      };
    }

    return {
      ok: true,
      mensaje: 'Login correcto',
      data: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        correo: usuario.correo
      }
    };
  }

  public async obtenerUsuarios() {
    const usuarios = await UserModel.find().select('-password');

    return {
      ok: true,
      mensaje: 'Usuarios obtenidos correctamente',
      data: usuarios
    };
  }
}