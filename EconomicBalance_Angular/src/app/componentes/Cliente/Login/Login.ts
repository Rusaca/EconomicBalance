import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink , Router} from '@angular/router';
import { AuthFormService } from '../../../servicios/auth-form.service';
import { AuthApiService } from '../../../servicios/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login {
  correo: string = '';
  password: string = '';
  remember: boolean = false;

   constructor(
    private authFormService: AuthFormService,
    private authApiService: AuthApiService,
    private router: Router
  ) {}

 async login() {
    const payload = this.authFormService.collectLoginData({
      correo: this.correo,
      password: this.password,
      remember: this.remember,
    });

    try {
      const respuesta = await this.authApiService.loginUsuario(payload);

      console.log('respuesta login backend:', respuesta);

      if (!respuesta.ok) {
        alert(respuesta.mensaje);
        return;
      }

      localStorage.setItem('usuario', JSON.stringify(respuesta.data));
      alert('Login correcto');

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error conectando con el servidor');
    }
  }

  loginGoogle() {
    console.log('login google');
  }

  loginApple() {
    console.log('login apple');
  }
}

