import { Router, Request, Response } from 'express';
import { clienteService } from '../../servicios/servicioNecesario';

const router = Router();

router.post('/registro', async (req: Request, res: Response) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos obligatorios'
      });
    }

    const respuesta = await clienteService.registrarCliente({ nombre, email, password });

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado. Revisa tu correo para activar la cuenta.'
    });
  } catch (error) {
    console.error('Error en POST /api/cliente/registro:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error en el registro'
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan email o password'
      });
    }

    const respuesta = await clienteService.loginCliente({ email, password });

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error en POST /api/cliente/login:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error en el login'
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