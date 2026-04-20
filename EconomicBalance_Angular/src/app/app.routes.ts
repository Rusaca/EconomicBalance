import { Routes } from '@angular/router';
import { Inicio } from './componentes/Cliente/DashBoard/inicio/inicio';
import { TemplatePage } from './componentes/Cliente/template-page/template-page';
import { Login } from './componentes/Cliente/Login/Login';
import { Registro } from './componentes/Cliente/Registro/Registro';
import { Activar } from './componentes/Cliente/Activar/Activar';


export const routes: Routes = [
  {
    path: '',
    component: Inicio
  },
  { path: 'login',
     component: Login },
  { path: 'registro', 
    component: Registro },
  {
    path: 'templates/:id',
    component: TemplatePage
  },
  { path: 'activar', 
    component: Activar 

  }
];
