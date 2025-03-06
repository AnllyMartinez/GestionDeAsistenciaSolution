import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AutenticacionService } from './autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionGuard implements CanActivate {
  constructor(
    private autenticacionServicio: AutenticacionService,
    private router: Router
  ) {}

  // Determina si se permite o no el acceso a una ruta
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.autenticacionServicio.obtenerToken()) {
      this.router.navigate(['/inicio-sesion']);
      return false;
    }

    const rolUsuario = this.autenticacionServicio.obtenerUsuarioRol();
    const rolEsperado = route.data.rolEsperado;

    // Si se define un rol esperado, verifica que el usuario tenga ese rol o sea 'Admin'
    if (rolEsperado && rolUsuario !== rolEsperado && rolUsuario !== 'Admin') {
      this.router.navigate(['/inicio']);
      return false;
    }

    return true;
  }
}
