import { Routes } from '@angular/router';
import { Inicio } from './componentes/Cliente/DashBoard/inicio/inicio';
import { Dashboard } from './componentes/Cliente/DashBoard/dashboard/dashboard';
import { TemplatePage } from './componentes/Cliente/template-page/template-page';
import { Login } from './componentes/Cliente/Login/Login';
import { Registro } from './componentes/Cliente/Registro/Registro'; 

export const routes: Routes = [
  {
    path: '',
    component: Inicio
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'registro',
    component: Registro
  },
  {
    path: 'templates/nueva',
    component: TemplatePage
  },
  {
    path: 'templates/:id',
    component: TemplatePage
  },
 
];