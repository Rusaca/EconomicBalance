import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storageKey = 'tema';
  private readonly darkValue = 'oscuro';
  private readonly darkClass = 'dark-mode';

  initTheme(): void {
    this.applyTheme(this.isDarkStored());
  }

  isDarkMode(): boolean {
    return document.body.classList.contains(this.darkClass);
  }

  setDarkMode(isDark: boolean): void {
    this.applyTheme(isDark);
    localStorage.setItem(this.storageKey, isDark ? this.darkValue : 'claro');
  }

  toggleDarkMode(): boolean {
    const nextMode = !this.isDarkMode();
    this.setDarkMode(nextMode);
    return nextMode;
  }

  private isDarkStored(): boolean {
    return localStorage.getItem(this.storageKey) === this.darkValue;
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.toggle(this.darkClass, isDark);
  }
}
