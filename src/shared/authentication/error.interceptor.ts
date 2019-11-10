import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  readonly UNAUTHORIZED: number = 401;
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === this.UNAUTHORIZED) {
          this.authService.logout();
          location.reload(true);
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
