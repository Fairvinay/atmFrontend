import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, OperatorFunction, tap } from 'rxjs';
import { User } from '../model/user.model';
import { environment } from 'src/environment/environment';
import * as jwt_decode from "jwt-decode";
import axios, { AxiosHeaders, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { isNullOrUndefined } from '../core/utils';
import { Router } from '@angular/router';
import { Register } from '../model/register.model';
//import { wrapper } from 'axios-cookiejar-support';
//import  {   CookieJar } from 'tough-cookie';
/*
declare module 'axios' {
  interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}*/

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  authObservable$:Observable<any> | undefined;
  backUrl: string | undefined;
  
  axiosInstance : AxiosInstance | undefined ;
  constructor(  private http: HttpClient,   private router: Router) {  this.backUrl =  environment.bakendUrl;
    //const jar = new CookieJar();
    this. axiosInstance =   axios.create() //{ jar }
    this.axiosInstance.interceptors.request.use((config : InternalAxiosRequestConfig) => {
     if (config.headers) { // <- adding a check 
       let t =  localStorage.getItem('token' )
       if(t !==null && t!==undefined){ 
       config.headers["Authorization"] = `Bearer ${t}`  ; // no errors
       
      }
        config.headers["Access-Control-Allow-Origin "] ="http://localhost:4200"
     }
     config.withCredentials = true; // to include credential, it should be outside of "if" block 
     return config;
   });

  }
     


  register(person:Register ): Observable<any>| undefined {
    const headers =   new HttpHeaders({ 'Content-Type': 'application/json' ,  
     'Authorization': 'text/plain'}); //   'X-Test-Header': 'text/plain' ,
    
    //{ 'content-type': 'application/json'}  
    const body=JSON.stringify(person);
    try {  
       (async () =>  {
      this.http.post( this.backUrl + '/api/v1/user/register', body,{withCredentials: true, 'headers':headers , observe: 'response'})
      .subscribe(
       response=> {
            console.log("REgistertaion completed sucessfully. The response received "+JSON.stringify(response.statusText));
            console.log( " "+ response.headers.get('Location'));
            let setHC =  response.headers.get('Set-Cookie')
           
            this.authObservable$ = of(true);
         },
          error => {
            
              let statusText =  error.statusText 
              let status =  error.status 
              if(  status===200 ) {
                  console.log("register  ok ");
                  this.router.navigate(["/acknowlege"]);
              }
              else {
                console.log("register  failed with the errors "+JSON.stringify(error));
              }

             this.authObservable$ = of(error);
          },
          () => {  
            // executed when the HTTP function has been completed, doesn't matter whether success or error
            this.router.navigate(["/acknowlege"]);
          }
        )
      })();
      return        this.authObservable$;
   
   }catch (error ){
      console.log("register backed service unreacable .... ")
      return of(false)
    }
    return       this.authObservable$;
 
 }


    login(person:User ): Observable<any>| undefined {
    const headers =   new HttpHeaders({ 'Content-Type': 'application/json' ,  
     'Authorization': 'text/plain'}); //   'X-Test-Header': 'text/plain' ,
    
    //{ 'content-type': 'application/json'}  
    const body=JSON.stringify(person);
    try {  
        let bk = this.backUrl ;
        
           

       if( bk!==null  && bk!==undefined && bk.indexOf("awstrap") > -1 ){
          // backend url is aws 
          console.log( "serving cloud spring backend...  ");
          (async () =>  {
                  let config = {
                    headers: {
                     'Content-Type': 'application/json' ,  
                      'Authorization': 'text/plain',
                      'Set-Cookie': 'text/plain',
                    }
                  }
                   bk  = bk + '/api/v1/user/login'
                 const response = await this.axiosInstance?.post(bk,body,config);
                 try { 
                         response?.headers['set-cookie'] 

                         let setHC =  response?.headers['Set-Cookie']
                         if( isNullOrUndefined(setHC)) {
                          setHC =  response?.headers['set-cookie'] 
                           // check refresh-token in case max-age over
                           if( isNullOrUndefined(setHC)) {
                            setHC =  response?.headers['refreshToken'] 
                            }
                         }
                       
                         let setHRC = response?.headers['Set-Cookie'];
                         if( isNullOrUndefined(setHC)) {
                          setHRC =  response?.headers['set-cookie'] 
                           // check refresh-token in case max-age over
                           if( isNullOrUndefined(setHC)) {
                            setHRC =  response?.headers['refreshToken'] 
                            }
                         }
                         setHRC = response?.headers['set-cookie'];
                       
                         let k = undefined
                         let kt = undefined
                         if (setHC) {
                           k =  this.readCookie("token",setHC.toString());
                         }else {
                           k =  this.readCookie("token","");
                         }
                         if(setHRC ) {
                            kt = this.readCookie("refreshToken",setHRC.toString());
                       }else {
                           kt =  this.readCookie("refreshToken","");
                         }
                         if(setHC !== undefined && setHC !== null){
                            let c=   setHC.toString();
                             let c_token =  c.split("=");
                             if(Array.isArray(c_token)){
                               // every even posotion contains a cookie
                               for (let i = 0; i < c_token.length; i++) {
                                 let c = c_token[i].trim();
                                 if (c.indexOf("token") === 0) {
                                    k =   c.substring("token".length, c.length);
                                    console.log( "level 1 server side found ...  ");
                                 }
                                 if (c.indexOf("refreshToken") === 0) {
                                   kt =   c.substring("refreshToken".length, c.length);
                                   console.log( "level 2 server side found ...  ");
                                }
                               }
                             }
                         }
                       
                          
                         if(k !=undefined && kt !=undefined){
                           console.log( "Login contains valid details ...  ");
                         }
                         else {
                           console.log( "Login details missing ...  ");
                         }
                         let merResp = Object.assign({} , this.getDecodedAccessToken(k) , response?.data);
                          
                         this.authObservable$ = of({"token": merResp, "refreshToken": kt});
                        }catch (error ){
                          console.log("Login backed service unreacable .... ")
                          return of(false)
                        }
                        return this.authObservable$;
  
          })();
          

       }
     else { 
        const servRes = from(this.http.post( this.backUrl + '/api/v1/user/login', body,{withCredentials: true, 'headers':headers , observe: 'response'})
                         );
          
        if( servRes!=undefined ) {
        console.log('Capacitor response  observable ready ');
        return servRes.pipe(tap((data) =>  { this.transformServerRes(data) }),
                        catchError(this.errorHandler) );		

          }
         else { 
            return of(false)
         }
             // .pipe(tap ( (serverRes ) => serverRes)) 
     }
    
    
   }catch (error ){
      console.log("Login backed service unreacable .... ")
      return of(false)
    }
    return       this.authObservable$;
 
 }
 errorHandler(error: HttpErrorResponse){

  return of(error?.message || "server error.")
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
 
  async transformServerRes(response: HttpResponse<Object>): Promise<Observable<any>> {
    //let obs: OperatorFunction<Observable<HttpResponse<Object>>,unknown> = of((response:HttpResponse<Object>) => response.clone()  );
     
    try { 
      console.log("LOGIN completed sucessfully. The response received "+JSON.stringify(response.statusText));
      console.log( " "+ response.headers.get('Location'));
      let setHC =  response.headers.get('Set-Cookie')
      let  escapeTokenParsing = false;
      if( isNullOrUndefined(setHC)) {
        setHC =  response.headers.get('X-Test-Header')
         // check refresh-token in case max-age over
         if( isNullOrUndefined(setHC)) {
          setHC = response.headers.get('refreshToken');
          }
          else { 
              escapeTokenParsing = true;
          }
       } 
      let setHRC = response.headers.get('Set-Cookie')
      if( isNullOrUndefined(setHC)) {
        setHC =   response.headers.get('X-Test-Header')
         // check refresh-token in case max-age over
         if( isNullOrUndefined(setHC)) {
          setHC = response.headers.get('refreshToken');
          }
          else {
            escapeTokenParsing = true;
          }
       }
    
      let k = undefined
      let kt = undefined
   if( !escapeTokenParsing){
      if (setHC) {
        k =  this.readCookie("token",setHC.toString());
      }else {
        k =  this.readCookie("token","");
      }
      if(setHRC ) {
         kt = this.readCookie("refreshToken",setHRC.toString());
    }else {
        kt =  this.readCookie("refreshToken","");
      }
      if(setHC !== undefined && setHC !== null){
         let c=   setHC.toString();
          let c_token =  c.split("=");
          if(Array.isArray(c_token)){
            // every even posotion contains a cookie
            for (let i = 0; i < c_token.length; i++) {
              let c = c_token[i].trim();
              if (c.indexOf("token") === 0) {
                 k =   c.substring("token".length, c.length);
                 console.log( "level 1 server side found ...  ");
              }
              if (c.indexOf("refreshToken") === 0) {
                kt =   c.substring("refreshToken".length, c.length);
                console.log( "level 2 server side found ...  ");
             }
            }
          }
      }
    }
     else { 
      k =    kt =  setHC ;
     }
       
      if(k !=undefined && kt !=undefined){
        console.log( "Login contains valid details ...  ");
      }
      else {
        console.log( "Login details missing ...  ");
      }
      let merResp = Object.assign({} , this.getDecodedAccessToken(k) , response.body);
       
      this.authObservable$ = of({"token": merResp, "refreshToken": kt});
   }
   catch(erre){
    this.authObservable$ = of(new Error(JSON.stringify(erre)));
   }
     return  this.authObservable$
  }



  }
 
/*
 CALL one observable from other 

  serviceRunning() {
    return of(this.test).pipe(
      switchMap(val =>
        val ? this.getUserFromRemote() : this.getUserFromLocal()
      )
    );
  }

  getUserFromRemote() {
    return of("User from Remote");
  }

  getUserFromLocal() {
    return of("User from Local");
  }

 

  ,
    error => {
        console.log("login  failed with the errors");
      return    this.authObservable$ = of(error);
    },
    () => {  
      // executed when the HTTP function has been completed, doesn't matter whether success or error
       return  this.authObservable$;
    }
  )

*/