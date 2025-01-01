import { Handler } from '@netlify/functions'
import { environment } from 'src/environment/environment';
import axios, { AxiosHeaders, AxiosInstance, AxiosPromise, InternalAxiosRequestConfig } from 'axios';
import { catchError, firstValueFrom, from, Observable, of, tap, timeout } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { isNullOrUndefined } from 'src/app/core/utils';
import { User } from 'src/app/models/user';
import  bs58 from 'bs58';
import * as jwt from 'jsonwebtoken';
import   * as randtoken   from 'rand-token';
import { google } from 'googleapis'; // Import the googleapis library
import  { OAuth2Client } from 'google-auth-library' ;

const CLID= 'krRm8HbsGJdajy3oFTKH1XVnK7X3LnUBWqPHiDPNgx12eiXXAzgLfYFR4vwSBSmtERYrJb7Pb2FRomUqek4CwgaVeZLZQuMQJQ';
const CLIDActual = 'krRm8HbsGJdajy3oFTGwQxN5iQABQ6MMFce4pRmd6tfrgXBwG3jUjstTVS5J4tQcfigHPg9FJFazL96AAY36WrbDLxVY8Qo37A'
const CSRET = '87gm8qXusd2mKGaPpricTFxGKZSYGkMqKnez9o2riv1uofpN'
let localSite='localhost:8000';
var localSiteStrings = [localSite,'localhost:8888','localhost:8080','localhost:4200','localhost:3450'];
var regex = new RegExp(localSiteStrings.join( "|" ), "i");
 let ourDomainPage= "https://storenotify.in/"
 const jwtSecret = 'VERY_SECRET_KEY!'; 
 const JWT_TOKEN = "JWT_TOKEN";
 const decodedclidBase58 = Buffer.from(bs58.decode(CLIDActual)).toString('utf-8');
 const decodedcsrectBase58 = Buffer.from(bs58.decode(CSRET)).toString('utf-8');
/*
https://storenotify.in/.netlify/functions/netlifyproxygoogleauth?remoteUrl=/api/auth/google&payLoad=%7B%22username%22:%22%22%7D
*/
const REDIRECT_URI = 'https://storenotify.in/.netlify/functions/netlifyproxygoogleauth/api/auth/google/callback'
const REDIRECT_CONSENT_URI = 'https://storenotify.in/.netlify/functions/netlifyproxygoogleauth/api/auth/consent/callback'
const client = new google.auth.OAuth2(decodedclidBase58, decodedcsrectBase58, REDIRECT_URI);
let clientForAccessToken =  new google.auth.OAuth2(decodedclidBase58, decodedcsrectBase58, REDIRECT_CONSENT_URI);
let l = decodedclidBase58.length;
let m = decodedcsrectBase58.length;
console.log("decoded part Client Id "+decodedclidBase58.substring(0, l/2))
console.log("decoded part Client Secret "+decodedclidBase58.substring(0, m/2))

const getOurDomainPage = (referer:any) => {
  let callingSite  = referer;
  if( !isNullOrUndefined(callingSite)){ 
  if( callingSite.indexOf(ourDomainPage) > -1 ){ // this fails if called from POSTMAN 
    console.log('Other domain found:');
  }else if (  regex.test(callingSite)) { 
    ourDomainPage = 'https://localhost:8000/'
    console.log('local found:');
   }
  else if( callingSite.indexOf("accounts.google.com") > -1 ) {  // check referer is google or not 
     
        ourDomainPage = 'https://storenotify.in/' 
  } 
   else { 
        ourDomainPage = callingSite
   }
 } else {
      if(environment.production){
        ourDomainPage =  'https://storenotify.in/'
      }else {
        console.log('envirnorment not work local found:');
         ourDomainPage =  'https://storenotify.in/'
      }
 }
  return ourDomainPage;

}
// This function generates the authorization URL
const generateAuthUrl = () => {
  return client.generateAuthUrl({
    access_type: 'offline', // to get refresh token
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });
};
const generateAuthUrlAccess = (client1:OAuth2Client) => {
  return client1.generateAuthUrl({
    access_type: 'offline', // to get refresh token
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
  });
};
const createSignedToken =   (user:User) => {
  var payload = user.toSafeUser(user);
  return jwt.sign(payload,  jwtSecret, { expiresIn: 600 }); // 600 seconds = 10 minutes
};
const checkPathIsGoogleCallBack =   (callback:string) => {
  let remoteUrl:any ;
 if (callback.indexOf('/api/auth/google/callback') >-1){
    remoteUrl =  '/api/auth/google/callback';
  }
 else { 
     remoteUrl = false;
 }
  return  remoteUrl; // 600 seconds = 10 minutes
};

