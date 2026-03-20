import { Router, Request, Response } from 'express';
import { plantillaService } from '../../servicios/servicioNecesario';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { nombre, userId } = req.body;

    if (!nombre || !userId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan nombre o userId'
      });
    }

    const respuesta = await plantillaService.crearPlantilla({ nombre, userId });

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(201).json(respuesta);
  } catch (error) {
    console.error('Error en POST /api/plantillas:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error creando la plantilla'
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const userId = req.query.userId as string;

    if (!id) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Falta el id de la plantilla'
      });
    }

    if (!userId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Falta userId'
      });
    }

    const respuesta = await plantillaService.obtenerPlantillaPorId(id, userId);

    if (!respuesta.ok) {
      return res.status(404).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error en GET /api/plantillas/:id:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error obteniendo la plantilla'
    });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { nombre, userId, blocks } = req.body;

    if (!id) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Falta el id de la plantilla'
      });
    }

    if (!nombre || !userId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan nombre o userId'
      });
    }

    const respuesta = await plantillaService.actualizarPlantilla(id, {
      nombre,
      userId,
      blocks
    });

    if (!respuesta.ok) {
      return res.status(404).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error en PUT /api/plantillas/:id:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error actualizando la plantilla'
    });
  }
});

export default router;