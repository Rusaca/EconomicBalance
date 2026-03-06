import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login implements OnInit {
  private authService = inject(AuthService);
  
  email: string = '';
  password: string = '';
  remember: boolean = false;

  ngOnInit(): void {
    // Cargar email recordado si existe
    const rememberedUser = this.authService.getRememberedUser();
    if (rememberedUser) {
      this.email = rememberedUser;
      this.remember = true;
    }
  }

  login() {
    this.authService.login({
      email: this.email,
      password: this.password,
      remember: this.remember
    });
    
    // TODO: Cuando conectemos el backend, navegar según la respuesta
    // this.router.navigate(['/inicio']);
  }

  loginGoogle() {
    this.authService.loginWithGoogle();
  }

  loginApple() {
    this.authService.loginWithApple();
  }
}

