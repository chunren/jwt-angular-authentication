import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../shared/services/auth.service";
import { User } from "../../shared/models/user.interface";

@Component({
  selector: "app-myprofile",
  templateUrl: "./myprofile.component.html",
  styleUrls: ["./myprofile.component.scss"]
})
export class MyprofileComponent implements OnInit {
  currentUser: User;
  constructor(private authService: AuthService) {}
  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
  }
}
