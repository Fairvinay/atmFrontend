import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContactComponent } from './components/contact/contact.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FaqComponent } from './components/faq/faq.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MusicComponent } from './components/music/music.component';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import  bs58  from 'bs58'


import { AuthModule } from "./auth/auth.module";
import { environment } from 'src/environment/environment';
import { AcknowledgeComponent } from './components/acknowledge/acknowledge.component';

let arr = new Uint8Array(bs58.decode(  environment.CLIDActual))  ;//.toString('utf-8');
 let decodedclidBase58 = Array.from( arr )
       .map( (val) => val.toString( 16 ).padStart( 2,"0" ) )
       .join(" ");

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AcknowledgeComponent,
    DashboardComponent,
    SidebarComponent,
    ContactComponent,
    ProfileComponent,
    FaqComponent,
    MusicComponent  
  ],
  imports: [
    BrowserModule,AuthModule,
    AppRoutingModule, HttpClientModule,FormsModule, ReactiveFormsModule  //imported the module
  ],
  providers: [

    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'en',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              `${decodedclidBase58}.apps.googleusercontent.com`
            )
          }
          /*{
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }*/
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
