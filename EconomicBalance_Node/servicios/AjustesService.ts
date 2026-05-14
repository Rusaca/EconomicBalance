import UsuarioModel from '../modelos/modelos/UsuarioModel';

export interface AjustesPayload {
  idioma: 'es' | 'en';
  notificacionesEmail: boolean;
  notificacionesApp: boolean;
  modoOscuro: boolean;
  recordatorios: boolean;
  sincronizacion: boolean;
  autoguardado: boolean;
}

export default class AjustesService {

  static obtenerAjustesPorDefecto(): AjustesPayload {
    return {
      idioma: 'es',
      notificacionesEmail: true,
      notificacionesApp: true,
      modoOscuro: false,
      recordatorios: true,
      sincronizacion: true,
      autoguardado: true
    };
  }

  static async obtenerAjustes(usuarioId: string) {
    if (!usuarioId) {
      return {
        ok: false,
        mensaje: 'Usuario no enviado'
      };
    }

    const usuario = await UsuarioModel.findById(usuarioId);

    if (!usuario) {
      return {
        ok: false,
        mensaje: 'Usuario no encontrado'
      };
    }

    return {
      ok: true,
      data: {
        ajustes: usuario.ajustes || this.obtenerAjustesPorDefecto()
      }
    };
  }

  static async guardarAjustes(usuarioId: string, payload: Partial<AjustesPayload>) {
    if (!usuarioId) {
      return {
        ok: false,
        mensaje: 'Usuario no enviado'
      };
    }

    const usuario = await UsuarioModel.findById(usuarioId);

    if (!usuario) {
      return {
        ok: false,
        mensaje: 'Usuario no encontrado'
      };
    }

    const actuales = usuario.ajustes || this.obtenerAjustesPorDefecto();

    usuario.ajustes = {
      idioma: payload.idioma ?? actuales.idioma,
      notificacionesEmail: payload.notificacionesEmail ?? actuales.notificacionesEmail,
      notificacionesApp: payload.notificacionesApp ?? actuales.notificacionesApp,
      modoOscuro: payload.modoOscuro ?? actuales.modoOscuro,
      recordatorios: payload.recordatorios ?? actuales.recordatorios,
      sincronizacion: payload.sincronizacion ?? actuales.sincronizacion,
      autoguardado: payload.autoguardado ?? actuales.autoguardado
    };

    await usuario.save();

    return {
      ok: true,
      mensaje: 'Ajustes guardados correctamente',
      data: {
        ajustes: usuario.ajustes
      }
    };
  }
}
