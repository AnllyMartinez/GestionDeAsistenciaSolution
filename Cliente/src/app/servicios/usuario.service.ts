import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) {}

  traerUsuarios(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/usuarios');
  }

  crearUsuario(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/usuarios', data);
  }

  actualizarUsuario(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, data);
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`);
  }

  traerRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/roles');
  }
}
