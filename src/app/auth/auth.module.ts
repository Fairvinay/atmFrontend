import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { LoginComponent } from "../components/login/login.component";
//import { ForRolesDirective } from "./directives/for-roles.directive";
import { AuthRoutingModule } from "./auth-routing.module";
import { authStrategyProvider } from "../services/auth.strategy";
import { AuthInterceptor } from "./auth.interceptor";
import { AppRoutingModule } from "../app-routing.module";
import { ForRolesDirective } from "./directives/for-roles.directive";
/*import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";


import { LoginComponent } from "./containers/login/login.component";
import { SignupComponent } from "./containers/signup/signup.component";
import { ConfirmComponent } from "./containers/confirm/confirm.component";

import { PasswordComponent } from "./containers/password/password.component";
import { RecoverComponent } from "./containers/recover/recover.component";
import { OAuthComponent } from "./containers/oauth/oauth.component";
import { OtpComponent } from "./components/otp-dialog/otp.component";
import { LogoutComponent } from './logout/logout.component';
import { LayoutComponent } from "app/core/layout/layout.component";
*/
@NgModule({
  declarations: [
   ForRolesDirective,
    /*SignupComponent,
    ConfirmComponent,
    ForRolesDirective,
    PasswordComponent,
    RecoverComponent,
    OAuthComponent,
    OtpComponent,
    LogoutComponent, */
  ],
  exports: [ForRolesDirective],
  imports: [
    CommonModule,
    RouterModule, 
    AppRoutingModule,
   /* AuthRoutingModule,*/
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    authStrategyProvider,
  ],
})
export class AuthModule {}
