import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BarraNavegacionComponent } from './barra-navegacion/barra-navegacion.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AsistenciaComponent } from './asistencia/asistencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InicioComponent } from './inicio/inicio.component';
import { AdminComponent } from './admin/admin.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { AuthInterceptor } from './interceptor/autenticacion.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BarraNavegacionComponent,
    AsistenciaComponent,
    InicioComponent,
    AdminComponent,
    InicioSesionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CollapseModule.forRoot(),
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
