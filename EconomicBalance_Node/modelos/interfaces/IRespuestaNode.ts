export interface IRespuestaNode {
    //estrucutra de todas las respuestas del server a las peticiones del cliente
  ok: boolean;
  mensaje: string;
  data?: any;
}