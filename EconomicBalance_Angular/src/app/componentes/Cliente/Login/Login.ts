import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './Login.html',
  styleUrl: './Login.css',
})
export class Login {
  email: string = '';
  password: string = '';
  remember: boolean = false;

  login() {
    console.log('login', { email: this.email, remember: this.remember });
  }

  loginGoogle() {
    console.log('login google');
  }

  loginApple() {
    console.log('login apple');
  }
}

