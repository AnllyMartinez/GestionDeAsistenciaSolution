import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
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

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.autenticacionServicio.obtenerToken()) {
      this.router.navigate(['/inicio-sesion']);
      return false;
    }
    // Obtener el rol del usuario
    const rolUsuario = this.autenticacionServicio.obtenerUsuarioRol(); // "estudiante", "profesor" o "admin"
    const rolEsperado = route.data.rolEsperado;

    // Si se especificó un rol esperado, se permite si el usuario tiene ese rol o es admin
    if (rolEsperado) {
      if (rolUsuario !== rolEsperado && rolUsuario !== 'Admin') {
        this.router.navigate(['/inicio']);
        return false;
      }
    }
    return true;
  }
}
