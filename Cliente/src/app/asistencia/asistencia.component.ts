import { Component } from '@angular/core';
import { AsistenciaService } from '../servicios/asistencia.service';
import { AutenticacionService } from '../servicios/autenticacion.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asistencia',
  standalone: false,
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css',
})
export class AsistenciaComponent {
  mensaje: string = '';
  historialAsistencia: any[] = [];
  usuarioActualId: number = 0;
  private autenticacionSub: Subscription;

  mensajeTipo = 'exito';

  constructor(
    private asistenciaService: AsistenciaService,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit(): void {
    this.autenticacionSub = this.autenticacionService.usuarioActual$.subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuarioActualId = usuario.usuarioID;
          this.cargarHistorial();
        } else {
          this.usuarioActualId = null;
          this.historialAsistencia = [];
        }
      },
      error: (err) =>
        console.error('Error en suscripción de autenticación:', err),
    });
  }

  cargarHistorial(): void {
    this.asistenciaService
      .obtenerAsistencias({ usuarioID: this.usuarioActualId })
      .subscribe({
        next: (data) => {
          this.historialAsistencia = data.map((item) => ({
            ...item,
            fecha: new Date(item.fechaHora).toLocaleDateString(),
            hora: new Date(item.fechaHora).toLocaleTimeString(),
          }));
        },
        error: (err) => {
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
    const data = {
      UsuarioID: this.usuarioActualId,
      Tipo: tipo,
      RegistradoPor: this.usuarioActualId,
    };

    this.asistenciaService.registrarAsistencia(data).subscribe({
      next: (res) => {
        this.cargarHistorial();
        this.mensajeTipo = 'exito';
        this.mensaje = res.mensaje;
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: (err) => {
        this.mensajeTipo = 'error';
        this.mensaje =
          err.error?.mensaje || `Error al registrar ${tipo.toLowerCase()}`;
        console.error(err);
      },
    });
  }
}
