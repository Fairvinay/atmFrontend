import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GoogleAuthService } from 'src/app/services/GoogleAuthService';
import { Location } from "@angular/common";
import { isNullOrUndefined } from 'src/app/core/utils';
import * as jwt_decode from "jwt-decode";
import { map, Observable, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})
export class GoogleComponent {
  isLoading : boolean = true;
  accessToken: string | null | undefined;
  error:any ='';
  profileName: any;
  profilePrefix: any;
  loggedIn: boolean = false;
  popUpDone: boolean = false;
  user: SocialUser | undefined;
  newaccess_token: any;
  constructor( private cdr: ChangeDetectorRef,
    private location: Location, private auth : AuthService,
 private authService: SocialAuthService, private googleAuthService: GoogleAuthService,
    private router: Router, protected  route: ActivatedRoute,
  ) {
    let checkAppJwtToken =  this.location.path().split("/")[1]
    if(checkAppJwtToken!==undefined && checkAppJwtToken !== null && checkAppJwtToken !== ''){ 
    if ( checkAppJwtToken.indexOf("app?jwt_token") > -1 ){
          console.log("app path ")
          let pp =  route.snapshot.queryParams;  let jwttk =null;
          if(Array.isArray(pp)){
            console.log(" home param found ")
              pp.forEach( (f:number) =>{  
                console.log("params removed ... "+f)
                delete pp[f]})
          } 
           route.queryParamMap.forEach( (f) => {
               if (f.has('jwt_token')){
                 console.log("jwt found ")
                    this.accessToken = f.get("jwt_token")
                    jwttk = true;
                 
               }
           });
           if(  !isNullOrUndefined(this.accessToken)  && jwttk){
              this.getSocialUser();
           }
         // this.deleteQueryParameterFromCurrentRoute();
        //  window.location.href = '/';
    }
    else if ( checkAppJwtToken.indexOf("consent?consense") > -1

    ){    let checkConsens = false;  let tk =null;
            route.queryParamMap.forEach( (f) => {
              if (f.has('consense')){
                checkConsens= true;
                tk =  f.get("consense")
              }
          });
          if(checkConsens && !isNullOrUndefined(tk)){
            console.log("consense ");
                 if( typeof tk =='string') {
                    try { 
                        let accTk = JSON.parse(tk);
                      console.log("consense parsed")
                        this.identifyConsense(accTk);
                         }
                    catch(r:any) { 
                      console.log("consense failed "+JSON.stringify(r))
                    }
                  }
                  
                 
          }
    }
    else {

    }
   }
  }

