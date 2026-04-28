import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'InicioAutenticado',
  templateUrl: './InicioAutenticado.html',
  styleUrls: ['./InicioAutenticado.css']
})
export class InicioAutenticado implements OnInit {

  usuario: string = 'Usuario';

  constructor() { }

  ngOnInit(): void {
    console.log('InicioAutenticado cargado');
  }

  cerrarSesion(): void {
    console.log('Sesión cerrada');
  }
}