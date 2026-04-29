import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import UserModel from '../modelos/modelos/UsuarioModel';
import { enviarCorreoActivacion, enviarCorreoBienvenida, enviarCorreoRecuperacion } from './CorreoService';

function getGoogleClientId(): string {
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();

  if (!googleClientId) {
    throw new Error('GOOGLE_CLIENT_ID no configurado');
  }

  return googleClientId;
}
export default class AuthService {

  // REGISTRO CON EMAIL
  public async registrarUsuario(data: {
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string;
    prefijoTelefono: string;
    password: string;
  }) {
    const { nombre, apellidos, correo, telefono, prefijoTelefono, password } = data;

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
      telefono: telefono.trim(),
      prefijoTelefono: prefijoTelefono || '+34',
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
        mensaje: 'Token invalido'
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
    await enviarCorreoBienvenida(usuario.correo, usuario.nombre);

    return {
      ok: true,
      mensaje: 'Cuenta activada correctamente',
      nombre: usuario.nombre
    };
  }


  // LOGIN
  public async loginUsuario(data: { identificador: string; password: string }) {
    const { identificador, password } = data;

    const valor = identificador.trim();
    const esCorreo = valor.includes('@');

    let usuario;

    if (esCorreo) {
      usuario = await UserModel.findOne({
        correo: valor.toLowerCase()
      });
    } else {
      const telefonoLimpio = valor.replace(/\D/g, '');

      usuario = await UserModel.findOne({
        telefono: telefonoLimpio
      });
    }

    if (!usuario) {
      return {
        ok: false,
        mensaje: 'Correo o contrasena incorrectos'
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
        mensaje: 'Correo o contrasena incorrectos'
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
          correo: usuario.correo,
          telefono: usuario.telefono,
          prefijoTelefono: usuario.prefijoTelefono,
          genero: usuario.genero,
          fotoPerfil: usuario.fotoPerfil
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
      mensaje: 'Correo de recuperacion enviado'
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
        mensaje: 'Token invalido o expirado'
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
      mensaje: 'Contrasena actualizada correctamente'
    };
  }

  public async loginGoogle(token: string) {
    try {
      const googleClientId = getGoogleClientId();
      const client = new OAuth2Client(googleClientId);

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId
      });

      const payload = ticket.getPayload();
      const email = payload?.email;

      if (!email) {
        return {
          ok: false,
          mensaje: 'No se pudo obtener la informacion de Google'
        };
      }

      const correo = email.toLowerCase();
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
            correo: usuario.correo,
            telefono: usuario.telefono,
            prefijoTelefono: usuario.prefijoTelefono,
            genero: usuario.genero,
            fotoPerfil: usuario.fotoPerfil
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
      const googleClientId = getGoogleClientId();
      const client = new OAuth2Client(googleClientId);

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId
      });

      const payload = ticket.getPayload();
      const email = payload?.email;

      if (!email) {
        return {
          ok: false,
          mensaje: 'No se pudo obtener la informacion de Google'
        };
      }

      const correo = email.toLowerCase();

      const nombreGoogle = (payload?.given_name || '').trim();
      const apellidoGoogle = (payload?.family_name || '').trim();
      const nombreCompleto = (payload?.name || '').trim();

      let nombre = nombreGoogle;
      let apellidos = apellidoGoogle;

      if (!nombre && nombreCompleto) {
        const partes = nombreCompleto.split(' ').filter(Boolean);
        nombre = partes[0] || 'Usuario';
        apellidos = partes.slice(1).join(' ');
      }

      if (!nombre) {
        nombre = 'Usuario';
      }

      if (!apellidos) {
        apellidos = 'Sin apellidos';
      }

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

  public async actualizarPerfil(data: {
    id: string;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono?: string;
    prefijoTelefono?: string;
    genero?: string;
    fotoPerfil?: string;
  }) {
    const { id, nombre, apellidos, correo, telefono, prefijoTelefono, genero, fotoPerfil } = data;

    try {
      const usuario = await UserModel.findById(id);

      if (!usuario) {
        return {
          ok: false,
          mensaje: 'Usuario no encontrado'
        };
      }

      usuario.nombre = nombre.trim();
      usuario.apellidos = apellidos.trim();
      usuario.correo = correo.toLowerCase().trim();
      usuario.telefono = telefono?.trim() || '';
      usuario.prefijoTelefono = prefijoTelefono || '+34';
      usuario.genero = genero || '';
      usuario.fotoPerfil = fotoPerfil || '';

      await usuario.save();

      return {
        ok: true,
        mensaje: 'Perfil actualizado correctamente',
        data: {
          usuario: {
            id: usuario._id,
            nombre: usuario.nombre,
            apellidos: usuario.apellidos,
            correo: usuario.correo,
            telefono: usuario.telefono,
            prefijoTelefono: usuario.prefijoTelefono,
            genero: usuario.genero,
            fotoPerfil: usuario.fotoPerfil
          }
        }
      };
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      return {
        ok: false,
        mensaje: 'No se pudo actualizar el perfil'
      };
    }
  }

async subirFoto(file: File) {
  const formData = new FormData();
  formData.append('foto', file);

  const response = await fetch('http://localhost:3000/api/cliente/subir-foto', {
    method: 'POST',
    body: formData
  });

  return await response.json();
}

}
