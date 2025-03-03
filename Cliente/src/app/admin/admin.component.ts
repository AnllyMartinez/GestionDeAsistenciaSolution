import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { AsistenciaService } from '../servicios/asistencia.service';
import { HorasLaboralesService } from '../servicios/horas-laborales.service';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  // Listas para mostrar datos
  usuarios: any[] = [];
  roles: any[] = [];
  registrosAsistencia: any[] = [];
  registrosHoras: any[] = [];

  // Campos para crear usuario
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  rol: number = 0;

  // Usuario a editar
  usuarioEditar: any = null;

  // Filtros para registros
  selectedUsuarioFilter: number | null = null;
  selectedFechaFilter: string = '';

  // Mensajes y tipo de alerta
  mensaje: string = '';
  mensajeTipo = 'exito';

  usuarioSelccionadoAEliminarID: number = 0;

  constructor(
    private usuarioService: UsuarioService,
    private asistenciaService: AsistenciaService,
    private horasLaboralesService: HorasLaboralesService
  ) {}

  ngOnInit(): void {
    this.traerUsuarios();
    this.traeRoles();
    this.filtrarRegistros();
  }

  // Traer todos los usuarios
  traerUsuarios(): void {
    this.usuarioService.traerUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error para traer usuarios', err),
    });
  }

  // Traer roles disponibles
  traeRoles(): void {
    this.usuarioService.traerRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error al traer roles', err),
    });
  }

  // Crear un nuevo usuario
  crearUsuario(): void {
    if (!this.nombre || !this.email || !this.rol || !this.apellido) {
      this.mensaje = 'Todos los campos son obligatorios';
      this.mensajeTipo = 'error';
      return;
    }

    const nuevoUsuario = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      rolID: this.rol,
    };

    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: (data) => {
        this.mensaje = 'Usuario creado exitosamente';
        this.mensajeTipo = 'exito';
        this.traerUsuarios();
        // Limpiar el formulario
        this.nombre = '';
        this.email = '';
        this.apellido = '';
        this.rol = 0;
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al crear usuario';
        this.mensajeTipo = 'error';
        console.error(err);
      },
    });
  }

  // Seleccionar usuario para editar
  editarUsuario(usuario: any): void {
    this.usuarioEditar = { ...usuario };
  }

  // Actualizar usuario
  actualizarUsuario(): void {
    if (!this.usuarioEditar) {
      return;
    }
    this.usuarioService
      .actualizarUsuario(this.usuarioEditar.usuarioID, this.usuarioEditar)
      .subscribe({
        next: () => {
          this.mensaje = 'Usuario actualizado exitosamente';
          this.mensajeTipo = 'exito';
          this.traerUsuarios();
        },
        error: (err) => {
          this.mensaje = err.error?.mensaje || 'Error al actualizar usuario';
          this.mensajeTipo = 'error';
          console.error(err);
        },
      });
  }

  // Eliminar usuario
  eliminarUsuario(id: number): void {
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado exitosamente';
        this.mensajeTipo = 'exito';
        this.traerUsuarios();
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al eliminar usuario';
        this.mensajeTipo = 'error';
        console.error(err);
      },
    });
  }

  // Filtrar registros de asistencia y horas laborales
  filtrarRegistros(): void {
    // Convertir el filtro de fecha a Date (si se seleccionó)
    const fechaFiltro = this.selectedFechaFilter
      ? new Date(this.selectedFechaFilter)
      : null;
    const usuarioFiltro = this.selectedUsuarioFilter;

    // Filtrar asistencias
    this.asistenciaService
      .obtenerAsistencias({ usuarioID: usuarioFiltro, fecha: fechaFiltro })
      .subscribe({
        next: (data) => {
          this.registrosAsistencia = data.map((item) => ({
            fecha: new Date(item.fechaHora).toLocaleDateString(),
            hora: new Date(item.fechaHora).toLocaleTimeString(),
            tipo: item.tipo,
            usuario: item.usuario, // Se espera que el objeto de usuario venga anidado
          }));
        },
        error: (err) => console.error('Error fetching asistencias', err),
      });

    // Filtrar horas laborales
    this.horasLaboralesService
      .obtenerHorasLaborales(usuarioFiltro, fechaFiltro)
      .subscribe({
        next: (data) => {
          this.registrosHoras = data.map((item) => ({
            fecha: new Date(item.fecha).toLocaleDateString(),
            horaInicio: new Date(item.horaInicio).toLocaleTimeString(),
            horaFin: new Date(item.horaFin).toLocaleTimeString(),
            usuario: item.profesor, // Se espera que el objeto de usuario venga anidado
          }));
        },
        error: (err) => console.error('Error fetching horas laborales', err),
      });
  }

  usuarioAEliminarID(id): void {
    this.usuarioSelccionadoAEliminarID = id;
  }

  confirmarEliminarUsuario(): void {
    this.usuarioService
      .eliminarUsuario(this.usuarioSelccionadoAEliminarID)
      .subscribe({
        next: () => {
          this.mensaje = 'Usuario eliminado exitosamente';
          this.mensajeTipo = 'exito';
          this.traerUsuarios();
        },
        error: (err) => {
          this.mensaje = err.error?.mensaje || 'Error al eliminar usuario';
          this.mensajeTipo = 'error';
          console.error(err);
        },
      });
  }
}