  identifyConsense(consens:any) {
    let inConsense = { 
      access_token :'',
      id_token :''
    }
    if( Object.keys(consens).length > 0 ){
        let keys =  Object.keys(consens);
        console.log(" consese:  "+JSON.stringify(consens))
         let entr=  Object.entries(consens)
         entr.forEach( a => { 
          console.log(" a:  "+JSON.stringify(a))
          console.log(" a[0] :  "+ a[0] ) 
          console.log(" a[1]:  "+JSON.stringify(a[1] )) 
          if (a[0]=== "access_token" && !isNullOrUndefined(a[0]))

            {    //const { access_token } = consens
                 inConsense.access_token =  new String( a[1]).toString();

             }
             if ( a[0] === "id_token" && !isNullOrUndefined( a[0]))

              {    //const { id_token } = consens
                   inConsense.id_token = new String( a[1]).toString();

               } 


         })
         console.log("inConsense  "+JSON.stringify(inConsense))
        keys.forEach((consenKey:any) => { 
          console.log(" consenKey:  "+JSON.stringify(consenKey))
            
        })
       if( !isNullOrUndefined(inConsense.access_token)&&!isNullOrUndefined(inConsense.id_token)){
        let newaccessToken =inConsense.access_token
        let idtok =consens. id_token
      //  if(idtok.equals (this.accessToken)){
          console.log("Passed Auth code correct ")
          this.newaccess_token = newaccessToken
          let stk = this.accessToken;
         //  if(!isNullOrUndefined(stk)){ 
          //  let user =   this. parseJwt(stk.toString())
          //  let code = user.confirmationCode
            this.getConsenseUser(newaccessToken ,consens).then( (userInJson:any )=> { 
              if(!isNullOrUndefined(userInJson)){
                let user = JSON.parse(userInJson)
                console.log("User consense fetched ")
                if(user.user){
                  console.log("User unmatched ")
                }
                else {
                     console.log("User matched "+user.picture)
                      console.log(`......... ${user.sub}`)
                      console.log(`......... ${user.given_name}`)
                      console.log(`......... ${user.family_name}`)
                      console.log(`......... ${user.email}`)
                      console.log(`......... ${user.locale}`)
                      localStorage.setItem("imageUrl",user.picture)
                     this. deleteQueryParameterFromCurrentRoute("/home");
               }
             }
           }).catch((err) => { console.log("User consense failed "+JSON.stringify(err)) } )
         // }
      // }
     }
       else if (!isNullOrUndefined( consens["accountId"] ) ){
        
          if(consens.user){
            console.log("User unmatched ")
          }
          else {
              console.log("User  picture "+consens.picture)
                console.log(`......... ${consens.sub}`)
                console.log(`......... ${consens.given_name}`)
                console.log(`......... ${consens.family_name}`)
                console.log(`......... ${consens.email}`)
                console.log(`......... ${consens.locale}`)
                localStorage.setItem("imageUrl",consens.picture)
           }
        
       }
       else {
        console.log("User consense error  ")
       }
    }
    
  }
  getAccessToken(): any {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then((accessToken:any )=> this.accessToken = accessToken);
  }  
  async getConsenseUser(accesstoken :any, tokens:any) {
      let gogRes : Promise<any>;
      this.auth.consentUserByAccess(tokens).subscribe((ggoeapi:any ) => {
         // Promise.resolve(ggoeapi)
       gogRes  = ggoeapi
       return gogRes;
      },(goerr:any ) => {
        gogRes  =   goerr
        return gogRes;
      });
    
      
      /*.subscribe( (user:any) => { 
      if(!isNullOrUndefined(user)){
        if(user.user){
          console.log("User unmatched ")
        }
        else {
        
              console.log("User  picture "+user.picture)
              console.log(`......... ${user.sub}`)
              console.log(`......... ${user.given_name}`)
              console.log(`......... ${user.family_name}`)
              console.log(`......... ${user.email}`)
              console.log(`......... ${user.locale}`)
              localStorage.setItem("imageUrl",user.picture)

        }

      }
      else {
        console.log("User fetch with code issues.. ")
      }
    });*/
  }
  async getSocialUser() {
    //this.authService.
    /*this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(async (user) =>  {    console.log("Google provider signing done ... ") 

       await this.authService.authState.subscribe((user) => {
          this.user = user;
          this.loggedIn = (user != null);
          if(this.loggedIn){
            console.log(" logged in ")
            this.accessToken =   this.getAccessToken();
            console.log(" user "+JSON.stringify(user))
          }else {
            console.log("not logged in ")
          }
        });

      })
      .catch((err:any) => { console.log("Google provider issues... ") 

   

      });*/
      
      let user =  getDecodedAccessToken(this.accessToken)
      if(!isNullOrUndefined(user)){
        console.log("decodec " +JSON.stringify(user))
         let pic = user.picture;
         if(!isNullOrUndefined(pic)){
           console.log("pic " +JSON.stringify(pic))
             localStorage.setItem("imageUrl",pic)
         }
         else {
            console.log("usual decode ")
             
            if(!isNullOrUndefined(this.accessToken)){
               let user =   this. parseJwt(this.accessToken?.toString())
               let code = user.confirmationCode
              
                this.auth.consentTokens(code)
               /*.subscribe( tokens => { 

                  if(!isNullOrUndefined(tokens)){
                      if(tokens.token){
                        console.log("Passed Auth code incorrect ")
                      }
                      else {
                          let newaccessToken = tokens.access_token
                          let idtok =tokens. id_token
                          if(idtok.equals (this.accessToken)){
                            console.log("Passed Auth code correct ")
                            this.newaccess_token = tokens.access_token

                            this.auth.consentUser(code).subscribe( (user:any) => { 
                              if(!isNullOrUndefined(user)){
                                if(user.user){
                                  console.log("User unmatched ")
                                }
                                else {
                            
                                      console.log("User  picture "+user.picture)
                                      console.log(`......... ${user.sub}`)
                                      console.log(`......... ${user.given_name}`)
                                      console.log(`......... ${user.family_name}`)
                                      console.log(`......... ${user.email}`)
                                      console.log(`......... ${user.locale}`)
                                      localStorage.setItem("imageUrl",user.picture)

                                }

                              }
                              else {
                                console.log("User fetch with code issues.. ")
                              }
                            });
                          }
                      } 
                  }
 
               }, (err :any)=> { 
                console.log("consent fetch issues.. ")

               }); */
               console.log("usual  decodec " +JSON.stringify(user))
                 let pic = user.picture;
                 if(!isNullOrUndefined(pic)){
                   console.log("usual  pic " +JSON.stringify(pic))
                     localStorage.setItem("imageUrl",pic)
                 }
            }
         }
      }

      
      /* this.router.navigate(['mainpage'])*/
   
    /*this.authService.authState.pipe(
      map((socialUser: SocialUser) => !!socialUser),
      tap((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['login']);
        }
      })
    );*/
  }
  
 
ngOnInit(): void {
  let s = localStorage.getItem("sub");
  let n = localStorage.getItem("email");
  this.profilePrefix = ( s!==undefined && s !=null)? s.toString() :  this.profilePrefix ;
  this.profileName = ( n!==undefined && n !=null)? n.toString() : this.profileName;
  console.log("home  s "+s)
  console.log("home n "+n)
  //this.authService.signIn
  /*this.authService.authState.subscribe((user) => {
    this.user = user;
    this.loggedIn = (user != null);

  });*/
  console.log("user logged in "+ this.loggedIn);
 // console.log("user   "+ JSON.stringify( this.user));
  // this.accessToken = f.get("jwt_token")
  let urlImage = localStorage.getItem("imageUrl");
  if(!isNullOrUndefined(urlImage) && urlImage?.indexOf("https://lh3.googleusercontent.com/") > -1){
    this.deleteQueryParameterFromCurrentRoute('/home');
  }
  //
}

