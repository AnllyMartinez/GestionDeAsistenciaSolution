import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-barra-navegacion',
  standalone: false,
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.css',
})
export class BarraNavegacionComponent implements OnInit {
  // Observable que contiene la información del usuario actual
  usuarioActual: Observable<any>;

  cambiarContrasenaFormulario: FormGroup;
  errorMensaje = '';

  constructor(
    private autenticacionService: AutenticacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Se suscribe al observable del usuario actual del servicio de autenticacion
    this.usuarioActual = this.autenticacionService.usuarioActual;

    // Se crea el formulario para cambiar contraseña
    this.cambiarContrasenaFormulario = this.fb.group({
      nuevaContrasena: ['', Validators.required],
    });
  }

  cerrarSesion(): void {
    this.autenticacionService.cerrarSesion();
  }

  actualizarContrasena(): void {
    if (this.cambiarContrasenaFormulario.valid) {
      // Se obtiene la nueva contraseña del formulario
      const nuevaContrasena =
        this.cambiarContrasenaFormulario.get('nuevaContrasena')?.value;

      // Servicio para actualizar la contraseña
      this.autenticacionService
        .actualizarContrasena(nuevaContrasena)
        .subscribe({
          next: () => {
            this.cambiarContrasenaFormulario.reset();
            this.errorMensaje = '';
          },
          error: () => {
            this.errorMensaje =
              'Error al actualizar la contraseña. Por favor, intentalo de nuevo';
          },
        });
    }
  }
}
