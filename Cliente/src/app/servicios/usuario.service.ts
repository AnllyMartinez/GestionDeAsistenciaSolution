import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private apiUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) {}

  traerUsuarios() {
    return this.http.get<any>(this.apiUrl + '/usuarios');
  }

  crearUsuario(data: any) {
    return this.http.post<any>(this.apiUrl + '/usuarios', data);
  }

  actualizarUsuario(id: number, data: any) {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, data);
  }

  eliminarUsuario(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/usuarios/${id}`);
  }

  traerRoles() {
    return this.http.get<any[]>(this.apiUrl + '/roles');
  }
}
