import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Component({
  selector: 'app-barra-navegacion',
  standalone: false,
  templateUrl: './barra-navegacion.component.html',
  styleUrl: './barra-navegacion.component.css',
})
export class BarraNavegacionComponent implements OnInit {
  usuarioActual$: Observable<any>;

  constructor(private autenticacionService: AutenticacionService) {}
  ngOnInit(): void {
    this.usuarioActual$ = this.autenticacionService.usuarioActual$;
  }

  onCerrarSesion(): void {
    this.autenticacionService.cerrarSesion();
  }
}
