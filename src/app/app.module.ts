import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "../shared/authentication/auth.interceptor";
import { ErrorInterceptor } from "../shared/authentication/error.interceptor";
import { mockService } from "../shared/services/mock.service";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { MyprofileComponent } from "./myprofile/myprofile.component";
import { MytransactionsComponent } from "./mytransactions/mytransactions.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MyprofileComponent,
    MytransactionsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    mockService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
