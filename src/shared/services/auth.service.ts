import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { User } from "../models/user.interface";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({ providedIn: "root" })
  
export class AuthService {
  private _currentUser: User;
  public isUserLoggedin: Observable<boolean>;
  public isUserLoggedinSubject: BehaviorSubject<boolean>;
  public currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private CURRENT_USER = "currentUser";

  constructor(private http: HttpClient) {
    this.refreshUserData();
  }

  refreshUserData() {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem(this.CURRENT_USER))
    );

    this.currentUser = this.currentUserSubject.asObservable();

    this.isUserLoggedinSubject = new BehaviorSubject<boolean>(this.isLoggedIn);
    this.isUserLoggedin = this.isUserLoggedinSubject.asObservable();
  }
  public get currentUserValue(): User {
    if (this.currentUserSubject) return this.currentUserSubject.value;
    else return null;
  }

  public get accessToken(): String {
    if (this.currentUserSubject && this.currentUserSubject.value && this.currentUserSubject.value.accessToken)
      return this.currentUserSubject.value.accessToken;
    
    return null;
  }

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

  public isTokenExpired(rawToken: string): boolean {
    if (rawToken) {
      const helper = new JwtHelperService();
      const isTokenExpired = helper.isTokenExpired(rawToken);
      if (isTokenExpired) return true;
    }
    return false;
  }

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

  public logout() {
    localStorage.removeItem(this.CURRENT_USER);
    if (this.currentUserSubject) this.currentUserSubject.next(null);
    if (this.isUserLoggedinSubject) this.isUserLoggedinSubject.next(false);
  }
}
