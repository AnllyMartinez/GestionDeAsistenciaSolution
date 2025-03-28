import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { InicioComponent } from './inicio/inicio.component';
import { AdminComponent } from './admin/admin.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { AutenticacionGuard } from './servicios/autenticacion.guard';

const routes: Routes = [
  { path: '', component: InicioComponent },
  {
    path: 'inicio-sesion',
    component: InicioSesionComponent,
  },
  { path: 'inicio', component: InicioComponent },
  {
    path: 'asistencia',
    component: AsistenciaComponent,
    canActivate: [AutenticacionGuard],
    data: { rolEsperado: 'Usuario' },
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AutenticacionGuard],
    data: { rolEsperado: 'Admin' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
