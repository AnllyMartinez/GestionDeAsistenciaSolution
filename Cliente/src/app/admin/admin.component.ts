import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
crearRol() {
throw new Error('Method not implemented.');
}
crearUsuario() {
throw new Error('Method not implemented.');
}
  usuarios: any[] = [];
  registrosAsistencia: any[] = [];
  registrosHoras: any[] = [];
  nuevoUsuario;
  nuevoRol;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error fetching usuarios', err),
    });
  }
}
