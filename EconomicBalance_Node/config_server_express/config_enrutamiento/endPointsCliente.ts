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

    return res.status(201).json(respuesta);
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

export default router;