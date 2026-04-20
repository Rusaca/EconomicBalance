import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Voltix_Angular');

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        const video = document.getElementById('bg-video') as HTMLVideoElement | null;

        if (!video) return; // ← evita el error

        if (event.url === '/login' || event.url === '/registro') {
          video.style.display = 'block';
        } else {
          video.style.display = 'none';
        }
      }
    });
  }
}
