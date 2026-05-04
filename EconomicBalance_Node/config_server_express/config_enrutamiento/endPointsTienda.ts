import { Request, Response, Router } from 'express';
import crypto from 'crypto';
import { generateChatReply } from '../../servicios/OpenAIService';
import {
  enviarCorreoSoporte,
  enviarConfirmacionSoporteUsuario
} from '../../servicios/CorreoService';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'El campo "message" es obligatorio'
      });
    }

    const reply = await generateChatReply(message);

    return res.json({ reply });
  } catch (error) {
    console.error('Error en /api/chat:', error);

    return res.status(500).json({
      error: 'No se pudo generar la respuesta del chatbot'
    });
  }
});

router.post('/soporte', async (req: Request, res: Response) => {
  try {
    const { nombre, correo, asunto, mensaje } = req.body;

    if (!nombre || !correo || !asunto || !mensaje) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Todos los campos son obligatorios'
      });
    }

    const tokenSoporte = crypto.randomBytes(16).toString('hex');

    await enviarCorreoSoporte(nombre, correo, asunto, mensaje, tokenSoporte);
    await enviarConfirmacionSoporteUsuario(correo, nombre, asunto, tokenSoporte);

    return res.json({
      ok: true,
      mensaje: 'Solicitud enviada correctamente',
      data: {
        token: tokenSoporte
      }
    });
  } catch (error) {
    console.error('Error enviando soporte:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'No se pudo enviar la solicitud de soporte'
    });
  }
});

export default router;
