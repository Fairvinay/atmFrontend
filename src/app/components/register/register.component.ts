import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, EmailValidator } from '@angular/forms';
import { Router } from '@angular/router';

import { debounceTime, of } from 'rxjs';
import { Register } from 'src/app/model/register.model';
import { User } from 'src/app/model/user.model';
import { LoginService } from 'src/app/service/login.service';
import { LoginNodeJwtService } from 'src/app/service/loginnodejwt.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup  ;
  backUrl :any 
  googleLogin = "Sign with Google";
  isSpringJwt : any =  {
    text: "Node",
    value:true
  }
  defaultAuth : any ='Spring'; 
  baseUrl: string | undefined;
   
  loggedIn: boolean = false;
 



  constructor( private fb: FormBuilder, private loginService: LoginService,
    private loginnodeServ: LoginNodeJwtService,private authService: SocialAuthService,
    private router: Router){

    this.backUrl =  environment.bakendUrl;
    this.baseUrl = environment.backend.baseURL;
   
    this.registerForm = this.fb.group({
     username: ['', Validators.required],
     password: ['', Validators.required],
     firstName: ['', Validators.required],
     lastName: ['', Validators.required],
     email: ['', Validators.required],
  
   
   });
   }
  
   ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      terms:  [false],
    });
    this.registerForm.get('username')?.valueChanges.pipe(debounceTime(500) )
    //.distinctUntilChanged()
    .subscribe(data => {
      console.log(" save ticket")
      console.log(" refresh ticket")
    })
  }
  onSubmit(e:Event) {
    //e.preventDefault();
   console.log(" onSubmit form "+JSON.stringify(this.registerForm?.valid))
   console.log('Form is valid:', this.registerForm?.valid);
   console.log('Form status:', this.registerForm?.status);
  // console.log('Form value:', this.registerForm.value);
   if (this.registerForm?.valid) {
     console.log(" form valid  "+JSON.stringify(this.registerForm?.valid))
     const { username, password, email , firstName , lastName, rememberMe } = this.registerForm?.value;
     const user = new Register()
     user.username = username;
     user.password = password;
     user.email = email;
     user.firstName = firstName;
     user.lastName = lastName;
     
     if(this .defaultAuth =='Spring') {
       this.loginService.register( user)?.subscribe( (registres:any) => { 
         if (registres) {
           console.log("Spring Server  "+JSON.stringify(registres))
           let og = registres;
         //  console.log("acknowledge C sub "+og["sub"])
         //  console.log("Login C email "+og["email"])
          // localStorage.setItem("sub",og["sub"])
           // localStorage.setItem("email",og["email"])
           // Navigate to the dashboard or another page
          // localStorage.setItem("token", og)
           this.router.navigate(['/login']);
         } 
       },
       (error:any) => {
         console.error('Login failed', error);
         alert('Invalid credentials');
       })
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
/* removed 
 rememberMe: [false],
      isSpringJwt : this.fb.group( {
        text: ['Node'],
        clicked:[false]
      })
*/