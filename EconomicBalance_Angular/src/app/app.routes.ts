import { Routes } from '@angular/router';
import { Inicio } from './componentes/Cliente/inicio/inicio';
import { TemplatePage } from './componentes/Cliente/template-page/template-page';

export const routes: Routes = [
  { 
    path: '', 
    component: Inicio
  },
  {
    path: 'templates/:id',
    component:TemplatePage
  }
];
