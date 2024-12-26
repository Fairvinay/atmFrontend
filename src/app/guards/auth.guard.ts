import { Injectable } from "@angular/core";
import { CanActivate, Router ,ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { Location } from '@angular/common';

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
private readonly JWT_TOKEN = "JWT_TOKEN";
 
  constructor(private authService: AuthService, private router: Router,private location: Location) {}

  canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
    console.log(" login  "+next.url)
     let ft = "";
     let op = localStorage.getItem(this.JWT_TOKEN);
     
     if(op === undefined || op ==="undefined" || op ==="" || op ===null) {
           localStorage.removeItem(this.JWT_TOKEN);
	}
    //console.log("Guard evaluating: state.url  "+state.url)
   /* const url = new URL(state.url);
    // Get query parameters using URLSearchParams this also causes page to stck 
    const params = new URLSearchParams(url.search);
    const jwt_toke = params.get('jwt_token'); // 'NewYork'
    if(jwt_toke){
      localStorage.setItem(this.JWT_TOKEN,jwt_toke);
      console.log("jwt set ")
    }*/
    // we can get the jwt_token from the state.url 
    let jtIndx  =state.url.indexOf('jwt_token');
     if( jtIndx > -1 ){
           let jtCom = jtIndx+'jwt_token='.length
           let jt = state.url.substring(jtCom);
           localStorage.setItem(this.JWT_TOKEN,jt);
           console.log("jwt set ")
     }
      // Access query parameters from the routestate.url
   /*  next.queryParams.subscribe((params: { [x: string]: any; }) => {
      const paramValue = params['jwt_token'];  // Replace 'myParam' with the query param you're looking for
      console.log( 'auth gaurd param '+ paramValue);
    });
    */


     if (cookieExists('JWT_TOKEN')) {
       console.log("Cookie exists")
	//remove undefined 
         let ck = document.cookie.split(';');
 	 let pp= "";
         for( pp in ck){  
		if(pp.indexOf('JWT_TOKEN') > -1 ) {
		      if( pp.indexOf('undefined') > -1 ) { 
		         
			   break;
	              }
                }
          }
      }
    return this.authService.isLoggedIn$().pipe(
      tap((isLoggedIn) => {
        if (isLoggedIn) {
           // Simulate login success, and you want to remove URL parameters
          // this.removeUrlParameters();
         //  const currentUrlW = window.location.pathname;
          // window.history.replaceState({}, '', currentUrlW);
           //this.location.go(this.authService.INITIAL_PATH,"", window.history.pushState) 
           this.router.navigate([this.authService.INITIAL_PATH]);
        }
      }),
      map((isLoggedIn) => !isLoggedIn)
    );
  }
  removeUrlParameters() {
    // Replace the current URL without the parameters
    console.log("removing the paratmeters "+ this.router.url.split('?')[0])
    const currentUrl = this.router.url.split('?')[0];
    this.location.replaceState(currentUrl);
  }
}
export function cookieExists(cookie: string): boolean { 
  return document.cookie
    .split(';')
    .some((item) => item.trim().startsWith(`${cookie}=`));
}
