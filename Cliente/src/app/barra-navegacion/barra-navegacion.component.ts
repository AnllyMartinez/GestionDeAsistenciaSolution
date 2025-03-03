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
  usuarioActual$: Observable<any>;
  cambiarContrasenaForm: FormGroup;
  errorMensaje: string;

  constructor(
    private autenticacionService: AutenticacionService,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.usuarioActual$ = this.autenticacionService.usuarioActual$;
    this.cambiarContrasenaForm = this.fb.group({
      nuevaContrasena: ['', Validators.required],
    });
  }

  onCerrarSesion(): void {
    this.autenticacionService.cerrarSesion();
  }

  onActualizarContrasena(): void {
    if (this.cambiarContrasenaForm.valid) {
      const nuevaContrasena =
        this.cambiarContrasenaForm.get('nuevaContrasena')?.value;

      this.autenticacionService
        .actualizarContrasena(nuevaContrasena)
        .subscribe({
          next: (response) => {
            this.cambiarContrasenaForm.reset();
            this.errorMensaje = '';
          },
          error: (error) => {
            this.errorMensaje =
              'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.';
          },
        });
    }
  }
}
