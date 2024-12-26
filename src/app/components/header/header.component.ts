import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, tap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  profilePrefix : string = "Vinayak A";
  profileName : string = "Vinayak Anvekar ";
  pictureUrl: string | undefined;
  job: string | undefined;
  email: string | undefined;
  tempoLogout : Observable<any> | undefined;
  backUrl: string;
  loginUrl: string;
 
  constructor(
    
    private authService: AuthService ,
    private router: Router, private http: HttpClient
  ) { 
    this.backUrl =  environment.backend.logoutSpring;
    this.loginUrl=  environment.backend.site;
    let body = '';
    const headers =   new HttpHeaders({ 'Content-Type': 'application/json'  }); 
    this.tempoLogout = of(this.http.post( this.backUrl + '/api/auth/logout', body,{withCredentials: true, 'headers':headers , observe: 'response'})
  );

  }

  ngOnInit(): void {
     let userInfo :any = localStorage.getItem("token");
     let s = localStorage.getItem("sub");
     let n = localStorage.getItem("email");
     this.profilePrefix = ( s!==undefined && s !=null)? s.toString() :  this.profilePrefix ;
     this.profileName = ( n!==undefined && n !=null)? n.toString() : this.profileName;
     console.log(" s "+s)
     console.log("n "+n)
     if(this.profileName !== 'vvanvekar@gmail.com' && this.profilePrefix !== 'vvanvekar@gmail.com' ){
      this.pictureUrl = '/assets/images/profile-img-default.png'
      console.log("profile default")
     
      this.job = "register please"
      this.email  =  this.profileName
   }else {
     this.pictureUrl = '/assets/images/profile-img-self.png'
     
   }

    // userInfo = JSON.parse(JSON.stringify(userInfo))
  
 
     if(userInfo!==undefined && userInfo !==null){
      console.log("sub "+userInfo);
      console.log("email "+userInfo["email"]);
      for (const key in userInfo)
        {  
           // Get the strongly typed value with this name:
           const value = userInfo[key];
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
     
        if(Object.keys(userInfo).length > 3) {
         
            if(Array.isArray(Object.values(userInfo))){
              let em = Object.values(userInfo);
            

            }
           

        }
        
     }
  }
  logout() {
    console.log("layout logout " );
    try { 
    this.deleteAllCookies();
    localStorage.removeItem('JWT_TOKEN'); 
   /* if(this.tempoLogout !==undefined) { 
    this.tempoLogout?.pipe(tap((ata) => {
      localStorage.removeItem('JWT_TOKEN');  // Or sessionStorage.removeItem('token');
      localStorage.removeItem('token'); 
      localStorage.removeItem('sub'); 
      localStorage.removeItem('email'); 
      this.router.navigate([ this.authService.LOGIN_PATH ]);  //this.authService.LOGIN_PATH
    }))
   } 
    else {*/
      //  this.router.navigate([ this.authService.LOGIN_PATH ]);
        localStorage.removeItem('JWT_TOKEN');  // Or sessionStorage.removeItem('token');
      localStorage.removeItem('token'); 
      localStorage.removeItem('sub'); 
      localStorage.removeItem('email'); 
      console.log("logging out " );
      this.router.navigate([  '/login' ]);
    }
    catch(eerr){
      console.log("errro logging out " );
      window.location.href = '/login';
    } 
      //window.location.href = this.loginUrl+'login';
   // }
   /* this.authService.logout().pipe(tap((ata) => {
      localStorage.removeItem('JWT_TOKEN');  // Or sessionStorage.removeItem('token');
      localStorage.removeItem('token'); 
      localStorage.removeItem('sub'); 
      localStorage.removeItem('email'); 
      this.router.navigate([ this.authService.LOGIN_PATH ]);  //this.authService.LOGIN_PATH
    }));*/
    // Redirect user to the login page or home page
    
  }
  deleteAllCookies() {
      var cookies = document.cookie.split(";");
  
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i];
          var eqPos = cookie.indexOf("=");
          var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
  }
}
