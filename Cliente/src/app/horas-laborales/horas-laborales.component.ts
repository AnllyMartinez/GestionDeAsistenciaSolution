import { Component, OnInit } from '@angular/core';
import { HorasLaboralesService } from '../servicios/horas-laborales.service';
import { Subscription } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Component({
  selector: 'app-horas-laborales',
  standalone: false,
  templateUrl: './horas-laborales.component.html',
  styleUrl: './horas-laborales.component.css',
})
export class HorasLaboralesComponent implements OnInit {
  mensaje: string = '';
  mensajeTipo: 'success' | 'error' = 'success';
  horaInicio: string = '';
  horaFin: string = '';
  usuarioActualId: number = 0;
  historialHoras: any[] = [];
  private autenticacionSub: Subscription;

  constructor(
    private horasLaboralesService: HorasLaboralesService,
    private autenticacionService: AutenticacionService
  ) {}

  ngOnInit(): void {
    this.autenticacionSub = this.autenticacionService.usuarioActual$.subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuarioActualId = usuario.usuarioID;
          this.cargarHistorialHoras();
        } else {
          this.usuarioActualId = 0;
          this.historialHoras = [];
        }
      },
      error: (err) =>
        console.error('Error en suscripción de autenticación:', err),
    });
  }

  registrarHoras() {
    if (!this.horaInicio || !this.horaFin) {
      this.mensajeTipo = 'error';
      this.mensaje = 'Debe ingresar una hora de inicio y una hora de fin';
      return;
    }

    const hoy = new Date();
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    const horaInicio = new Date(
      fecha.toISOString().split('T')[0] + 'T' + this.horaInicio + ':00Z'
    );
    const horaFin = new Date(
      fecha.toISOString().split('T')[0] + 'T' + this.horaFin + ':00Z'
    );

    const data = {
      ProfesorID: this.usuarioActualId,
      Fecha: fecha.toISOString(),
      HoraInicio: horaInicio.toISOString(),
      HoraFin: horaFin.toISOString(),
    };

    this.horasLaboralesService.registrarHoras(data).subscribe({
      next: () => {
        this.mensajeTipo = 'success';
        this.mensaje = 'Horas laborales registradas exitosamente';
        this.cargarHistorialHoras();
        setTimeout(() => (this.mensaje = ''), 3000);
      },
      error: (err) => {
        this.mensajeTipo = 'error';
        this.mensaje =
          err.error?.mensaje || 'Error al registrar horas laborales';
        console.error(err);
      },
    });
  }

  cargarHistorialHoras(): void {
    this.horasLaboralesService
      .obtenerHorasLaborales(this.usuarioActualId)
      .subscribe({
        next: (data) => {
          this.historialHoras = data.map((item) => ({
            ...item,
            fecha: new Date(item.fecha).toLocaleDateString(),
            horaInicio: new Date(item.horaInicio).toLocaleTimeString(),
            horaFin: new Date(item.horaFin).toLocaleTimeString(),
          }));
        },
        error: (err) => {
          this.mensajeTipo = 'error';
          this.mensaje = 'Error al cargar el historial de horas laborales';
          console.error(err);
        },
      });
  }
}
