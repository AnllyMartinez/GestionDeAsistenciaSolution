import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = 'https://localhost:5001/api/asistencias';

  constructor(private http: HttpClient) {}

  registrarAsistencia(data: {
    UsuarioID: number;
    Tipo: string;
    RegistradoPor: number;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, data);
  }

  obtenerAsistencias(filters?: { usuarioID?: number }): Observable<any[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.usuarioID)
        params = params.append('usuarioID', filters.usuarioID.toString());
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  actualizarAsistencia(
    id: number,
    data: {
      UsuarioID: number;
      Tipo: string;
    }
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  eliminarAsistencia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
