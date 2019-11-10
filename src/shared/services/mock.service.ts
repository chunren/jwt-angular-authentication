import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, materialize, dematerialize } from "rxjs/operators";

import { UserData } from "../models/userdata.interface";
import { User } from "../models/user";
import { Transaction } from "../models/transaction.interface";
import { Hashmap } from "../models/hashmap.interface";

import { JwtHelperService } from "@auth0/angular-jwt";

// https://stackoverflow.com/questions/48075688/how-to-decode-the-jwt-encoded-token-payload-on-client-side-in-angular-5
/*
Use @auth0/angular-jwt


Step - 1 : Install using npm

npm install @auth0/angular-jwt

Step - 2 : Import the package

import { JwtHelperService } from '@auth0/angular-jwt';

Step - 3 : Create an instance and use

const helper = new JwtHelperService();

const decodedToken = helper.decodeToken(myRawToken);

// Other functions
const expirationDate = helper.getTokenExpirationDate(myRawToken);
const isExpired = helper.isTokenExpired(myRawToken);

*/

// tool:  https://jwt.io/
//https://www.unixtimestamp.com/
/* 
1514592000 Is equivalent to: 12/30/2017  @12: 00am(UTC)
1539129600 Is equivalent to: 10/10/2018  @12: 00am(UTC)
1546300800 Is equivalent to: 01/01/2019  @12: 00am(UTC)
1924905600 Is equivalent to: 12/31/2030 @12: 00am(UTC)
iat: (issued at) claim identifies the time at which the JWT was issued.
exp: expiration time

-------------------------------
Header: 
{
  "alg": "HS256",
  "typ": "JWT"
}
Payload: 
{
  "userName": "dan",
  "firstName": "Daniel",
  "lastName": "Smith",
  "emailAddress": "daniel.smith@xyz777.com",
  "iat":1546300800,
  "exp":1924905600
}
secret: abcd123456
access token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImRhbiIsImZpcnN0TmFtZSI6IkRhbmllbCIsImxhc3ROYW1lIjoiU21pdGgiLCJlbWFpbEFkZHJlc3MiOiJkYW5pZWwuc21pdGhAeHl6Nzc3LmNvbSIsImlhdCI6MTU0NjMwMDgwMCwiZXhwIjoxOTI0OTA1NjAwfQ.e7uA4J2FSTkK9kAtNiTFqKMYrFRCwWoQamfi5rj-SPM
-----------------------------
Header: {
  "alg": "HS256",
  "typ": "JWT"
}
Payload: 
{
  "userName": "tim",
  "firstName": "Tim",
  "lastName": "Miller",
  "emailAddress": "tim.Miller@xyz777.com",
  "iat":1546300800,
  "exp":1924905600
}
secret: abcd123456
access token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRpbSIsImZpcnN0TmFtZSI6IlRpbSIsImxhc3ROYW1lIjoiTWlsbGVyIiwiZW1haWxBZGRyZXNzIjoidGltLk1pbGxlckB4eXo3NzcuY29tIiwiaWF0IjoxNTQ2MzAwODAwLCJleHAiOjE5MjQ5MDU2MDB9.Woo7W8ejOU-EW7pZqzzI72RWEPOvqzMOVyoSbGokSRQ


-----------------------------
Header: {
  "alg": "HS256",
  "typ": "JWT"
}
Payload:
{
  "userName": "bob",
  "firstName": "Bob",
  "lastName": "Kweinlousi",
  "emailAddress": "bob.Kweinlousi@xyz777.com",
  "iat":1514592000,
  "exp":1539129600
}
secret: abcd123456
access token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImJvYiIsImZpcnN0TmFtZSI6IkJvYiIsImxhc3ROYW1lIjoiS3dlaW5sb3VzaSIsImVtYWlsQWRkcmVzcyI6ImJvYi5Ld2VpbmxvdXNpQHh5ejc3Ny5jb20iLCJpYXQiOjE1MTQ1OTIwMDAsImV4cCI6MTUzOTEyOTYwMH0.sVqprALY4GpasVYlVC1c2n4KTHE3Rf1PUQHL43wwEtU

--------------------------------------------
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImRhbiIsImZpcnN0TmFtZSI6IkRhbmllbCIsImxhc3ROYW1lIjoiU21pdGgiLCJlbWFpbEFkZHJlc3MiOiJkYW5pZWwuc21pdGhAeHl6Nzc3LmNvbSIsImlhdCI6MTU0NjMwMDgwMCwiZXhwIjoxOTI0OTA1NjAwfQ.e7uA4J2FSTkK9kAtNiTFqKMYrFRCwWoQamfi5rj-SPM
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRpbSIsImZpcnN0TmFtZSI6IlRpbSIsImxhc3ROYW1lIjoiTWlsbGVyIiwiZW1haWxBZGRyZXNzIjoidGltLk1pbGxlckB4eXo3NzcuY29tIiwiaWF0IjoxNTQ2MzAwODAwLCJleHAiOjE5MjQ5MDU2MDB9.Woo7W8ejOU-EW7pZqzzI72RWEPOvqzMOVyoSbGokSRQ
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImJvYiIsImZpcnN0TmFtZSI6IkJvYiIsImxhc3ROYW1lIjoiS3dlaW5sb3VzaSIsImVtYWlsQWRkcmVzcyI6ImJvYi5Ld2VpbmxvdXNpQHh5ejc3Ny5jb20iLCJpYXQiOjE1MTQ1OTIwMDAsImV4cCI6MTUzOTEyOTYwMH0.sVqprALY4GpasVYlVC1c2n4KTHE3Rf1PUQHL43wwEtU

*/
const users: UserData[] = [
  {
    userName: "dan",
    password: "d123",
    firstName: "Daniel",
    lastName: "Smith",
    emailAddress: "daniel.smith@xyz777.com"
  },
  {
    userName: "tim",
    password: "tim78",
    firstName: "Tim",
    lastName: "Miller",
    emailAddress: "tim.Miller@xyz777.com"
  },
  {
    userName: "bob",
    password: "bob2",
    firstName: "Bob",
    lastName: "Kweinlousi",
    emailAddress: "bob.Kweinlousi@xyz777.com"
  }
];

