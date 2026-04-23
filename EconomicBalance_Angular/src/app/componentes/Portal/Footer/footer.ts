import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  imports: [],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  activeSection: 'terms' | 'privacy' | 'cookies' | 'contact' = 'terms';

  setActiveSection(section: 'terms' | 'privacy' | 'cookies' | 'contact'): void {
    this.activeSection = section;
  }
}
