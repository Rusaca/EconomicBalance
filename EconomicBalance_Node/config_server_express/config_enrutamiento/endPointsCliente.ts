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

 const usuario = await UserModel.findOne({ correo: correo.toLowerCase() });

await enviarCorreoActivacion(correo, usuario?.tokenActivacion || '');

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
export default router;