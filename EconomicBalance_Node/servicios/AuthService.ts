import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import UserModel from '../modelos/modelos/UsuarioModel';
import { enviarCorreoActivacion } from './CorreoService';

export default class AuthService {

  // 🟢 REGISTRO CON EMAIL
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

    // 🔥 TOKEN DE ACTIVACIÓN
    const token = crypto.randomBytes(32).toString('hex');

    const nuevoUsuario = new UserModel({
      nombre,
      apellidos,
      correo: correo.toLowerCase(),
      password: passwordHash,
      activo: false,
      tokenActivacion: token
    });

    await nuevoUsuario.save();


    return {
      ok: true,
      mensaje: 'Revisa tu correo para activar la cuenta'
    };
  }

 public async activarCuenta(token: string) {

  const usuario = await UserModel.findOne({ tokenActivacion: token });

  if (!usuario) {
    return {
      ok: false,
      mensaje: 'Token inválido'
    };
  }

  if (usuario.activo) {
    return {
      ok: false,
      mensaje: 'Esta cuenta ya estaba activada'
    };
  }

  await UserModel.updateOne(
    { tokenActivacion: token },
    {
      $set: { activo: true },
      $unset: { tokenActivacion: "" }
    }
  );

  return {
    ok: true,
    mensaje: 'Cuenta activada correctamente'
  };
}



  // 🟢 LOGIN
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

    // 🔴 BLOQUEO SI NO ACTIVADO
    if (!usuario.activo) {
      return {
        ok: false,
        mensaje: 'Debes activar tu cuenta desde el correo'
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

  // 🟢 OBTENER USUARIOS
  public async obtenerUsuarios() {
    const usuarios = await UserModel.find().select('-password');

    return {
      ok: true,
      mensaje: 'Usuarios obtenidos correctamente',
      data: usuarios
    };
  }
}