import { Component } from '@angular/core';
import { HeaderAutenticado } from '../../../Portal/HeaderAutenticado/HeaderAutenticado';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ HeaderAutenticado],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard { }
