import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionGuard implements CanActivate {
  constructor(
    private autenticacionServicio: AutenticacionService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.autenticacionServicio.obtenerToken()) {
      this.router.navigate(['/inicio-sesion']);
      return false;
    }
    return true;
  }
}
