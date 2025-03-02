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
  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private autenticacionService: AutenticacionService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.autenticacionService
        .iniciarSesion(
          this.loginForm.value.email,
          this.loginForm.value.contraseña
        )
        .subscribe({
          next: () => this.router.navigate(['/attendance']),
          error: () => (this.errorMessage = 'Credenciales inválidas'),
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
