import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '../../../pipes/translate.pipe';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private router: Router) {}

  irAAyuda(tipo: string): void {
    this.router.navigate(['/ayuda'], {
      queryParams: { tipo }
    });
  }
}

