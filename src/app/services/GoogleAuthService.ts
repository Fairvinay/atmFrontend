import { Injectable } from '@angular/core';
import { gapi } from 'gapi-script';
import  bs58  from 'bs58'
import { environment } from '../../environment/environment';
import * as Buffer from 'buffer'; 
import { isNullOrUndefined } from '../core/utils';
 
@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  decodedclidBase58: string;
    CLIDActual: string;
    islogged: boolean | undefined;
    user: any;
  
  constructor() {
    this.CLIDActual = environment.CLIDActual;
     let arr = new Uint8Array(bs58.decode( this.CLIDActual))  ;//.toString('utf-8');
     this.decodedclidBase58 = Array.from( arr )
            .map( (val) => val.toString( 16 ).padStart( 2,"0" ) )
            .join(" ");

   }

  // Load the Google API client and initialize the authentication process
  initClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        
      /*   gapi.auth2.authorize ({client_id: `${this.decodedclidBase58}.apps.googleusercontent.com`  // Replace with your own client ID
        }, (res: any) => { 
          if (res !== undefined)
           { console.log( " okay ")
             this.islogged = true;
           }
          resolve();
     }
      ) .then( (error: any) => {
            console.log( " no  ")
          reject(error);
        });*/
        gapi.auth2.init({
            client_id: "396732087280-6b7n6c9u4egr6vqdhaed5i43drjn9klq.apps.googleusercontent.com",
            //`${this.decodedclidBase58}.apps.googleusercontent.com`, // Replace with your own client ID
            scope: "email",
            plugin_name:'nodeemail'
              //'App Name that you used in google developer console API'
          }).then((ues:any) => {
            console.log("Google process successful ")
           // gapi.client?.setApiKey("GOCSPX-Du4DyGGpFy Ion4oNkyZbKxmIS9G4");
            //console.log(" u "+JSON.stringify(ues))
            resolve();
          }, (error:any) => {
            console.log("Google addition details needed ")
            reject(error);
          });
      
        /*  gapi.auth2.getAuthInstance()
          .signIn({
            scope: "https://www.googleapis.com/auth/youtube.readonly"
          })
          .then(function() {
              console.log("Sign-in successful");
            },
            function(err) {
              console.error("Error signing in", err);
            });*/
      /*  gapi.auth.authorize(  {
          client_id: `${this.decodedclidBase58}.apps.googleusercontent.com`, // Replace with your own client ID
        },(res: any) => { 
             if (res !== undefined)
              { console.log( " okay ")
                this.islogged = true;
              }
             resolve();
        }).then( (error: any) => {
            console.log( " no  ")
          reject(error);
        });*/
      });
    });
  }

  // Check if the user is signed in
  async isUserSignedIn(): Promise<boolean> {
    let t = false;
   await   gapi.auth2.getAuthInstance()
    .signIn({
      scope: "https://www.googleapis.com/auth/userinfo.profile"
    })
    .then(function(res:any) {
        console.log("Sign-in successful");
        //console.log("user "+JSON.stringify(res));
        let user = res.ky;
        console.log("user "+JSON.stringify(user));
        if(!isNullOrUndefined(res)){
          if(user.jh !==undefined  && user.jh  !==null){
            //this.givenName = user.jh
            localStorage.setItem("sub",user.jh );
          }
          if(user.ez !==undefined  && user.ez !==null){
           // this.email = user.ez
            localStorage.setItem("email",user.ez );
          }
          if(user.bV !==undefined  && user.bV !==null){
           // this.imageUrl = user.bV
            localStorage.setItem("imageUrl",user.bV );
          }
        }

         t= true;
      },
      function(err:any) {
        console.error("Error signing in", err);
        console.log("err "+JSON.stringify(err));
         t = false;
      }).catch((rr:any)  => {t = false;});
      return t;
    /*const authInstance = null // gapi.auth.signIn()
    return   this.islogged = true;  // authInstance.isSignedIn.get();
    */
  }

  // Get the user's profile information (e.g., email)
  async getUserProfile(): Promise<any> {
    const authInstance:gapi.auth2.GoogleUser = await   gapi.auth2.getAuthInstance()
    .signIn({
      scope: "https://www.googleapis.com/auth/userinfo.profile"
    })
    let t : any;
     /*gapi.auth.signIn({ callback: (() => { 
        console.log( "logging ....") 

    }) ,  clientid: `${this.decodedclidBase58}.apps.googleusercontent.com`,  } );
    */
    let isLogged =false ;
     await this.isUserSignedIn().then(didLog => { isLogged =true}).catch(er => {
      isLogged =false
     } )
    if (isLogged) {
      if(this. user !==undefined && this.user !==null) {
          t = this.user;
      }

       // { logged : true}
       ;// .getBasicProfile();   user 
    }
    else {
      t =   authInstance.getBasicProfile();
    }
    return t;
  }

  // Sign the user out
 async signOut(): Promise<void> {
    const authInstance   =    gapi.auth2.getAuthInstance();
    authInstance.signOut();
   /* .signIn({
      scope: "https://www.googleapis.com/auth/userinfo.profile"
    })*/
    //const authInstance = gapi.auth2.getAuthInstance();
    //authInstance.signOut();
  }
}
