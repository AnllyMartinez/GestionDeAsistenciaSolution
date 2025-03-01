import { Component } from '@angular/core';
import { AsistenciaService } from '../servicios/asistencia.service';


@Component({
  selector: 'app-asistencia',
  standalone: false,
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css',
})
export class AsistenciaComponent {
  mensaje: string;
  historialAsistencia: any[] = [];

  constructor(private asistenciaService: AsistenciaService) {}

  registrarEntrada() {
    this.asistenciaService.registrarAsistencia({ Tipo: 'Entrada' }).subscribe({
      next: () => (this.mensaje = 'Entrada registrada exitosamente'),
      error: () => (this.mensaje = 'Error al registrar la entrada'),
    });
  }

  registrarSalida() {
    this.asistenciaService.registrarAsistencia({ Tipo: 'Salida' }).subscribe({
      next: () => (this.mensaje = 'Salida registrada exitosamente'),
      error: () => (this.mensaje = 'Error al registrar la salida'),
    });
  }
}
