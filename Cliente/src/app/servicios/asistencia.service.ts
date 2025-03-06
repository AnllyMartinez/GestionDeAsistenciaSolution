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
  }) {
    return this.http.post<any>(`${this.apiUrl}/registrar`, data);
  }

  obtenerAsistencias(filtro?: { usuarioID?: number; fecha?: Date }) {
    let params = new HttpParams();

    if (filtro) {
      if (filtro.usuarioID)
        params = params.append('usuarioID', filtro.usuarioID.toString());
      if (filtro.fecha) {
        params = params.set('fecha', filtro.fecha.toISOString());
      }
    }

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  actualizarAsistencia(
    id: number,
    data: {
      UsuarioID: number;
      Tipo: string;
    }
  ) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  eliminarAsistencia(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
