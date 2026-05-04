import { Injectable } from '@angular/core';
import { FetchNodeService } from './fetch-node';

export interface IRespuestaChat {
  reply: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {
  constructor(private http: FetchNodeService) {}

  async enviarMensaje(message: string): Promise<IRespuestaChat> {
    return await this.http.post('/tienda/chat', { message });
  }
}
