import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../shared/services/auth.service";
import { User } from "../shared/models/user";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  isLoggedIn: boolean;
  currentUser: User;
  constructor(private router: Router, private authService: AuthService) {
    this.authService.isUserLoggedin.subscribe(x => (this.isLoggedIn = x));
    this.authService.currentUser.subscribe(y => (this.currentUser = y));
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/"]);
  }
}
