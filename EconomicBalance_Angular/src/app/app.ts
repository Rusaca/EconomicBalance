import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './componentes/Portal/FooterAutenticado/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EB - Economic Balance');

  private hideFooterRoutes = [
    '/app-inicio',
    '/login',
    '/registro',
    '/templates/nueva',
    '/templates',
    '/activar',
    '/recuperar-password',
    '/restablecer-password'
  ];

  constructor(public router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const video = document.getElementById('bg-video') as HTMLVideoElement | null;

        if (video) {
          if (event.url.startsWith('/login') || event.url.startsWith('/registro')) {
            video.style.display = 'block';
          } else {
            video.style.display = 'none';
          }
        }
      }
    });
  }

  get shouldHideFooter(): boolean {
    const url = this.router.url;
    if (url === '/' || url === '') return true;
    return this.hideFooterRoutes.some(route => url.startsWith(route));
  }

}

