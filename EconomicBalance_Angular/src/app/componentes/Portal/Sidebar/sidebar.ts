import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { ThemeService } from '../../../servicios/theme.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {

  @Input() abierto = false;
  @Output() abiertoChange = new EventEmitter<boolean>();

  temaOscuro = false;

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.temaOscuro = this.themeService.isDarkMode();
  }

  toggleTheme() {
    this.temaOscuro = this.themeService.toggleDarkMode();
  }

  get temaOscuroActivo(): boolean {
    return this.themeService.isDarkMode();
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
    this.themeService.setDarkMode(false);
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
