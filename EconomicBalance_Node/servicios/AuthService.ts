import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import UserModel from '../modelos/modelos/UsuarioModel';
import { enviarCorreoActivacion, enviarCorreoRecuperacion } from './CorreoService';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default class AuthService {


  // REGISTRO CON EMAIL
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
    await enviarCorreoActivacion(correo.toLowerCase(), token);

    return {
      ok: true,
      mensaje: 'Revisa tu correo para activar la cuenta'
    };
  }

  // ACTIVAR CUENTA
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
        $unset: { tokenActivacion: '' }
      }
    );

    return {
      ok: true,
      mensaje: 'Cuenta activada correctamente'
    };
  }

  // LOGIN
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

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return {
        ok: false,
        mensaje: 'JWT_SECRET no configurado'
      };
    }

    const token = jwt.sign(
      {
        id: usuario._id.toString(),
        correo: usuario.correo
      },
      secret,
      {
        expiresIn: '1d'
      }
    );

    return {
      ok: true,
      mensaje: 'Login correcto',
      data: {
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          correo: usuario.correo
        }
      }
    };
  }

  // OBTENER USUARIOS
  public async obtenerUsuarios() {
    const usuarios = await UserModel.find().select('-password');

    return {
      ok: true,
      mensaje: 'Usuarios obtenidos correctamente',
      data: usuarios
    };
  }

  // RECUPERAR PASSWORD
 public async recuperarPassword(correo: string) {
  console.log('CORREO RECIBIDO:', correo);

  const usuario = await UserModel.findOne({
    correo: correo.toLowerCase()
  });

  console.log('USUARIO ENCONTRADO:', usuario);

  if (!usuario) {
    return {
      ok: false,
      mensaje: 'No existe un usuario con ese correo'
    };
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiracion = new Date(Date.now() + 1000 * 60 * 30);

  console.log('TOKEN NUEVO GENERADO:', token);
  console.log('EXPIRACION NUEVA:', expiracion);

  await UserModel.updateOne(
    { _id: usuario._id },
    {
      $set: {
        tokenRecuperacion: token,
        expiracionTokenRecuperacion: expiracion
      }
    }
  );

  const usuarioActualizado = await UserModel.findById(usuario._id);
  console.log('USUARIO ACTUALIZADO TRAS GUARDAR TOKEN:', usuarioActualizado);

  const enlace = `http://localhost:4200/restablecer-password?token=${token}`;
  console.log('ENLACE ENVIADO EN CORREO:', enlace);

  await enviarCorreoRecuperacion(usuario.correo, enlace);

  return {
    ok: true,
    mensaje: 'Correo de recuperación enviado'
  };
}




  // RESTABLECER PASSWORD
  public async restablecerPassword(data: { token: string; password: string }) {
  const { token, password } = data;

  console.log('TOKEN RECIBIDO EN RESTABLECER:', token);
  console.log('PASSWORD RECIBIDA EN RESTABLECER:', password);

  const usuario = await UserModel.findOne({
    tokenRecuperacion: token,
    expiracionTokenRecuperacion: { $gt: new Date() }
  });

  console.log('USUARIO ENCONTRADO EN RESTABLECER:', usuario);

  if (!usuario) {
    const usuarioSoloToken = await UserModel.findOne({ tokenRecuperacion: token });
    console.log('USUARIO SOLO POR TOKEN:', usuarioSoloToken);

    return {
      ok: false,
      mensaje: 'Token inválido o expirado'
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await UserModel.updateOne(
    { _id: usuario._id },
    {
      $set: { password: passwordHash },
      $unset: {
        tokenRecuperacion: '',
        expiracionTokenRecuperacion: ''
      }
    }
  );

  return {
    ok: true,
    mensaje: 'Contraseña actualizada correctamente'
  };
}


 public async loginGoogle(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return {
        ok: false,
        mensaje: 'No se pudo obtener la información de Google'
      };
    }

    const correo = payload.email.toLowerCase();

    const usuario = await UserModel.findOne({ correo });

    if (!usuario) {
      return {
        ok: false,
        mensaje: 'No existe una cuenta registrada con ese correo de Google'
      };
    }

    if (!usuario.activo) {
      return {
        ok: false,
        mensaje: 'Debes activar tu cuenta desde el correo'
      };
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return {
        ok: false,
        mensaje: 'JWT_SECRET no configurado'
      };
    }

    const jwtToken = jwt.sign(
      {
        id: usuario._id.toString(),
        correo: usuario.correo
      },
      secret,
      {
        expiresIn: '1d'
      }
    );

    return {
      ok: true,
      mensaje: 'Login con Google correcto',
      data: {
        token: jwtToken,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          correo: usuario.correo
        }
      }
    };
  } catch (error) {
    console.error('Error en loginGoogle:', error);

    return {
      ok: false,
      mensaje: 'Error en login con Google'
    };
  }
}

public async registerGoogle(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return {
        ok: false,
        mensaje: 'No se pudo obtener la información de Google'
      };
    }

    const correo = payload.email.toLowerCase();
    const nombreCompleto = payload.name || '';
    const partesNombre = nombreCompleto.trim().split(' ');
    const nombre = partesNombre[0] || 'Usuario';
    const apellidos = partesNombre.slice(1).join(' ') || '';

    const usuarioExistente = await UserModel.findOne({ correo });

    if (usuarioExistente) {
      return {
        ok: false,
        mensaje: 'Ya existe un usuario con ese correo'
      };
    }

    const tokenActivacion = crypto.randomBytes(32).toString('hex');
    const passwordTemporal = crypto.randomBytes(32).toString('hex');
    const passwordHash = await bcrypt.hash(passwordTemporal, 10);

    const nuevoUsuario = new UserModel({
      nombre,
      apellidos,
      correo,
      password: passwordHash,
      activo: false,
      tokenActivacion
    });

    await nuevoUsuario.save();
    await enviarCorreoActivacion(correo, tokenActivacion);

    return {
      ok: true,
      mensaje: 'Registro con Google correcto. Revisa tu correo para activar la cuenta.'
    };
  } catch (error) {
    console.error('Error en registerGoogle:', error);

    return {
      ok: false,
      mensaje: 'Error en registro con Google'
    };
  }
}



}

