# JWT (Json Web Token) in Angular Authentication

This project demonstrates how to use JWT for authentication in Anuglar 8 application.
## 1. JWT
JWT stands for Json Web Token, which is a JSON-based access token. JWT is widely used for authentication and authorization in Web applications, and it can assert quite some number of claims by the authentication server that is trusted by application servers via sharing a secret key or the Public-key scheme. A client can obtain the JWT by supplying the credentials (e.g., username and password) to the authentication server.  The client can store the JWT in the local storage and use the JWT as a cookie. The client can subsequently send the JWT to application servers, and the application server can assert the claims of the token by checking or verifying the token's signautre.  If the assertion is successful, the application can then authorize the clients for the resource requests based on the claims of the token. The following is the JWT sequence diagram. More information can be found in Ref[1].

## 2. JWT Sequences:
![alt text](https://github.com/chunren/markdown-src/blob/master/raw/images/jwt_sequence_clai.PNG "JWT sequences")

## 3. JWT Examlple:
A JWT includes three portions: Header, Payload, and Signaure.  

The Header identifies which algorithm is used to generate the signature. Normally, "HS256" algorithm means the token is signed by HMAC-SHA256, and "RS256" inidicates it is a RSA signature with SHA-256.  

The Payload stores a set of claims. The JWT specification defines seven Registered Claim Names which are the standard fields commonly included in tokens, and Custome claims are also usually included, depending on the purpose of the token. Ref[1]  

Signaute is used to validatet he token via the cryptography.  

The three parts are encoded separately using Base64url Encoding, and concatenated using periods to produce the JWT:  

const token = base64urlEncoding(header) + '.' + base64urlEncoding(payload) + '.' + base64urlEncoding(signature)

You can use the debugger of JWT - See [jwt.io](https://jwt.io/) -- See Ref [2] to generate and validate a JWT.  
One example is:  

Header:
```
{
  "alg": "HS256",
  "typ": "JWT"
}
``` 
Payload:
```
{
  "userName": "tim",
  "firstName": "Tim",
  "lastName": "Miller",
  "emailAddress": "tim.Miller@xyz777.com",
  "iat":1546300800,
  "exp":1924905600
}
``` 

with <span style="color:red">secret key</span> as: `secret: abcd123456`
  
The Signature is:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRpbSIsImZpcnN0TmFtZSI6IlRpbSIsImxhc3ROYW1lIjoiTWlsbGVyIiwiZW1haWxBZGRyZXNzIjoidGltLk1pbGxlckB4eXo3NzcuY29tIiwiaWF0IjoxNTQ2MzAwODAwLCJleHAiOjE5MjQ5MDU2MDB9.Woo7W8ejOU-EW7pZqzzI72RWEPOvqzMOVyoSbGokSRQ
```

Ref[1]: Whenever the user wants to access a protected route or resource, the user agent should send the JWT, typically in the Authorization header using the Bearer schema. The content of the header might look like the following:

<span style="color:green">Authorization: Bearer </span><span style="color:yellow">eyJhbGci...<snip>...VyoSbGokSRQ</span>
  
![alt text](https://github.com/chunren/markdown-src/blob/master/raw/images/jwt_angular_jwt_encoded_clai.png "JWT Exaple")

## 4. Angular Code:
This project demonstrate how to use the JWT to authenticate a client, and use the JWT to request the secured resources or routes in an angular application. A mock is used to provide the authentication results and the response of the application servers.  

The major parts include:  

### 4.1 Environment Configuration:  
The code is at `src\environments\environment.ts`:
```
export const environment = {
  production: false,
  authApiUrl: "http://localhost:4000/users/authenticate",
  resourceApiUrl: "http://localhost:3000",
  mock: true
};
```
The `authApiUrl` configures the URL of the authenticatoin server.  
The `resourceApiUrl` configures the URL of the applicaiotn server.  
The `mock`: true to use the mock services, false to use the real services defined in the `authApiUrl` and `resourceApiUrl`  


### 4.2 Authentication Service:   
Authentication service provides the authentication requests, saves the JWT in the local storage, and check whether the client is logged in based on whether the JWT is presented or not and whether the JWT expires or not. The code is at `src\shared\services\auth.service.ts`.

Some examples are:
```
public login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.authApiUrl}`, { username, password })
      .pipe(
        map(res => {
          this._currentUser = <User>{
            accessToken: res.accessToken,
            userName: res.userName,
            emailAddress: res.emailAddress,
            firstName: res.firstName,
            lastName: res.lastName
          };

          if (this.isTokenExpired(res.accessToken)) {
            return null;
          } else {
            localStorage.setItem(
              this.CURRENT_USER,
              JSON.stringify(this._currentUser)
            );
            this.currentUserSubject.next(this._currentUser);
            this.isUserLoggedinSubject.next(true);
            return this._currentUser;
          }
        })
      );
  }
```

```
public get isLoggedIn(): boolean {
    if (this.currentUserSubject) {
      const userData = this.currentUserSubject.value;
      if (userData) {
        const helper = new JwtHelperService();
        const myRawToken = userData.accessToken;
        if (myRawToken) {
          const isTokenExpired = helper.isTokenExpired(myRawToken);
          if (!isTokenExpired) return true;
        }
      }
    }
    // if the token expired, remove the token
    this.logout();
    return false;
  }
```

### 4.2 Authentication Interceptor  
It intercepts the HTTP trafifce to add the JWT token in the header.  The code is at `src\shared\authentication\auth.interceptor.ts`
```
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
```


### 4.3 Mock Services  
They provide the mock data, and mock service of the authentication response and the response of resource requests.  Teh code is at `src\shared\mock\mock-data.service.ts` which simulates the backend database and `src\shared\mock\mock.service.ts` which simulates the resource API call results.
The following is part of the mock service.
```
@Injectable()
export class MockService implements HttpInterceptor {
 
  constructor(private mockDataService: MockDataService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!environment.mock)
      return next.handle(request);
    
    const { url, method, headers, body } = request;
    let myMockDataService = this.mockDataService;
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
      
      let user = myMockDataService.users.find(
        x => x.userName === username && x.password === password
      );
      if (!user) return error("Username or password is incorrect");

      let mytoken = myMockDataService.tokenHash[username];
      let result: User = {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        accessToken: mytoken
      };

      return ok(result);
    }

    function getTransactions() {
      if (!isLoggedIn()) return unauthorized();

      const helper = new JwtHelperService();
      const authHeader = headers.get("Authorization");
      const myRawToken = authHeader.replace("Bearer ", "");
      const decodedToken = helper.decodeToken(myRawToken);
      let username = decodedToken.userName;
      const result = myMockDataService.transactions.filter(x => x.userName === username);
      return ok(result);
    }

```

## 5. Run JWT Angular Appliction in your local DEV environment:
1. Install NodeJs. You can download and install NodeJS from  [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
2. Download or clone the applicaiton source code from [https://github.com/chunren/jwt-angular-authentication.git](https://github.com/chunren/jwt-angular-authentication.git) to your local folder like E:\\jwt-angular-authentication
3. In the project root folder where the package.json is located, run: nmp install
4. In the browser, type in the URL: http://localhost:4200/, and click the "Login" link.


## 6. Angular Application:

### 6.1 Login Page:
![alt text](https://github.com/chunren/markdown-src/blob/master/raw/images/jwt_angular_login_clai.png "Login Page")

### 6.2 Home Page:
![alt text](https://github.com/chunren/markdown-src/blob/master/raw/images/jwt_angular_home_clai.png "Login Page")

### 6.3 Secured Page - My Profile:
![alt text](https://github.com/chunren/markdown-src/blob/master/raw/images/jwt_angular_myprofile_clai.png "My Profile Page")

### 6.4 Secured Page - My Transactions:
![alt text](https://github.com/chunren/markdown-src/blob/master/raw/images/jwt_angular_mytransactions_clai.png "My Transactions Page")


## References

1. Json Web Token in Wikipedia. -- [https://en.wikipedia.org/wiki/JSON_Web_Token](https://en.wikipedia.org/wiki/JSON_Web_Token)
2. Json Web Token. -- [jwt.io](https://jwt.io/)
3. Angular 8 JWT Authentication Example by Jason Watmore -- [https://github.com/cornflourblue/angular-8-jwt-authentication-example](https://github.com/cornflourblue/angular-8-jwt-authentication-example)
4. Angular 8 | JSON Web Token Authentication Tutorial with Login/ Dashboard and Guards using angular2-jwt -- [https://www.freakyjolly.com/angular-json-web-token-authentication-tutorial-using-angular2-jwt/](https://www.freakyjolly.com/angular-json-web-token-authentication-tutorial-using-angular2-jwt/)
5. Angular Security - Authentication With JSON Web Tokens (JWT): The Complete Guide -- [https://blog.angular-university.io/angular-jwt-authentication/](https://blog.angular-university.io/angular-jwt-authentication/)
6. Angular 7/8 Authentication with JWT Tutorial -- [https://www.techiediaries.com/angular-jwt/](https://www.techiediaries.com/angular-jwt/)