  deleteQueryParameterFromCurrentRoute(routeApp:string ='app')
  {
      const params = { ...this.route.snapshot.queryParams };
      let pp = this.route.snapshot.queryParams;
      if(Array.isArray(pp)){
        console.log(" home param found ")
          pp.forEach( (f:number) =>{  
            console.log("params removed ... "+f)
            delete pp[f]})
      } 
      //( (r:number) => delete params[r]);
      if(routeApp ==='app'){
        console.log(" app param found ")
      this.router.navigate(["/app"], { queryParams:[] });}
      else { 
        console.log(" param found ")
        this.router.navigate([routeApp], { queryParams:[] });
    }
  }
  
  async handleGoogleSignIn( ) {
   
    // Access user profile information
    let  accessToken =  this.accessToken;
    let breakAuth = false;
    let i =0;
  //while ( i < 2 && !breakAuth){ 
    // Use the access token to retrieve user profile data
    this.googleAuthService.initClient().then((us:any) =>{ 
        this.googleAuthService.isUserSignedIn().then((isLogged:boolean )=>{
            let im =   localStorage.getItem("imageUrl" );
            let sub =  localStorage.getItem("sub" );
            if( isNullOrUndefined(sub)){
            this.googleAuthService.getUserProfile().then((user:any)=> {
                console.log("Profile linked ....")
                if(!isNullOrUndefined(user)){
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
                  breakAuth = true;
                }
            }).catch((err:any)=> {
              console.log("Profile unable to validate  ....")
            });
          } // sub undefiend
        }).catch((er:any) => {
          console.log("User signing issue ....")

        })
    }).catch((er:any) => {
      console.log("Google provider reach issues....")
    })
    breakAuth = true;
    this.popUpDone = true;
    console.log("Retry with Google Provider ID ... ")
     i++
  // }
}
  parseJwt (token:string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}  

}
export function getDecodedAccessToken(token: string| undefined | null): any {
  try {
    if(token )
    return jwt_decode.jwtDecode(token);
    else  return null;
  } catch(Error) {
    return null;
  }
}