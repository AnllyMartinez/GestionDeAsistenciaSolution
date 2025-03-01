import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HorasLaboralesService {
  private apiUrl = 'http://localhost:5000/api/horaslaborales';

  constructor(private http: HttpClient) {}

  registrarHoras(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, data);
  }
}
