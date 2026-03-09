import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthFormService } from '../../../servicios/auth-form.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  remember: boolean = false;

  constructor(private authFormService: AuthFormService) {}

  login() {
    const payload = this.authFormService.collectLoginData({
      email: this.email,
      password: this.password,
      remember: this.remember,
    });

    console.log('payload login listo para backend', payload);
  }

  loginGoogle() {
    console.log('login google');
  }

  loginApple() {
    console.log('login apple');
  }
}

