import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HorasLaboralesService {
  private apiUrl = 'https://localhost:5001/api/horaslaborales';

  constructor(private http: HttpClient) {}

  registrarHoras(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, data);
  }

  obtenerHorasLaborales(profesorID?: number, fecha?: Date): Observable<any[]> {
    let params = new HttpParams();

    if (profesorID) {
      params = params.set('profesorID', profesorID.toString());
    }
    if (fecha) {
      params = params.set('fecha', fecha.toISOString());
    }

    return this.http.get<any[]>(`${this.apiUrl}`, {
      params,
    });
  }
}
