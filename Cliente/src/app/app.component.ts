import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from './servicios/autenticacion.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(private autenticacionService: AutenticacionService) {}

  ngOnInit() {
    this.cargarUsuarioActual();
  }

  cargarUsuarioActual() {
    const token = localStorage.getItem('token');

    this.autenticacionService.cargarUsuarioActual(token).subscribe(() => {});
  }
}
