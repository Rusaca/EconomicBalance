import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.sesionIniciada()) {
      this.router.navigate(['/dashboard']);
    }
  }

  sesionIniciada(): boolean {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    return !!usuario && !!token && usuario !== 'undefined' && token !== 'undefined';
  }
}