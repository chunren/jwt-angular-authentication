import { Injectable } from "@angular/core";
import {HttpRequest,HttpResponse,HttpHandler,HttpEvent,HttpInterceptor, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, materialize, dematerialize } from "rxjs/operators";
import { User } from "../models/user.interface";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MockDataService } from "./mock-data.service"
import { environment } from '../../environments/environment';


@Injectable()
export class MockService implements HttpInterceptor {
 
  constructor(private mockData: MockDataService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!environment.mock)
      return next.handle(request);
    
    const { url, method, headers, body } = request;
    let myMockData = this.mockData;
    return of(null)
        .pipe(mergeMap(handleRoute))
        .pipe(materialize())
        .pipe(delay(10))
        .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith("/users/authenticate") && method === "POST":
          return authenticate();
        case url.endsWith("/getTransactions"):
          return getTransactions();
        default:
          return next.handle(request);
      }
      

    }

    function authenticate() {
      const { username, password } = body;
      
      let user = myMockData.users.find(
        x => x.userName === username && x.password === password
      );
      if (!user) return error("Username or password is incorrect");

      let mytoken = myMockData.tokenHash[username];
      let result: User = {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        accessToken: mytoken
      };

      return ok(result);
    }

    // function getUsers() {
    //   if (!isLoggedIn()) return unauthorized();
    //   return ok(this.mockData.users);
    // }

    function getTransactions() {
      if (!isLoggedIn()) return unauthorized();

      // todo: to validate the token

      const helper = new JwtHelperService();
      const authHeader = headers.get("Authorization");
      const myRawToken = authHeader.replace("Bearer ", "");
      const decodedToken = helper.decodeToken(myRawToken);
      let username = decodedToken.userName;
      const result = myMockData.transactions.filter(x => x.userName === username);
      return ok(result);
    }

    function ok(body?) {
      return of(new HttpResponse({ status: 200, body }));
    }

    function error(message) {
      return throwError({ error: { message } });
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: "Unauthorised" } });
    }

    function isLoggedIn() {
      const helper = new JwtHelperService();
      const authHeader = headers.get("Authorization");
      if (authHeader) {
        const myRawToken = authHeader.replace("Bearer ", "");
        if (myRawToken) {
          //const decodedToken = helper.decodeToken(myRawToken);
          const isTokenExpired = helper.isTokenExpired(myRawToken);
          if (!isTokenExpired) return true;
        }
      }

      return false;
    }
  }
}

export let mockService = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: MockService,
  multi: true
};
