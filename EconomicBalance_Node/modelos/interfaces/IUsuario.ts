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
}

