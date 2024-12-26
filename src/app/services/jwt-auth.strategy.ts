import { Observable, of } from "rxjs";
import { AuthStrategy } from "./auth.strategy";
import { Token } from "@models/token";
import { User } from "@models/user";
import * as jwt_decode from "jwt-decode";

export class JwtAuthStrategy implements AuthStrategy<Token> {
  private readonly JWT_TOKEN = "JWT_TOKEN";

  doLoginUser(token: Token): void {
    console.log(" doLogin user "+token)
    localStorage.setItem(this.JWT_TOKEN, token.jwt);
  }

  doLogoutUser(): void {
    localStorage.removeItem(this.JWT_TOKEN);
  }
  

  getCurrentUser(): Observable<any> {
    const token = this.getToken();
    let atob = false;
    try {
      if (token ) {
         let deToken =     this.getDecodedAccessToken(token);
         if(deToken!== undefined && deToken !== null && deToken !==''){
            console.log(" json "+JSON.stringify(deToken))
             const { role, email , confirmed , accountId }  =  deToken
             localStorage.setItem("sub",role)
             localStorage.setItem("email",email)
         }
         else {
            console.log("user not parsed ")
         }
        const encodedPayload = token.split(".")[1];
        const payload = window.atob(encodedPayload);
        console.log(" payloadd  read ")
      }
      console.log(" doLogin user token atob OKAY ")
      atob = true;
    }catch {

      console.log(" doLogin user token atob not okay OKAY ")
    }
    if (token && atob ) {
      const encodedPayload = token.split(".")[1];
      const payload = window.atob(encodedPayload);
      return of(JSON.parse(payload));
    } else {
      return of(undefined);
    }
  }

  getToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }
  getDecodedAccessToken(token: string| undefined | null): any {
    try {
      if(token )
      return jwt_decode.jwtDecode(token);
      else  return null;
    } catch(Error) {
      return null;
    }
  }
   stringify(obj: JwtAuthStrategy ) { 
     let cache:any =[];
     let cachStr: string = ' ' ;
        let str = JSON.stringify(obj, function(key,value) { 
		  if(typeof value==='object' && value !==null) { 
			if(cachStr.indexOf(value) !== -1) {
                           // Circular reference found , discard key 
			  return ;
                         }
                        // Store value in out collection
                       cache.push(value);
                   }
                   return value;
                  }); 
       cache = null; 
       return str; 
  }   
  

}
/*
{"accountId":"2e56Nw4Mxke0iftXNZi9UVcsxk3oOtgksrjuH2hvZQJV86LnGXkwBfnp8jnLoMJMKfYdJx8Dj0gkEh9KsjCdWIwFYlQx8zq7OuHzN8xMkzfQYO5GZl3xyXEbhaM4tGvA8GbbSG17eiSpfwm2nR8UH03j48qX5hjAVnzX2Cde1mLvgfzN0f6ieZ1ytWTz5u5MwUcsgOxgj0BqMVAmJiH2qpW0CrWBXkzCrvZsB1illAjLvQRC28uzpnqI67WeYbwG",
"email":"glaubhanta@gmail.com","role":"OWNER","confirmed":false,"iat":1734791834,"exp":1734792434}
*/