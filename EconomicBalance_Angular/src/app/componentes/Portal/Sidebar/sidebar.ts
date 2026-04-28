import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  @Input() abierto = false;
  @Output() abiertoChange = new EventEmitter<boolean>();

  temaOscuro = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const temaGuardado = localStorage.getItem('tema');
    this.temaOscuro = temaGuardado === 'oscuro';

    if (this.temaOscuro) {
      document.body.classList.add('dark-mode');
    }
  }

  toggleTheme() {
    this.temaOscuro = !this.temaOscuro;

    if (this.temaOscuro) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('tema', 'oscuro');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('tema', 'claro');
    }
  }

  cerrar() {
    this.abierto = false;
    this.abiertoChange.emit(false);
  }

  ir(ruta: string) {
    this.router.navigate([`/${ruta}`]);
    this.cerrar();
  }

  cerrarSesion() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

