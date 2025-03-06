import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../servicios/asistencia.service';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asistencia',
  standalone: false,
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css',
})
export class AsistenciaComponent implements OnInit {
  // Mensaje para notificaciones (exito o error)
  mensaje = '';
  // Historial de asistencias del usuario
  historialAsistencia = [];

  constructor(
    private asistenciaService: AsistenciaService,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit(): void {
    this.cargarHistorial();
  }

  // Carga el historial de asistencias del usuario actual.
  cargarHistorial(): void {
    let idUsuarioActual = this.autenticacionService.obtenerUsuarioID();

    this.asistenciaService
      .obtenerAsistencias({ usuarioID: idUsuarioActual })
      .subscribe({
        next: (data) => {
          // Se mapea cada asistencia para formatear la fecha y la hora
          this.historialAsistencia = data.map((item) => {
            const fechaHora = new Date(item.fechaHora);
            return {
              ...item,
              fecha: fechaHora.toLocaleDateString(),
              hora: fechaHora.toLocaleTimeString(),
            };
          });
        },
        error: (err) => {
          // Se muestra un mensaje de error si ocurre un problema al cargar el historial
          this.mensaje = 'Error al cargar el historial';

          console.error(err);
        },
      });
  }

  registrarEntrada(): void {
    this.registrarAsistencia('Entrada');
  }

  registrarSalida(): void {
    this.registrarAsistencia('Salida');
  }

  private registrarAsistencia(tipo: string): void {
    let idUsuarioActual = this.autenticacionService.obtenerUsuarioID();

    // Datos que se enviarán a la API
    const data = {
      UsuarioID: idUsuarioActual,
      Tipo: tipo,
      RegistradoPor: idUsuarioActual,
    };

    this.asistenciaService.registrarAsistencia(data).subscribe({
      next: (res) => {
        // Actualiza el historial despues de registrar la asistencia
        this.cargarHistorial();
        this.mensaje = res.mensaje;
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || `Error al registrar ${tipo}`;
        console.error(err);
      },
    });
  }
}
