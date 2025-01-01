import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { User } from 'src/app/model/user.model';
import { LoginService } from 'src/app/service/login.service';
import { debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { LoginNodeJwtService } from 'src/app/service/loginnodejwt.service';
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { GoogleSigninButtonDirective } from "@abacritt/angularx-social-login";
import { Observable, of } from 'rxjs';
import { isNullOrUndefined } from 'src/app/core/utils';
import { identifierName } from '@angular/compiler';
import  bs58  from 'bs58'
import { AuthService } from 'src/app/services/auth.service';
declare global {
  interface Window {
    onGoogleSignIn: (response: any) => void;
  }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit {
  loginForm: FormGroup;
  backUrl :any 
  googleLogin = "Sign with Google";
  google_login_id="";
  buttonTxt = this.googleLogin;
  theme = 'basic';
 faceBookLogin = "Sign with Facebook";
  isSpringJwt : any =  {
    text: "Node",
    value:true
  }
  defaultAuth : any ='Node'; 
  baseUrl: string;
  user: SocialUser | undefined;
  loggedIn: boolean = false;
  error:any ='';
  @Input() showMsg: boolean = false;

  isLoading: boolean = false;
  responseMessage: string = '';
  googleAuth: string;
  // { remoteUrl: string; payLoad: { username: string; }; };
   
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService, private auth : AuthService,
    private loginnodeServ: LoginNodeJwtService,private authService: SocialAuthService,
    private router: Router
  ) {
     this.backUrl =  environment.bakendUrl;
     this.baseUrl = environment.backend.baseURL;
     let gUrl =   environment.backend.baseURL
     let netlifyRe = environment.netlifyGoogleAuth;
      let remote = "remoteUrl="+netlifyRe.remoteUrl+"&payLoad="+JSON.stringify(netlifyRe.payLoad);

    this.googleAuth = encodeURI(gUrl +"?"+ remote);
     this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
      isSpringJwt : this.fb.group( {
        text: ['Node'],
        clicked:[false]
      })
    });
    this.isLoading = false;
      this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if(this.loggedIn){
        console.log(" logged in ")
      }else {
        console.log("not logged in ")
      }
    });
    let arr = new Uint8Array(bs58.decode(  environment.CLIDActual))  ;//.toString('utf-8');
    let decodedclidBase58 = Array.from( arr )
       .map( (val) => val.toString( 16 ).padStart( 2,"0" ) )
       .join(" ");
       this.google_login_id =  `${decodedclidBase58}.apps.googleusercontent.com`;
       // this can be specified in the meta content attribute then the small signin button will appear.
       
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false],
      isSpringJwt : this.fb.group( {
        text: ['Node'],
        clicked:[false]
      })
    });
    this.loginForm.get('username')?.valueChanges.pipe(debounceTime(500) )
    //.distinctUntilChanged()
    .subscribe(data => {
      this.saveTicket();
      this.refreshTicket();
    })
     // Google Simple Signin 
     const body = <HTMLDivElement>document.body;
     const script = document.createElement('script');
     script.src = 'https://accounts.google.com/gsi/client';
     script.async = true;
     script.defer = true;
     body.appendChild(script);
     window.onGoogleSignIn= this.onGoogleSignIn.bind(this);

  }
  onGoogleSignIn(res: any) {
    console.log(res);

  }
  saveTicket() {
    console.log(" form saveTicket ")
  }
  refreshTicket() {
    console.log(" form refreshTicket ")
  }
  querySelectorAllInIframes(selector:any) {
    let elements:any = [];
  
    const recurse = (contentWindow = window) => {
  
      const iframes = contentWindow.document.body.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        
        if(!isNullOrUndefined(iframe))
           { /*recurse( iframe.contentWindow || undefined)*/ }
       });
      
      elements = elements.concat(contentWindow.document.body.querySelectorAll(selector));
    }
  
    recurse();
  
    return elements;
  };

  loginGoogleAuth(event:Event) {
     console.log( "event type "+ event.type);
     console.log( "url "+ this.googleAuth);
     //console.log( "event.composedPath "+ event.composedPath);
    return  this.googleAuth
    //this.auth.loginGoogleAuthNetify();
    // window.location.href = this.googleAuth;
     //event.preventDefault();
     // 

  }

  clickFbButton(event:Event) {

    event.preventDefault();
    let gt = document.getElementById("fb-login-button")
    if(!isNullOrUndefined(gt)) { 
      console.log("Awaiting Facebook ...")
      setTimeout ( () => {    // id="fb-root"
        let gt =  document.querySelector(".pluginLoginButton.pluginLoginButtonsmall");//document.getElementById("fb-root")
        console.log("Timed Facebook ...")
        if ( gt  instanceof HTMLButtonElement ){
              gt.click();
          }

        if(isNullOrUndefined(gt)){  
          console.log("Retry Facebook ...")
            let ifE =   document.querySelector("iframe[title='fb:login_button Facebook Social Plugin']");
            let ifFF = document.querySelectorAll('html[id="facebook"]')
            var iframe = document.getElementById('iframeId');
            //  var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
              //document.querySelector("iframe");
              if(!isNullOrUndefined(ifFF)){ 
                if ( ifFF  instanceof HTMLHtmlElement ){
                  let fbt  = ifFF.getElementsByClassName (".pluginLoginButton.pluginLoginButtonsmall")
                  if(!isNullOrUndefined(fbt)){ 
                    console.log("Redefine Facebook ...")
                      if ( fbt  instanceof HTMLButtonElement ){
                          fbt.click();
                      }
        
                  }
                }
              } 
            if(!isNullOrUndefined(ifE)){
              if ( ifE  instanceof HTMLIFrameElement ){
              let fbt  = ifE.contentDocument?.body.querySelector(".pluginLoginButton.pluginLoginButtonsmall")
              if(!isNullOrUndefined(fbt)){ 
                console.log("Redefine Facebook ...")
                  if ( fbt  instanceof HTMLButtonElement ){
                      fbt.click();
                  }
    
              }
            }
          }
       
         //  let fbt  = document.querySelector(".pluginLoginButton.pluginLoginButtonsmall");
          //  let fbBtt =  new HTMLButtonElement ()  ;
         
        }
      
      } , 200 )
    
    }
  }
  setService(  ) {
     let controls = this.loginForm["controls"];
     let isSpringJwt = controls['isSpringJwt'] ;
     let click =  isSpringJwt.get('clicked')?.value
     console.log("clicked ..."+click)
    switch(click ){ 
         case false: this.defaultAuth = 'Node'; 
                     break;
         case true : this .defaultAuth = 'Spring'; break;
    } 
    console.log(" this.defaultAuth  "+ this.defaultAuth )
  }

  reportDashboard (logres: any): Observable<any> 
  { 
    
      if (typeof logres ==='object') {
        console.log("Spring Server reponse ok .. ")
        let og = logres ;
        if(logres instanceof HttpResponse){
          og = logres.body ;
          og = Object.assign({}, og );  
          og["sub"] = og["email"]
          localStorage.setItem("sub",og["sub"])
          localStorage.setItem("email",og["email"])
        }
        else {
          localStorage.setItem("sub",og["sub"])
          localStorage.setItem("email",og["email"])
        }
        console.log("Login C sub "+og["sub"])
        console.log("Login C email "+og["email"])
       
        // Navigate to the dashboard or another page
        localStorage.setItem("token", og)
      
       
      } 
      return of(true)
  }
  reportFailed(error:any): Observable<any> { 
    console.log('Login failed', error);
    alert('Invalid credentials');
    return of(false)
  }
  onSubmit(e:Event) {
     //e.preventDefault();
    console.log(" onSubmit form "+JSON.stringify(this.loginForm?.valid))
    console.log('Form is valid:', this.loginForm.valid);
    console.log('Form status:', this.loginForm.status);
   // console.log('Form value:', this.loginForm.value);
    if (this.loginForm?.valid) {
      // Set loading state to true
       this.isLoading = true;
      console.log(" form valid  "+JSON.stringify(this.loginForm?.valid))
      const { username, password, rememberMe } = this.loginForm?.value;
      const user = new User()
      user.username = username;
      user.password = password;
      if(this .defaultAuth =='Spring') {
        this.loginService.login( user)?.pipe( 
          tap((res) =>typeof res === 'object' ? this.reportDashboard(res): this.reportFailed(res) )
          
         ).subscribe((tokenfound) => { 
             console.log( "typeof tokenfound "+(typeof tokenfound))
             if(typeof tokenfound ==='string' ){ 
              console.log('token not set '); 
               // if(tokenfound.indexOf('401') >-1){
               // Set loading state to false once response is received
                  this.isLoading = false;
                  this.error = "invalid credentials , either password or username"
                //}
             }
             else { 
            
              this.router.navigate(['/dashboard']);
             }
            }
        );
      } 
      else {
         let rt =  this.loginnodeServ.login( user)
         of(rt)?.subscribe( (logres:any) => { 
          if (logres ) {
            console.log("Node Server  "+JSON.stringify(logres ))
            let og = logres ; let userInfoLocal: any ={username:'',email:'',accessToken:''};
             let idx = 0;
            for (const key in og)
              {        const value = og[key];
                   switch( value ) {
                                    // case 'id':  userInfo.id = Object.values(bb)[idx]
                                     //   break; 
                                        case 'username':userInfoLocal.username = Object.values(og)[idx]
                                            break;
                                            case 'email': userInfoLocal.email= Object.values(og)[idx]
                                                break;
                                      //          case 'roles': userInfo.roles = Object.values(bb)[idx]
                                       //             break;
                                                    case 'accessToken':  userInfoLocal.accessToken = Object.values(og)[idx]
                                                        break;
                                 }
                  idx++;
              }
              localStorage.setItem("sub",userInfoLocal.username)
              localStorage.setItem("email",userInfoLocal.email)
            // Navigate to the dashboard or another page
              localStorage.setItem("token", og)
            this.router.navigate(['/dashboard']);
          } 
        },
        (error:any) => {
          console.error('Login failed', error);
          alert('Invalid credentials');
        })
      }
    }
  }
}
/*

for (const key in userInfo)
  {        const value = userInfo[key];
       switch( value ) {
                        // case 'id':  userInfo.id = Object.values(bb)[idx]
                         //   break; 
                            case 'username':userInfo.username = Object.values(bb)[idx]
                                break;
                                case 'email': userInfo.email= Object.values(bb)[idx]
                                    break;
                          //          case 'roles': userInfo.roles = Object.values(bb)[idx]
                           //             break;
                                        case 'accessToken':  userInfo.accessToken = Object.values(bb)[idx]
                                            break;
                     }
           console.log("  "+value);
           if(key=="sub")
            { this.profilePrefix = value;
              console.log("sub "+value);
            }
            if(key=="username")
              { this.profilePrefix = value;
                console.log("username "+value);
              }
          if(key=="email"){ 
           this.profileName =value;
           console.log("email "+value);
          }
           // Now we have the the strongly typed value for this key (depending on how bigObject was typed in the first place).
           
           // Do something interesting with the property of bigObject...
        }


{
  "id": "674ec03626d2ec878da3b6f5",
  "username": "Vinayak",
  "email": "vvanvekar@gmail.com",
  "roles": [
    "ROLE_USER"
  ],
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGVjMDM2MjZkMmVjODc4ZGEzYjZmNSIsImlhdCI6MTczMzIxNDM1MSwiZXhwIjoxNzMzMzAwNzUxfQ.btxlLmhr4DrYceTET1JxJE8wVwlUc4nEFwMXWFgFZ1A"
}*/

/*
switchMap(val =>
            val ? this.reportDashboard(val) : this.reportFailed(val)
          )

          replace with tap 
*/