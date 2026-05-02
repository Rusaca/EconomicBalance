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
import { PerfilComponent } from './componentes/Cliente/Perfil/perfil';
import { AjustesComponent } from './componentes/Cliente/Ajustes/ajustes';
import { CalendarioComponent } from './componentes/Cliente/Calendario/Calendario';


export const routes: Routes = [
  {
    path: '',
    component: Inicio
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
  {
    path: 'activar',
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
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'ajustes',
    component: AjustesComponent
  },
  {
  path: 'calendario',
  component: CalendarioComponent
  }

];
