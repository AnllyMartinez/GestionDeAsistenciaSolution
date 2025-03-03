import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../servicios/autenticacion.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AutenticacionService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.auth.obtenerToken();
    if (token) {
      const peticionClonada = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token),
      });
      return next.handle(peticionClonada);
    }
    return next.handle(req);
  }
}
