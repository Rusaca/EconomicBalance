import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink , Router} from '@angular/router';
import { AuthFormService } from '../../../servicios/auth-form.service';
import { AuthApiService } from '../../../servicios/auth-api.service';

declare const google: any; // ← AÑADIDO

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login implements OnInit, AfterViewInit {   // ← AÑADIDO implements OnInit, AfterViewInit

  correo: string = '';
  password: string = '';
  remember: boolean = false;

  @ViewChild('videoElement', { static: true }) videoElement!: ElementRef<HTMLVideoElement>;

  constructor(
    private authFormService: AuthFormService,
    private authApiService: AuthApiService,
    private router: Router
  ) {}

  // ← AÑADIDO: Inicialización de Google Identity Services
  ngOnInit() {
    google.accounts.id.initialize({
      client_id: 'TU_CLIENT_ID_DE_GOOGLE',
      callback: (response: any) => this.handleGoogleCredential(response)
    });
  }

  ngAfterViewInit() {
    // Forzar la reproducción del video de fondo
    const video = this.videoElement.nativeElement;
    video.play().catch(error => {
      console.log('Video autoplay failed:', error);
    });
  }

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

  // ← MODIFICADO: ahora abre el popup de Google
  loginGoogle() {
    google.accounts.id.prompt();
  }

  // ← AÑADIDO: recibe el token de Google y lo envía al backend
  async handleGoogleCredential(response: any) {
    try {
      const googleToken = response.credential;

      const respuesta = await this.authApiService.loginGoogle({ token: googleToken });

      if (!respuesta.ok) {
        alert(respuesta.mensaje);
        return;
      }

      localStorage.setItem('usuario', JSON.stringify(respuesta.data));
      alert('Login con Google correcto');

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error Google Login:', error);
      alert('Error conectando con Google');
    }
  }


}
