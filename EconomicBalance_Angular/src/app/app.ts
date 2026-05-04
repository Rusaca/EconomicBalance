import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { FooterComponent } from './componentes/Portal/FooterAutenticado/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Voltix_Angular');

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const video = document.getElementById('bg-video') as HTMLVideoElement | null;

        if (!video) return;

        if (event.url === '/login' || event.url === '/registro') {
          video.style.display = 'block';
        } else {
          video.style.display = 'none';
        }
      }
    });
  }
}

