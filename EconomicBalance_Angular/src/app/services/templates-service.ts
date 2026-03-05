import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class TemplatesService {

  // guardamos plantillas en memoria (solo para front sin backend)
  private templates = new Map<string, any>();

  // crea una plantilla en blanco
  createBlank(name = 'Nueva plantilla') {
    const now = new Date().toISOString();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);

    const tpl = {
      id,
      name,
      blocks: [],
      createdAt: now,
      updatedAt: now,
    };

    this.templates.set(id, tpl);
    return tpl;
  }

  // busca plantilla por id
  getById(id: string) {
    return this.templates.get(id);
  }
}