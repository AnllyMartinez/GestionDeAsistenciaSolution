import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionService {
  private tokenKey = 'authToken';
  private authUrl = 'https://localhost:5001/api/Autenticacion';
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem(this.tokenKey);
    this.isAuthenticated.next(!!token);
  }

  iniciarSesion(email: string, contrasena: string): Observable<any> {
    return this.http
      .post<any>(`${this.authUrl}/login`, { email, contrasena })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
          this.isAuthenticated.next(true);
        })
      );
  }

  cerrarSesion() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.next(false);
  }

  obtenerToken() {
    return localStorage.getItem(this.tokenKey);
  }
}
