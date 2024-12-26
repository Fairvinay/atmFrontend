import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { CanActivate, CanLoad, Router ,ActivatedRoute ,ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AppGuard implements CanActivate, CanLoad {
  id: string = '';
   private readonly JWT_TOKEN = "JWT_TOKEN";
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    
    let vra =  this.route.snapshot.paramMap.get('jwt_token');
    if( vra !== null)
     { this.id = vra }
    else { 
      this.id =  '';
    } 
     console.log(" App Construct typeof this.id "+(typeof this.id != undefined || this.id != null) )
    if (this.id != undefined || this.id != null || this.id != '') {
        // set the jwt_token
          localStorage.setItem(this.JWT_TOKEN, this.id);
    }
  }

  canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
      let ft = "";
     if (cookieExists('JWT_TOKEN')) {
	 let ck = document.cookie.split(';');//.filter((item) => item.trim().startsWith("JWT_TOKEN="));
	 for( let pp =0; pp< ck.length; pp++){
	      let t =  ck[pp];
		if(t.indexOf('JWT_TOKEN') > -1 ) {
		       ft = t.substring((t.indexOf('JWT_TOKEN') + 'JWT_TOKEN='.length));
		    break;
                }
	  }
	 if(ft !==""){
            localStorage.setItem(this.JWT_TOKEN, ft );
                 console.log(" parameter set , may test accessing dashboar ");
         }
      }
    console.log('[ResetPasswordGuard]', JSON.stringify(next.params)); 
    console.log('[queryParamMap]', JSON.stringify(next.queryParamMap)); 
    console.log('[paramMap]', JSON.stringify(next.paramMap)); 

    let vra = next.paramMap.get('jwt_token');
    if( vra !== null)
     { this.id = vra }
    else { 
      this.id =  '';
    } 
  
    let qid = next.queryParamMap.get('jwt_token')
    console.log(" typeof this.id "+(typeof this.id != undefined || this.id != null) )
    console.log(" typeof qid "+(typeof qid !== undefined || qid !== null || qid !=='') )
    if( this.id != undefined || this.id != null ) {
        console.log(" this.id "+this.id)
        // set the jwt_token
          localStorage.setItem(this.JWT_TOKEN, this.id);
       
    }
    if ( qid != undefined || qid != null ){
       console.log(" qid "+qid)
       // set the jwt_token
          localStorage.setItem(this.JWT_TOKEN, qid);
    }
    else{
          console.log("token not in path and query param ")
        }
    console.log("app CanActiate")
    return this.canLoad();
  }

  canLoad(): Observable<boolean> {
    console.log("app canLoad ")
    return this.authService.isLoggedIn$().pipe(
      tap((isLoggedIn) => {
        console.log(" --> "+isLoggedIn)
        if (!isLoggedIn) {
          this.router.navigate(["/login"]);
        }
      })
    );
  }
}
export function cookieExists(cookie: string): boolean { 
  return document.cookie
    .split(';')
    .some((item) => item.trim().startsWith(`${cookie}=`));
}
