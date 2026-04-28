import { Routes } from '@angular/router';
import { Inicio } from './componentes/Cliente/DashBoard/inicio/inicio';
import { Dashboard } from './componentes/Cliente/DashBoard/dashboard/dashboard';
import { MisPlantillas } from './componentes/Cliente/MisPlantillas/MisPlantillas';
import { TemplatePage } from './componentes/Cliente/template-page/template-page';
import { Login } from './componentes/Cliente/Login/Login';
import { Registro } from './componentes/Cliente/Registro/Registro';
import { Activar } from './componentes/Cliente/Activar/Activar';
import { Contrasena } from './componentes/Cliente/Contraseña/Contrasena';
import { RecuperarContra } from './componentes/Cliente/Recuperarcontra/RecuperarContra';


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

  },
    {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'mis-plantillas',
    component: MisPlantillas
  },
   {
    path: 'templates/nueva',
    component: TemplatePage
  },
   {
    path: 'activar',
    component: Activar
  },
  {
    path: 'recuperar-password',
    component: Contrasena
  },
  {
    path: 'restablecer-password',
    component: RecuperarContra
  }
];
