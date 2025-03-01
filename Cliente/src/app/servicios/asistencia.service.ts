import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = 'http://localhost:5000/api/asistencias';

  constructor(private http: HttpClient) {}

  registrarAsistencia(data: { Tipo: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, data);
  }
}
