import { Component } from '@angular/core';
import { HorasLaboralesService } from '../servicios/horas-laborales.service';

@Component({
  selector: 'app-horas-laborales',
  standalone: false,
  templateUrl: './horas-laborales.component.html',
  styleUrl: './horas-laborales.component.css',
})
export class HorasLaboralesComponent {
  mensaje: string;
  horaInicio: string;
  horaFin: string;

  constructor(private horasLaboralesService: HorasLaboralesService) {}

  registrarHoras() {
    const data = {
      ProfesorID: 0, // Se debe obtener el ID del profesor desde la sesión/autenticación
      Fecha: new Date(),
      HoraInicio: new Date(new Date().toDateString() + ' ' + this.horaInicio),
      HoraFin: new Date(new Date().toDateString() + ' ' + this.horaFin),
    };
    this.horasLaboralesService.registrarHoras(data).subscribe({
      next: () => (this.mensaje = 'Horas laborales registradas exitosamente'),
      error: () => (this.mensaje = 'Error al registrar horas laborales'),
    });
  }
}
