import { Router, Request, Response } from 'express';
import AuthService from '../../servicios/AuthService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();
const authService = new AuthService();

router.post('/registro', async (req: Request, res: Response) => {
  try {
    const { nombre, apellidos, correo, telefono, prefijoTelefono, password } = req.body;


    if (!nombre || !apellidos || !correo || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos obligatorios'
      });
    }

    const respuesta = await authService.registrarUsuario({
      nombre,
      apellidos,
      correo,
      telefono,
      prefijoTelefono,
      password
    });


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

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nombre, apellidos, correo, telefono, prefijoTelefono, password } = req.body;

    if (!nombre || !apellidos || !correo || !telefono || !prefijoTelefono || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos obligatorios'
      });
    }

    const respuesta = await authService.registrarUsuario({
      nombre,
      apellidos,
      correo,
      telefono,
      prefijoTelefono,
      password
    });

    return res.status(respuesta.ok ? 201 : 400).json(respuesta);
  } catch (error) {
    console.error('Error en POST /api/cliente/register:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error en el registro'
    });
  }
});


router.post('/login', async (req: Request, res: Response) => {
  try {
    const identificador = req.body.identificador ?? req.body.correo ?? req.body.email;
    const { password } = req.body;

    if (!identificador || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan identificador o password'
      });
    }

    const respuesta = await authService.loginUsuario({ identificador, password });

    if (!respuesta.ok) {
      return res.status(401).json(respuesta);
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


router.get('/users', async (_req: Request, res: Response) => {
  try {
    const respuesta = await authService.obtenerUsuarios();
    return res.status(200).json(respuesta);
  } catch (error) {
    console.error('Error en GET /api/cliente/users:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error obteniendo usuarios'
    });
  }
});

router.get('/activar', async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string | undefined;

    if (!token) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Falta token de activacion'
      });
    }

    const respuesta = await authService.activarCuenta(token);

    return res.status(respuesta.ok ? 200 : 400).json(respuesta);
  } catch (error) {
    console.error('Error en GET /api/cliente/activar:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al activar la cuenta'
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

    console.log('TOKEN RECIBIDO:', token); // 👈 AQUÍ


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

    console.log('TOKEN RECIBIDO:', token); // 👈 AQUÍ

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


router.put('/actualizar-perfil', async (req: Request, res: Response) => {
  try {
    const { id, nombre, apellidos, correo, telefono, prefijoTelefono, genero, fotoPerfil } = req.body;


    if (!id || !nombre || !apellidos || !correo) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Faltan datos obligatorios'
      });
    }

    const respuesta = await authService.actualizarPerfil({
      id,
      nombre,
      apellidos,
      correo,
      telefono,
      prefijoTelefono,
      genero,
      fotoPerfil
    });

    return res.status(respuesta.ok ? 200 : 400).json(respuesta);
  } catch (error) {
    console.error('Error en PUT /api/cliente/actualizar-perfil:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al actualizar el perfil'
    });
  }
});
const uploadsDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

router.post('/subir-foto', upload.single('foto'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se ha enviado ninguna imagen'
      });
    }

    const rutaFoto = `/uploads/${req.file.filename}`;

    return res.status(200).json({
      ok: true,
      mensaje: 'Foto subida correctamente',
      data: {
        fotoPerfil: rutaFoto
      }
    });
  } catch (error) {
    console.error('Error subiendo foto:', error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error al subir la foto'
    });
  }
});

export default router;
