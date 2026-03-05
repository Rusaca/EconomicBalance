import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TemplatesService } from '../../../services/templates-service';

@Component({
  selector: 'app-template-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './template-page.html',
  styleUrl: './template-page.css',
})
export class TemplatePage implements OnInit {

  template: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private templateService: TemplatesService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.template = this.templateService.getById(id);

    if (!this.template) {
      this.router.navigate(['/']);
      return;
    }
  }
  addBlock(): void {
    // TODO: aquí tu lógica real
    console.log('addBlock clicked');
  }
}