import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../../middleware/authMiddleware';
import { campoMaestroService } from '../../servicios/servicioNecesario';

const router = Router();

router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Usuario no autenticado'
      });
    }

    const respuesta = await campoMaestroService.obtenerCampos(userId);

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error en GET /api/campos-maestros:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error obteniendo campos maestros'
    });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;
    const { nombre, tipo, categoria } = req.body;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Usuario no autenticado'
      });
    }

    const respuesta = await campoMaestroService.crearCampoUsuario(userId, {
      nombre,
      tipo,
      categoria
    });

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(201).json(respuesta);
  } catch (error) {
    console.error('Error en POST /api/campos-maestros:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error creando campo maestro'
    });
  }
});

router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.usuario?.id;
    const id = req.params.id as string;

    if (!userId) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Usuario no autenticado'
      });
    }

    const respuesta = await campoMaestroService.eliminarCampoUsuario(userId, id);

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error en DELETE /api/campos-maestros/:id:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error eliminando campo maestro'
    });
  }
});

export default router;
