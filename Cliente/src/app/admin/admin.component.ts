import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../servicios/usuario.service';
import { AsistenciaService } from '../servicios/asistencia.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  // Listas para mostrar en el panel
  usuarios = [];
  roles = [];
  registrosAsistencia = [];

  // Formularios para crear y editar usuario
  crearUsuarioFormulario: FormGroup;
  editarUsuarioFormulario: FormGroup;

  // Usuario seleccionado para editar
  usuarioEditar = null;

  // Filtros para registros
  usuariosSeleccionadosFiltro = null;
  fechaSeleccionadaFiltro = '';

  mensaje = '';

  // ID del usuario seleccionado para eliminar
  usuarioSelccionadoAEliminarID = 0;

  constructor(
    private usuarioService: UsuarioService,
    private asistenciaService: AsistenciaService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.traerUsuarios();
    this.traeRoles();
    this.filtrarRegistros();

    // Inicializa el formulario para crear usuario
    this.crearUsuarioFormulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: [0, Validators.required],
    });
    // Inicializa el formulario para editar usuario
    this.editarUsuarioFormulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rol: [0, Validators.required],
    });
  }

  // Trae todos los usuarios del servicio
  traerUsuarios() {
    this.usuarioService.traerUsuarios().subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error para traer usuarios', err),
    });
  }

  // Trae todos los roles disponibles del servicio
  traeRoles() {
    this.usuarioService.traerRoles().subscribe({
      next: (data) => (this.roles = data),
      error: (err) => console.error('Error al traer roles', err),
    });
  }

  // Crea un nuevo usuario usando los datos del formulario reactivo
  crearUsuario(): void {
    if (this.crearUsuarioFormulario.invalid) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }
    const nuevoUsuario = {
      nombre: this.crearUsuarioFormulario.value.nombre,
      apellido: this.crearUsuarioFormulario.value.apellido,
      email: this.crearUsuarioFormulario.value.email,
      rolID: this.crearUsuarioFormulario.value.rol,
    };

    this.usuarioService.crearUsuario(nuevoUsuario).subscribe({
      next: (data) => {
        this.mensaje = 'Usuario creado exitosamente';
        this.traerUsuarios();
        this.crearUsuarioFormulario.reset();
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al crear usuario';
        console.error(err);
      },
    });
  }

  // Selecciona un usuario para editar y carga sus datos en el formulario reactivo de edición
  editarUsuario(usuario: any) {
    this.usuarioEditar = { ...usuario };
    this.editarUsuarioFormulario.patchValue({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rolID,
    });
  }

  // Actualiza el usuario con los datos del formulario reactivo de edición
  actualizarUsuario() {
    if (!this.usuarioEditar) return;
    const usuarioActualizado = {
      ...this.usuarioEditar,
      ...this.editarUsuarioFormulario.value,
      rolID: this.editarUsuarioFormulario.value.rol,
    };
    this.usuarioService
      .actualizarUsuario(this.usuarioEditar.usuarioID, usuarioActualizado)
      .subscribe({
        next: () => {
          this.mensaje = 'Usuario actualizado exitosamente';
          this.traerUsuarios();
        },
        error: (err) => {
          this.mensaje = err.error?.mensaje || 'Error al actualizar usuario';
          console.error(err);
        },
      });
  }

  // Elimina un usuario por su ID
  eliminarUsuario(id: number) {
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => {
        this.mensaje = 'Usuario eliminado exitosamente';
        this.traerUsuarios();
      },
      error: (err) => {
        this.mensaje = err.error?.mensaje || 'Error al eliminar usuario';
        console.error(err);
      },
    });
  }

  // Filtra los registros de asistencia según usuario y fecha
  filtrarRegistros() {
    let fechaFiltro = null;

    if (this.fechaSeleccionadaFiltro) {
      fechaFiltro = new Date(this.fechaSeleccionadaFiltro);
    }

    const usuarioFiltro = this.usuariosSeleccionadosFiltro;

    this.asistenciaService
      .obtenerAsistencias({ usuarioID: usuarioFiltro, fecha: fechaFiltro })
      .subscribe({
        next: (data) => {
          // Formatea cada registro para mostrar fecha y hora en el correcto formato.
          this.registrosAsistencia = data.map((item) => ({
            fecha: new Date(item.fechaHora).toLocaleDateString(),
            hora: new Date(item.fechaHora).toLocaleTimeString(),
            tipo: item.tipo,
            usuario: item.usuario,
          }));
        },
      });
  }

  usuarioAEliminarID(id: number) {
    this.usuarioSelccionadoAEliminarID = id;
  }

  // Confirma y elimina el usuario seleccionado
  confirmarEliminarUsuario() {
    this.usuarioService
      .eliminarUsuario(this.usuarioSelccionadoAEliminarID)
      .subscribe({
        next: () => {
          this.mensaje = 'Usuario eliminado exitosamente';
          this.traerUsuarios();
        },
        error: (err) => {
          this.mensaje = 'Error al eliminar usuario';
        },
      });
  }
}
