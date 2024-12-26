import { Injectable, Inject } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

import { config } from "../core/config";
import { AuthService } from "../services/auth.service";
import { JwtAuthStrategy } from "../services/jwt-auth.strategy";
import { AUTH_STRATEGY } from "../services/auth.strategy";
import { isNullOrUndefined } from "../core/utils";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    @Inject(AUTH_STRATEGY) private jwt: JwtAuthStrategy
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // check for JWT_TOKEN cookie in HEADER 
    console.log(' intercepting the call.... ' )
    let jwt_token_cookie = request.headers.get('JWT_TOKEN');	
    let jwt_token_header = request.headers.get('Authorization');	
    let jwt_token_request=  request.params.get('jwt_token')
    console.log('jwt_token_request '+jwt_token_request )
    if(jwt_token_header !==null) { 
      if (jwt_token_header !== 'text/plain' ){ 
       jwt_token_header = jwt_token_header?.replace("Bearer ","")
      }
    }
    if ( !isNullOrUndefined (jwt_token_request )) {
      if (jwt_token_request !== 'text/plain' ){ 
      request = this.addToken(request,jwt_token_request );
      console.log(' request param present may try access ' )
        }
    }   
    if ( !isNullOrUndefined(jwt_token_header )) {
      if (jwt_token_header !== 'text/plain' ){ 
      request = this.addToken(request,jwt_token_header );
      console.log(' header present may try access ' )
      }
    }   
    if ( !isNullOrUndefined( jwt_token_cookie )) {
      if (jwt_token_cookie !== 'text/plain' ){ 
      request = this.addToken(request,jwt_token_cookie );
      console.log(' cookie present may try access ' )
      }
    }   
    if (config.auth === "token" && this.jwt && this.jwt.getToken()) {
      let t : any= this.jwt.getToken();
      if( t !== null && t !== undefined && t !== 'text/plain'){
       
        request = this.addToken(request,t);
      }
    
    }
    request = request.clone({
      withCredentials:true
      ,
    });
  
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.authService.doLogoutAndRedirectToLogin();
        }
        return throwError(error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }
}
