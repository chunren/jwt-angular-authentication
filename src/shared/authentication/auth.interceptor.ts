import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
    let accessToken = this.authService.accessToken;
    if (accessToken) {
      request = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${accessToken}` )
      });
    }
    return next.handle(request);
  }
}