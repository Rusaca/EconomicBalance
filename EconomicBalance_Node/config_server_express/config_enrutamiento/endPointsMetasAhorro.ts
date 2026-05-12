import { Router, Request, Response } from 'express';
import { MetasAhorroService } from '../../servicios/MetasAhorroService';

const router = Router();
const metasAhorroService = new MetasAhorroService();


// =========================
// GET METAS
// =========================
router.get('/', async (req: Request, res: Response) => {
  try {

    const userId = String(req.query.userId || '');

    if (!userId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El userId es obligatorio.'
      });
    }

    const metas = await metasAhorroService.obtenerMetas(userId);

    return res.status(200).json({
      ok: true,
      mensaje: 'Metas cargadas correctamente.',
      data: { metas }
    });

  } catch (error) {
    console.error('Error obteniendo metas:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener las metas.'
    });
  }
});


// =========================
// POST CREAR META
// =========================
router.post('/', async (req: Request, res: Response) => {
  try {

    const { userId, titulo, objetivo, actual, fechaLimite } = req.body;

    if (!userId || !titulo || !fechaLimite || Number(objetivo) <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos obligatorios de la meta.'
      });
    }

    if (Number(actual || 0) < 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El ahorro actual no puede ser negativo.'
      });
    }

    if (Number(actual || 0) > Number(objetivo)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El ahorro actual no puede superar el objetivo.'
      });
    }

    const meta = await metasAhorroService.crearMeta({
      userId: String(userId),
      titulo: String(titulo).trim(),
      objetivo: Number(objetivo),
      actual: Number(actual || 0),
      fechaLimite: String(fechaLimite)
    });

    return res.status(201).json({
      ok: true,
      mensaje: 'Meta creada correctamente.',
      data: { meta }
    });

  } catch (error) {
    console.error('Error creando meta:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al crear la meta.'
    });
  }
});


// =========================
// PUT EDITAR META ⭐ NUEVO
// =========================
router.put('/:id', async (req: Request, res: Response) => {
  try {

    const id = String(req.params.id || '');
    const { userId, titulo, objetivo, actual, fechaLimite } = req.body;

    if (!id || !userId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos para actualizar la meta.'
      });
    }

    if (!titulo || Number(objetivo) <= 0 || !fechaLimite) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Datos inválidos para la meta.'
      });
    }

    if (Number(actual || 0) < 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El ahorro actual no puede ser negativo.'
      });
    }

    if (Number(actual) > Number(objetivo)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El ahorro no puede superar el objetivo.'
      });
    }

    const metaActualizada = await metasAhorroService.editarMeta(
      id,
      String(userId),
      {
        userId: String(userId),
        titulo: String(titulo).trim(),
        objetivo: Number(objetivo),
        actual: Number(actual || 0),
        fechaLimite: String(fechaLimite)
      }
    );

    if (!metaActualizada) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Meta no encontrada.'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Meta actualizada correctamente.',
      data: { meta: metaActualizada }
    });

  } catch (error) {
    console.error('Error actualizando meta:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al actualizar la meta.'
    });
  }
});


// =========================
// DELETE META
// =========================
router.delete('/:id', async (req: Request, res: Response) => {
  try {

    const id = String(req.params.id || '');
    const userId = String(req.query.userId || '');

    if (!id || !userId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos para eliminar la meta.'
      });
    }

    const metaEliminada = await metasAhorroService.eliminarMeta(id, userId);

    if (!metaEliminada) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Meta no encontrada.'
      });
    }

    return res.status(200).json({
      ok: true,
      mensaje: 'Meta eliminada correctamente.',
      data: null
    });

  } catch (error) {
    console.error('Error eliminando meta:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al eliminar la meta.'
    });
  }
});


// =========================
// RESUMEN MENSUAL
// =========================
router.get('/resumen-mensual', async (req: Request, res: Response) => {
  try {

    const userId = String(req.query.userId || '');

    if (!userId) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El userId es obligatorio.'
      });
    }

    const resumen = await metasAhorroService.obtenerResumenMensual(userId);

    return res.status(200).json({
      ok: true,
      mensaje: 'Resumen mensual cargado correctamente.',
      data: { resumen }
    });

  } catch (error) {
    console.error('Error obteniendo resumen mensual:', error);

    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener el resumen mensual.'
    });
  }
});

export default router;