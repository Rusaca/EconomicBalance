import { Router, Request, Response } from 'express';
import { authService } from '../../servicios/servicioNecesario';
import { enviarCorreoActivacion } from '../../servicios/CorreoService';
import crypto from 'crypto';
import UserModel from '../../modelos/modelos/UsuarioModel';  

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('Body recibido en /register:', req.body);
    const { nombre, apellidos, correo, password } = req.body;

    if (!nombre || !apellidos || !correo || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan campos obligatorios'
      });
    }

    const respuesta = await authService.registrarUsuario({
      nombre,
      apellidos,
      correo,
      password
    });

    if (!respuesta.ok) {
      return res.status(409).json(respuesta);
    }

    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado. Revisa tu correo para activar la cuenta.'
    });
  } catch (error) {
    console.error('Error en /register:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno en el registro'
    });
  }
});





router.post('/login', async (req: Request, res: Response) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan correo o password'
      });
    }

    const respuesta = await authService.loginUsuario({ correo, password });

    if (!respuesta.ok) {
      return res.status(401).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno en el login'
    });
  }
});

router.get('/users', async (_req: Request, res: Response) => {
  try {
    const respuesta = await authService.obtenerUsuarios();
    return res.status(200).json(respuesta);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: 'Error obteniendo usuarios'
    });
  }
});

router.get('/activar', async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;

    if (!token) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Token no proporcionado'
      });
    }

    const respuesta = await authService.activarCuenta(token);

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(200).json(respuesta);

  } catch (error) {
    console.error('Error en /activar:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error activando la cuenta'
    });
  }
});

router.post('/recuperar-password', async (req: Request, res: Response) => {
  try {
    console.log('BODY RECUPERAR PASSWORD:', req.body);

    const { correo } = req.body;
    const respuesta = await authService.recuperarPassword(correo);

    console.log('RESPUESTA RECUPERAR PASSWORD:', respuesta);

    return res.status(respuesta.ok ? 200 : 400).json(respuesta);
  } catch (error) {
    console.error('ERROR EN /recuperar-password:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error al recuperar la contraseña'
    });
  }
});


router.post('/restablecer-password', async (req: Request, res: Response) => {
  try {
    console.log('BODY RESTABLECER PASSWORD:', req.body);

    const respuesta = await authService.restablecerPassword(req.body);

    console.log('RESPUESTA RESTABLECER PASSWORD:', respuesta);

    return res.status(respuesta.ok ? 200 : 400).json(respuesta);
  } catch (error) {
    console.error('ERROR EN /restablecer-password:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error al restablecer la contraseña'
    });
  }
});


router.post('/login-google', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Falta el token de Google'
      });
    }

    const respuesta = await authService.loginGoogle(token);

    return res.status(respuesta.ok ? 200 : 400).json(respuesta);
  } catch (error) {
    console.error('Error en /login-google:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error en login con Google'
    });
  }
});

router.post('/register-google', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Falta el token de Google'
      });
    }

    const respuesta = await authService.registerGoogle(token);

    return res.status(respuesta.ok ? 200 : 400).json(respuesta);
  } catch (error) {
    console.error('Error en /register-google:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error en registro con Google'
    });
  }
});




export default router;