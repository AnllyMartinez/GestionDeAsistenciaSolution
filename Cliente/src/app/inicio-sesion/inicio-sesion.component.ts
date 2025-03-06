import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  standalone: false,
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css',
})
export class InicioSesionComponent {
  formularioInicioDeSesion: FormGroup;
  mensajeError = '';

  constructor(
    private fb: FormBuilder,
    private autenticacionService: AutenticacionService,
    private router: Router
  ) {
    // Formulario con dos campos, email y contraseña
    this.formularioInicioDeSesion = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
    });
  }

  iniciarSesion() {
    if (this.formularioInicioDeSesion.valid) {
      this.autenticacionService
        .iniciarSesion(
          this.formularioInicioDeSesion.value.email,
          this.formularioInicioDeSesion.value.contraseña
        )
        .subscribe({
          next: () => this.router.navigate(['/asistencia']),
          error: () => (this.mensajeError = 'Credenciales inválidas'),
        });
    }
  }
}
