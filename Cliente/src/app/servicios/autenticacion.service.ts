import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private authUrl = 'https://localhost:5001/api/Autenticacion';

  // Almacena el usuario actual y permite que nuevos suscriptores reciban el ultimo valor emitido
  private usuarioActualSource = new ReplaySubject<any>(1);
  // Observable al que pueden suscribirse otros componentes para conocer el usuario actual
  usuarioActual = this.usuarioActualSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  iniciarSesion(email: string, contrasena: string) {
    return this.http
      .post<any>(`${this.authUrl}/inicioSesion`, { email, contrasena })
      .pipe(
        tap((respuesta) => {
          localStorage.setItem('token', respuesta.token);
          // Se emite la respuesta (usuario) a los suscriptores
          this.usuarioActualSource.next(respuesta);
        })
      );
  }

  cargarUsuarioActual(token) {
    if (token === null) {
      this.usuarioActualSource.next(null);
      return of(null);
    }

    return this.http.get(this.authUrl).pipe(
      map((usuario: any) => {
        if (usuario) {
          localStorage.setItem('token', usuario.token);
          this.usuarioActualSource.next(usuario);
        }
      })
    );
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.usuarioActualSource.next(null);
    this.router.navigate(['/inicio-sesion']);
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  obtenerUsuarioID() {
    const token = this.obtenerToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.UsuarioID;
    }
    return null;
  }

  obtenerUsuarioRol() {
    const token = this.obtenerToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role;
    }
    return null;
  }

  actualizarContrasena(nuevaContrasena: string) {
    const usuarioActual = this.obtenerUsuarioID();
    return this.http.put<any>(
      `${this.authUrl}/actualizarContrasena/${usuarioActual}`,
      { nuevaContrasena }
    );
  }
}
