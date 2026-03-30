import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayloadPersonalizado {
  id: string;
  correo: string;
}

export interface AuthRequest extends Request {
  usuario?: JwtPayloadPersonalizado;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Token no proporcionado'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Formato de token inválido'
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        ok: false,
        mensaje: 'JWT_SECRET no configurado en el servidor'
      });
    }

    const decoded = jwt.verify(token, secret) as JwtPayloadPersonalizado;

    req.usuario = {
      id: decoded.id,
      correo: decoded.correo
    };

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Token inválido o expirado'
    });
  }
};