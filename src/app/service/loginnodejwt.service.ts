import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { User } from '../model/user.model';
import { environment } from 'src/environment/environment';
import * as jwt_decode from "jwt-decode";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginNodeJwtService {
  authObservable$:Observable<any> | undefined;
  backUrl: string | undefined;
  router: any;
    backNodeJWTUrl: string;
  constructor(  private http: HttpClient,   private routerL: Router) {  this.backUrl =  environment.bakendUrl;
    this.backNodeJWTUrl =  environment.backNodeJWTUrl;
  }

  login( person:User ): any  | undefined{
       this.loginOb(person).then( (response:any) => { 
      
        
      let status = response.status;
      console.log("LOGIN completed sucessfully. The response received "+status);
      console.log("response body "+ response.body)
      console.log("response "+ JSON.stringify(response))
      let bb:any = response.body;
      let userInfo:any  = { id: " ",
              username: "Vinayak",
              email: "vvanvekar@gmail.com",
              roles: [
                  "ROLE_USER"
              ],
              accessToken:''} ;
              console.log("response.body.username "+response.body.username)
              console.log("response.body.email "+response.body.email)
              localStorage.setItem("sub",response.body.username)
              localStorage.setItem("email",response.body.email)
              this.authObservable$ = of(response.body)         
              this.routerL.navigate(['/dashboard']);
            return  {"token": response.body} ;

     }
    ).catch((err:any) => { console.log("Login Error "); this.authObservable$ = of("Error ")
          return  "Error " 
    } )
    return this.authObservable$;

  }
 async loginOb(person:User ):Promise<any> {
    const headers =   new HttpHeaders({ 'Content-Type': 'application/json' ,  
     'X-Test-Header': 'text/plain' ,  'Authorization': 'text/plain'});
    
    //{ 'content-type': 'application/json'}  
    const body=JSON.stringify(person);
    try {  
      const response = await firstValueFrom(  
        this.http.post( this.backNodeJWTUrl + '/auth/signin', body,{withCredentials: true, 'headers':headers , observe: 'response'})
      )
      
      return  response;
    }catch (error ){
      console.log("Login backed service unreacable .... ")
      return  error
    }
     
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

 // Read a specific cookie value by name
 readCookie(name: string, headerc:string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  let caa = headerc;
  if(Array.isArray(caa)){ 
    for (let i = 0; i < caa.length; i++) {
    let c = caa[i].trim();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
    }
  }

  return null; // If cookie not found
}
  /*login () { 

        // Send login request to the backend
        this.http.post(this.backUrl , { username, password, rememberMe })
        .subscribe(
          (response: any) => {
            console.log(response); // Handle successful login response
            // Store token or redirect based on response
            if (response.token) {
              // Navigate to the dashboard or another page
              this.router.navigate(['/dashboard']);
            }
          },
          (error) => {
            console.error('Login failed', error);
            alert('Invalid credentials');
          }
        );
  }
        */
}
 
/*

{
  "id": "674ec03626d2ec878da3b6f5",
  "username": "Vinayak",
  "email": "vvanvekar@gmail.com",
  "roles": [
    "ROLE_USER"
  ],
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGVjMDM2MjZkMmVjODc4ZGEzYjZmNSIsImlhdCI6MTczMzIxNDM1MSwiZXhwIjoxNzMzMzAwNzUxfQ.btxlLmhr4DrYceTET1JxJE8wVwlUc4nEFwMXWFgFZ1A"
}

*/

/*

 if(bb !=null) 
      if(Object.keys(bb).length > 4) {
        let em :any = {};
         if(Array.isArray(Object.values(bb))){
           em = Object.values(bb);
          }
          let idx = 0;
          for (const key in bb)
              {  
                 // Get the strongly typed value with this name:
                 const value =em[idx++].toString();
                // console.log("  "+value);
               switch( key ) {
                   case 'id':  userInfo.id = Object.values(bb)[idx]
                      break;
                      case 'username':userInfo.username = Object.values(bb)[idx]
                          break;
                          case 'email': userInfo.email= Object.values(bb)[idx]
                              break;
                              case 'roles': userInfo.roles = Object.values(bb)[idx]
                                  break;
                                  case 'accessToken':  userInfo.accessToken = Object.values(bb)[idx]
                                      break;
               }
               idx++
               }                      
           }    
           let merResp = Object.assign({} , this.getDecodedAccessToken( userInfo.accessToken) , response.body);
           console.log("merResp "+JSON.stringify(merResp))
           this.authObservable$ = of({"token": merResp});





  .subscribe(
       response=> {
             let status = response.status;
            console.log("LOGIN completed sucessfully. The response received "+status);
            let bb = response.body;
            let userInfo  = { id: " ",
                    username: "Vinayak",
                    email: "vvanvekar@gmail.com",
                    roles: [
                        "ROLE_USER"
                    ],
                    accessToken:''} ;
            if(bb !=null)
            if(Object.keys(bb).length > 4) {
               if(Array.isArray(Object.values(bb))){
                  let em = Object.values(bb);
                }
                let idx = 0;
                for (const key in bb)
                    {  
                       // Get the strongly typed value with this name:
                       const value =Object.values(bb)[idx++].toString();
                      // console.log("  "+value);
                     switch( key ) {
                         case 'id':  userInfo.id = Object.values(bb)[idx]
                            break;
                            case 'username':userInfo.username = Object.values(bb)[idx]
                                break;
                                case 'email': userInfo.email= Object.values(bb)[idx]
                                    break;
                                    case 'roles': userInfo.roles = Object.values(bb)[idx]
                                        break;
                                        case 'accessToken':  userInfo.accessToken = Object.values(bb)[idx]
                                            break;
                     }
                     idx++
                     }                      
                 }    
                 let merResp = Object.assign({} , this.getDecodedAccessToken( userInfo.accessToken) , response.body);
             
                 this.authObservable$ = of({"token": merResp});
           }
          
        ,
        error => {
            console.log("login  failed with the errors");
            this.authObservable$ = of(error);
        }
     ) );
*/