export const handler: Handler = async (event, context) => {
  event.queryStringParameters
  let remoteCallBody:any | undefined;
 console.log("context " +JSON.stringify(context ));
 console.log("event " +JSON.stringify(event ));
 var path ="";  
 let response :any  | undefined;
 let ftname = "netlifyproxygoogleauth";
 let nt =       "netlifyproxygoogleauth".length;
 let apipart  =   '/'; let bodyOk = false; let  isGoogleCallBack = false;

 try{
  path = event.rawUrl !=undefined ? event.rawUrl : "/";
  console.log("path " +JSON.stringify(path)); 
   let checkQueryString = path.split("?")
   if(checkPathIsGoogleCallBack(path) ){
    remoteCallBody   =  {
        remoteUrl : checkPathIsGoogleCallBack(path),
         payLoad : ""
    }
    isGoogleCallBack =true ;
   }
   if (!isNullOrUndefined(checkQueryString) && Array.isArray(checkQueryString)){
        let  qey =     checkQueryString[1]
        console.log("checkQueryString " +JSON.stringify(checkQueryString)); 
        if(!isNullOrUndefined(qey)){
          path = qey
          console.log("path " +JSON.stringify(path)); 
        }
   }

   if(path &&     path.indexOf("&") > -1 && !isGoogleCallBack ){
    try { 
      let partB = event.body;
      if(!isNullOrUndefined(event.queryStringParameters)){
        remoteCallBody   =  path
        let params = remoteCallBody.split("&")
        if(!isNullOrUndefined( params) && 
           !isNullOrUndefined( params[0])  && !isNullOrUndefined( params[1])){
           let rurl = params[0].split("=")
           let rbody = params[1].split("=")
           console.log("remoteGoogleURL " +JSON.stringify(rurl) + "remoteGoogleBody "+JSON.stringify(rbody) ); 
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
             console.log("invoked query string params okay   "); 
           }
          }
        }
        if(!isNullOrUndefined(partB) && !bodyOk ){  
          remoteCallBody   = JSON.parse(partB.toString())
            if(!isNullOrUndefined( remoteCallBody?.remoteUrl) && 
                !isNullOrUndefined( remoteCallBody?.payLoad)  ){
                console.log("invoked body post okay   "); 
                bodyOk = true;
            }
        }

    }
    catch(err) { 
      console.log("invalid payload: remoteUrl  " +JSON.stringify(err)); 
      } 

   }
     if(path && !bodyOk && !isGoogleCallBack &&  !isNullOrUndefined(event.body) && Object.keys(event.body).length >1){
      // let  netlifyUrl   =      extractNetlifySiteFromContext(context)
      apipart  =   '' //  netlifyUrl.substring(netlifyUrl.indexOf(ftname )+nt);
      try { 
        let partB = event.body;
        if(!isNullOrUndefined(partB) && !bodyOk ){  
          remoteCallBody   = JSON.parse(partB.toString())
            if(!isNullOrUndefined( remoteCallBody?.remoteUrl) && 
              !isNullOrUndefined( remoteCallBody?.payLoad)  ){
                console.log("invoke body okay   "); 
                bodyOk = true;
            }
        }
       }
        catch(err) { 
          console.log("invalid body  " +JSON.stringify(err)); 
        } 
     }
 
  }
  catch(err) { 
       console.log("error " +JSON.stringify(err)); 
  } 
  // PREPARE AXIOS 
  let bk =  environment.bakendUrl;
  let  axiosInstance =   axios.create() //{ jar }
  axiosInstance.interceptors.request.use((config : InternalAxiosRequestConfig) => {
  if (config.headers) { // <- adding a check 
    let t : any = undefined
    
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
  // PREPARE AXIOS
  // VERIFY BODY to POST to GOOGLE AUTH 
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
      case  '/api/auth/google':  
          var path = '/index.html';
          let body = event.body;  
          let callingSite  = event.headers['Referer'];
          ourDomainPage = getOurDomainPage(callingSite)
          const authUrl = client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.profile', 
              'https://www.googleapis.com/auth/userinfo.email'],
           });
             console.log("authUrl "+authUrl);
          response = {
              statusCode: 302,
              headers: {
                'Location': authUrl,
                'X-Foo': "value-to-be-sent"
              }
            }
           // context.redirect(authUrl);
         
          break;  
      
      case '/api/auth/google/callback':  
          console.log( "calling google auth ...  ");
          const   code  = event.queryStringParameters?.['code'];
          if (!code) {
            response = {
              statusCode: 400,
              body:  'Authorization code missing.'
            }
            break;
          }
          console.log("body :  "+ remoteCallBody?.payLoad );
          let callingSite1  = event.headers['Referer'];
          ourDomainPage = getOurDomainPage(callingSite1)
          console.log("ourDomainPage :  "+ ourDomainPage );        
          try { 
            const { tokens } = await client.getToken(code);
            console.log(`authorization code ${code}`)
            console.log(`............. tokens ${JSON.stringify(tokens)}`)
            client.setCredentials(tokens);
            const oauth2 = google.oauth2({
              auth: client,
              version: 'v2',
          });
          
          const userInfo = await oauth2.userinfo.get();
          //if (event.session) {
            // res.send(`Welcome, ${req.session.user.name}!`);
            if ( userInfo.data)
            {  //req.session.user = userInfo.data;

                // Store user info in session
                
                console.log(`logged in ${userInfo.data.name}`)
               
                console.log(`......... ${userInfo.data.given_name}`)
                console.log(`......... ${userInfo.data.family_name}`)
                console.log(`......... ${userInfo.data.email}`)
                console.log(`......... ${userInfo.data.locale}`)
                console.log(`......... ${ userInfo.data.picture}`)
              // now sign ing the user and create a JWT Token 
              // signuserservice.signin('google', code, req.session,tokens,userInfo.data)

              console.log(" access_token : " + tokens);
              let confirmationCode = randtoken.uid(256);
              let accountId = randtoken.uid(256);
              let user: User = new User ();
              
              //{
                user.accountId=accountId;
                user.email=!isNullOrUndefined(userInfo.data.email) ? userInfo.data.email : '';
                user.role='OWNER';
                user.picture = !isNullOrUndefined(userInfo.data.picture)? userInfo.data.picture: '';
                user.confirmed=false;
                user.confirmationCode=code;
                user.externalId={
                  google: randtoken.uid(256)
                };
                user.createdWith='password';
              //  build: () => {},
                //toSafeUser: (user:User ) => { return null}
             // };
              console.log(" userInfo " + JSON.stringify(user ));
              var jwtToken = createSignedToken(user);
              console.log(" user tokenised " + jwtToken);
              try {
                //  let token =  store(JWT_TOKEN);// localStorage.getItem(JWT_TOKEN) // localStorage.setItem(this.JWT_TOKEN
                 if (jwtToken === null || jwtToken ===undefined){
                  console.log(" User JWT TOKEN not generated  ");
                 }
                 response = {
                  statusCode: 302,
                  headers: {
                    'Location': `${ourDomainPage}app?jwt_token=${jwtToken}`,
                    'Access-Control-Allow-Origin':'*',
                  "Authorization": "Bearer "+jwtToken ,
                   'Access-Control-Allow-Methods': 'POST, GET, PATCH, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'    
                  }
                }
               } catch(tre){
                  console.log(" JWT TOKEN storage or JWT SIGNIN failed.... ");
                }  
            }
              else {
                response = {
                  statusCode: 403,
                  body: JSON.stringify('Your user is forbidden ')
                }
               
              }
            
          if( response!=undefined ) {
           console.log('axios server ready ');
            
          }
        }catch(r :any)   { 
          console.log('user authentication issue ');

        } ;
           break;  
      case '/about.html':  
           break;  
      default:  
            response = of( {    });
           break;  
   }           

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
