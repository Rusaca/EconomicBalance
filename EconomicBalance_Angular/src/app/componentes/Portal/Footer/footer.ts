import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  activeSection: 'terms' | 'privacy' | 'cookies' | 'contact' = 'terms';

  setActiveSection(section: 'terms' | 'privacy' | 'cookies' | 'contact'): void {
    this.activeSection = section;
  }
}