const tokenHash: Hashmap = {
  dan:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImRhbiIsImZpcnN0TmFtZSI6IkRhbmllbCIsImxhc3ROYW1lIjoiU21pdGgiLCJlbWFpbEFkZHJlc3MiOiJkYW5pZWwuc21pdGhAeHl6Nzc3LmNvbSIsImlhdCI6MTU0NjMwMDgwMCwiZXhwIjoxOTI0OTA1NjAwfQ.e7uA4J2FSTkK9kAtNiTFqKMYrFRCwWoQamfi5rj-SPM",
  tim:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRpbSIsImZpcnN0TmFtZSI6IlRpbSIsImxhc3ROYW1lIjoiTWlsbGVyIiwiZW1haWxBZGRyZXNzIjoidGltLk1pbGxlckB4eXo3NzcuY29tIiwiaWF0IjoxNTQ2MzAwODAwLCJleHAiOjE5MjQ5MDU2MDB9.Woo7W8ejOU-EW7pZqzzI72RWEPOvqzMOVyoSbGokSRQ",
  bob:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImJvYiIsImZpcnN0TmFtZSI6IkJvYiIsImxhc3ROYW1lIjoiS3dlaW5sb3VzaSIsImVtYWlsQWRkcmVzcyI6ImJvYi5Ld2VpbmxvdXNpQHh5ejc3Ny5jb20iLCJpYXQiOjE1MTQ1OTIwMDAsImV4cCI6MTUzOTEyOTYwMH0.sVqprALY4GpasVYlVC1c2n4KTHE3Rf1PUQHL43wwEtU"
};

const transactions: Transaction[] = [
  {
    userName: "dan",
    transactionId: 1,
    transactionRef: "X890W567",
    action: "Transfer In",
    amount: 3000.0,
    subjectName: "Linda Schmit",
    transactionDate: new Date("2019-01-16"),
    transactionMethod: "www"
  },
  {
    userName: "dan",
    transactionId: 2,
    transactionRef: "Y378W547",
    action: "Transfer In",
    amount: 6000.0,
    subjectName: "Peter Song",
    transactionDate: new Date("2019-09-19"),
    transactionMethod: "ACH"
  },
  {
    userName: "dan",
    transactionId: 3,
    transactionRef: "Q569T643",
    action: "Transfer Out",
    amount: 2000.0,
    subjectName: "Terry Mingie",
    transactionDate: new Date("2019-10-31"),
    transactionMethod: "www"
  },
  {
    userName: "tim",
    transactionId: 4,
    transactionRef: "A333K789",
    action: "Transfer In",
    amount: 870.0,
    subjectName: "Kurt Peterson",
    transactionDate: new Date("2019-04-08"),
    transactionMethod: "ACH"
  },
  {
    userName: "tim",
    transactionId: 5,
    transactionRef: "S657Y896",
    action: "Transfer Out",
    amount: 64.0,
    subjectName: "Julia King",
    transactionDate: new Date("2019-11-01"),
    transactionMethod: "www"
  }
];

@Injectable()
export class MockService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
      .pipe(delay(10))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith("/users/authenticate") && method === "POST":
          return authenticate();
        case url.endsWith("/getTransactions"):
          return getTransactions();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { username, password } = body;
      const user = users.find(
        x => x.userName === username && x.password === password
      );
      if (!user) return error("Username or password is incorrect");

      let mytoken = tokenHash[username];
      let result: User = {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        accessToken: mytoken
      };

      return ok(result);
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return ok(users);
    }

    function getTransactions() {
      if (!isLoggedIn()) return unauthorized();

      // todo: to validate the token

      const helper = new JwtHelperService();
      const authHeader = headers.get("Authorization");
      const myRawToken = authHeader.replace("Bearer ", "");
      const decodedToken = helper.decodeToken(myRawToken);
      let username = decodedToken.userName;
      const result = transactions.filter(x => x.userName === username);
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
