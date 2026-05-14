export interface IAjustes {
  idioma: 'es' | 'en';
  notificacionesEmail: boolean;
  notificacionesApp: boolean;
  modoOscuro: boolean;
  recordatorios: boolean;
  sincronizacion: boolean;
  autoguardado: boolean;
}

export interface IUsuario {
  _id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  password: string;

  activo?: boolean;
  tokenActivacion?: string;
  tokenRecuperacion?: string;
  expiracionTokenRecuperacion?: Date;

  telefono?: string;
  prefijoTelefono?: string;
  genero?: string;
  fotoPerfil?: string;
  ajustes?: IAjustes;
}
