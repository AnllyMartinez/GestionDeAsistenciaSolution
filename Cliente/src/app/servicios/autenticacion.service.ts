import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, of, ReplaySubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private authUrl = 'https://localhost:5001/api/Autenticacion';
  public inicioSesion = new BehaviorSubject<boolean>(false);
  private usuarioActualSource = new ReplaySubject<any>(1);
  usuarioActual$ = this.usuarioActualSource.asObservable();
  private usuarioActualId?: number;

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    this.inicioSesion.next(!!token);
  }

  cargarUsuarioActual(token) {
    if (token === null) {
      this.usuarioActualSource.next(null);
      return of(null);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(this.authUrl, { headers }).pipe(
      map((usuario: any) => {
        if (usuario) {
          localStorage.setItem('token', usuario.token);
          this.usuarioActualSource.next(usuario);
        }
      })
    );
  }

  iniciarSesion(email: string, contrasena: string): Observable<any> {
    return this.http
      .post<any>(`${this.authUrl}/login`, { email, contrasena })
      .pipe(
        tap((respuesta) => {
          localStorage.setItem('token', respuesta.token);
          this.usuarioActualId = respuesta.usuarioID;
          this.inicioSesion.next(true);
          this.usuarioActualSource.next(respuesta);
        })
      );
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.inicioSesion.next(false);
    this.usuarioActualSource.next(false);
    this.router.navigate(['/inicio-sesion']);
  }

  obtenerToken() {
    return localStorage.getItem('token');
  }

  obtenerUsuarioID() {
    return this.usuarioActualId;
  }
}
