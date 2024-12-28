import { Handler } from '@netlify/functions'
//mport fs  from   'fs';
//import url  from 'url'
//import path from 'path'
//import { HttpClient, HttpErrorResponse, HttpHandler, HttpHeaders, HttpXhrBackend } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import axios, { AxiosHeaders, AxiosInstance, AxiosPromise, InternalAxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, from, Observable, of, tap, timeout } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'src/app/core/utils';
//import  * as lt from 'node-localstorage' 
//import { sigV4ASignBasic } from 'src/app/core/utils';
// const crt = require("aws-crt");
// const {HttpRequest} = require("aws-crt/dist/native/http");
//npm i --save-dev @types/node-localstorage



function extractNetlifySiteFromContext(context :any) {
  let data = context.clientContext.custom.netlify
  let decoded = JSON.parse(Buffer.from(data, "base64").toString("utf-8"))
  return decoded
}
/*const httpClient = new HttpClient(new HttpXhrBackend({ 
  build: () => new XMLHttpRequest() 
}));*/
export const handler: Handler = async (event, context) => {
     event.queryStringParameters
      let remoteCallBody:any | undefined;
     console.log("context " +JSON.stringify(context ));
     console.log("event " +JSON.stringify(event ));
     var path ="";  
      
     let response :any  | undefined;
     // parse the path requested by static storenotify.in or 
     // http://localhost:8888/.netlify/functions/function-name/
     // to post the data to remote aws api gateway 
     let ftname = "netlifyproxyawsapigateway";
     let nt =       "netlifyproxyawsapigateway".length;
     let apipart  =   '/';
     try{
      path = event.rawUrl !=undefined ? event.rawUrl : "/";
      console.log("path " +JSON.stringify(path)); 
       let checkQueryString = path.split("?")
       if (!isNullOrUndefined(checkQueryString) && Array.isArray(checkQueryString)){
            let  qey =     checkQueryString[1]
            console.log("checkQueryString " +JSON.stringify(checkQueryString)); 
            if(!isNullOrUndefined(qey)){
              path = qey
              console.log("path " +JSON.stringify(path)); 
            }
       }

       if(path &&     path.indexOf("&") > -1 ){
        // let  netlifyUrl   =      extractNetlifySiteFromContext(context)
        apipart  =   '' //  netlifyUrl.substring(netlifyUrl.indexOf(ftname )+nt);
        try { 
        let partB = event.body;
        let bodyOk = false;
          if(!isNullOrUndefined(event.queryStringParameters)){
             remoteCallBody   =  path
             let params = remoteCallBody.split("&")
           if(!isNullOrUndefined( params) && 
             !isNullOrUndefined( params[0])  && !isNullOrUndefined( params[1])){
                let rurl = params[0].split("=")
                let rbody = params[1].split("=")
                console.log("rurl " +JSON.stringify(rurl) + "rbody "+JSON.stringify(rbody) ); 
                if(!isNullOrUndefined( rurl) && 
                !isNullOrUndefined( rurl[0])  && !isNullOrUndefined( rbody[1])){
                    let mt = event.multiValueQueryStringParameters ;
                    let rB = { remoteUrl : rurl[1],
                      payLoad :  rbody[1]

                         }
                       if (!isNullOrUndefined(mt ) && 'remoteUrl' in mt) {
                          rB.remoteUrl = (mt['remoteUrl'])?.toString();
                        if ( 'payLoad' in mt) {
                          rB.payLoad = (mt['payLoad'])?.toString();
                             }
                        }
                     
                   
                    remoteCallBody = rB
                    console.log("remoteCallBody " +JSON.stringify(remoteCallBody)  );
                     bodyOk = true;
                  console.log("invoke parameter okay   "); 
                }
             }
          }
          if(!isNullOrUndefined(partB) && !bodyOk ){  
            remoteCallBody   = JSON.parse(partB.toString())
              if(!isNullOrUndefined( remoteCallBody?.remoteUrl) && 
                 !isNullOrUndefined( remoteCallBody?.payLoad)  ){
                  console.log("invoke parameter okay   "); 
                  bodyOk = true;
              }
          }
        }catch(err) { 
          console.log("invalid payload: remoteUrl  " +JSON.stringify(err)); 
          } 
      
          
       }
       console.log("apipart " +JSON.stringify(apipart)); 
     } catch(err) { 
         console.log("error " +JSON.stringify(err)); 
      } 
     
      
      let bk =  environment.bakendUrl;
        //  path .replace( netlifyUrl,bk);
      let  axiosInstance =   axios.create() //{ jar }
       axiosInstance.interceptors.request.use((config : InternalAxiosRequestConfig) => {
       if (config.headers) { // <- adding a check 
        let t : any = undefined
        /*if (typeof localStorage === "undefined" || localStorage === null) {
        
          let  LocalStorage = lt.LocalStorage;
          localStorage = new LocalStorage('./scratch');
           t =  localStorage.getItem('token' )
         }
       
         if(t !==null && t!==undefined){ 
         config.headers["Authorization"] = `Bearer ${t}`  ; // no errors
         
        }*/
          config.headers["Access-Control-Allow-Origin "] ='https://storenotify.in'
       }
          config.withCredentials = true; // to include credential, it should be outside of "if" block 
          return config;
      });
      let config = {
        headers: {
         'Content-Type': 'application/json' ,  
          'Authorization': 'text/plain',
          'Set-Cookie': 'text/plain',
        }
      }

      if(isNullOrUndefined(remoteCallBody) || isNullOrUndefined(remoteCallBody?.remoteUrl)
          ||isNullOrUndefined( remoteCallBody?.payLoad) )
      {    console.log("invoke parameter not okay   "); 
            return response =  {
              statusCode: 503,
                body: JSON.stringify({
                  message:'someerror ',
              })
          }
      }
      else {
      switch (remoteCallBody?.remoteUrl) {  
        case  "/api/v1/user/login":  
            var path = '/index.html';
            let body = event.body;  
           // let http: HttpClient = httpClient;
            let loginResult
            console.log( "serving cloud spring backend...  ");
           /* (async  () :Promise<any> => {
              const headers =   new HttpHeaders({ 'Content-Type': 'application/json' ,  
                'Authorization': 'text/plain',"Access-Control-Allow-Origin ":'https://storenotify.in'
                  });
                const res = await firstValueFrom(
                   http.post<any>(bk + '/api/v1/user/login', body,{withCredentials: true, 'headers':headers , observe: 'response'}).pipe(timeout(70000))
                 );
              console.log(res);
              loginResult = res;
              return loginResult;
            })();*/
            /*   var method = 'POST';
               var endpoint = 'https://pol7h6qitmwyk4h5sfhmgyf6mi0dsudg.lambda-url.us-east-1.on.aws'
               //'https://<MRAP_alias>.accesspoint.s3-global.amazonaws.com/<s3-object-key>';
               var service = 'lambda';
               var headers = sigV4ASignBasic(method, endpoint, service);

               const options = {
                   hostname: headers.get('host'),
                   path: new URL(endpoint).pathname,
                   method: 'POST',
                   headers: headers._flatten()
               }
               let gt   : InternalAxiosRequestConfig = {
                  url : options.hostname,
                  headers:options.headers
               }
               axiosInstance.options(options.path , 
                  gt); */
              let tok='';
               console.log("reaching :  "+bk+'/api/v1/user/login')
               console.log("body :  "+ remoteCallBody?.payLoad )
               let bJ =  ""
               try {
                    bJ = JSON.parse(remoteCallBody?.payLoad)
                    console.log("parsed the payLoad ")
               }catch (err ){
                console.log("not proper JSON ")
               }
              let  servRes = await axios.post( bk+'/api/v1/user/login',JSON.stringify(bJ),config)
              console.log(servRes.data);
              console.log(JSON.stringify(servRes.headers));
              //await  axiosInstance?.post(bk+'/api/v1/user/login',JSON.stringify(remoteCallBody?.payLoad),config)/* .then( res => {
               //                tok = res.headers ["X-Test-Header"]
                              
              //}).   catch ( errorHandler)  	*/
              if( servRes!=undefined ) {
              console.log('axios server ready ');
                               response=  {
                                                         statusCode: 200,
                                                       body: JSON.stringify(servRes.data)
                                                  }
               }
           
            break;  
        case "/api/v1/user/register":  
        
            break;  
        case '/about.html':  
       
            break;  
        default:  
        response = of( {    });
            break;  
    }  
     if(response?.statusCode !==null && response?.statusCode !==undefined){
      return   response;
     }
     else {
      return response =  {
        statusCode: 503,
          body: JSON.stringify({
            message:'someerror ',
        })
      }
     }
    
    }
 
  /*return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name1}!`,
    }),
    
    headers: {
      
    "X-Test-Header": `${servRes.headers["X-Test-Header"]}`,
      'Cache-Control': 'no-cache',
  
    }


  }*/
}
/*
export  function  transformServerRes(response: HttpResponse<Object>): Promise<Observable<any>> {
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
      k =   readCookie("token",setHC.toString());
    }else {
      k =   readCookie("token","");
    }
    if(setHRC ) {
       kt = readCookie("refreshToken",setHRC.toString());
  }else {
      kt =   readCookie("refreshToken","");
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
    let merResp = Object.assign({} ,  getDecodedAccessToken(k) , response.body);
     
    this.authObservable$ = of({"token": merResp, "refreshToken": kt});
 }
 catch(erre){
  this.authObservable$ = of(new Error(JSON.stringify(erre)));
 }
   return  this.authObservable$
}
   */

export function errorHandler(error: any){

  return of(error?.message || "server error.")
}

 // Read a specific cookie value by name
 export function readCookie(name: string, headerc:string): string | null {
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