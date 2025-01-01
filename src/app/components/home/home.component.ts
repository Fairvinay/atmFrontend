import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ActivationStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { MenuItemDirective } from "../../auth/directives/menu-item.directive";
import { Subscription } from 'rxjs';
import { Location } from "@angular/common";
import { GoogleAuthService } from 'src/app/services/GoogleAuthService';
import { isNullOrUndefined } from 'src/app/core/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit , AfterViewInit,  OnDestroy{
  profilePrefix: any;
  profileName: any;
  accessToken: any;
  loggedIn: boolean = false;
  user: SocialUser | undefined;
  @ViewChildren(MenuItemDirective)
  private buttons: QueryList<MenuItemDirective> | undefined;
  private routerSub: Subscription;
  loadingRoute: boolean | undefined;
  public selected: string | undefined;
 
  constructor( private cdr: ChangeDetectorRef,
    private location: Location,
 private authService: SocialAuthService, private googleAuthService: GoogleAuthService,
    private router: Router, protected  route: ActivatedRoute,
  ) {
     let checkAppJwtToken =  this.location.path().split("/")[1]
     if(checkAppJwtToken!==undefined && checkAppJwtToken !== null && checkAppJwtToken !== ''){ 
     if ( checkAppJwtToken.indexOf("app?jwt_token") > -1 ){
           console.log("app path ")
           let pp =  route.snapshot.queryParams;
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
                    this. handleGoogleSignIn();
                     // delete f.keys.find( r => r=='jwt_token')
                  /*let jwt = f.keys.find( r => r=='jwt_token')
                     jwt?.replace("jwt_token","gt");*/
                  // "@types/gapi": "^0.0.47"
                }
            });
           this.deleteQueryParameterFromCurrentRoute();
         //  window.location.href = '/';
     }
    }
    this.routerSub = router.events.subscribe((e) => {
      if (e instanceof NavigationStart || e instanceof ActivationStart) {
        this.loadingRoute = true;
      } else if (
        e instanceof NavigationEnd ||
        e instanceof NavigationError ||
        e instanceof NavigationCancel
      ) {
        this.loadingRoute = false;

        this.selectCurrentRoute();
      }
    });

  }
  deleteQueryParameterFromCurrentRoute()
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
      this.router.navigate(["/app"], { queryParams:[] });
  }
  private selectCurrentRoute() {
    this.select(this.location.path().split("/")[2]);
  }

  private select(name: string) {
    if (this.buttons) {
      this.buttons.forEach(
        (button) => (button.isSelected = button.name === name)
      );
    }
    this.selected = name;
  }

  async handleGoogleSignIn( ) {
   
        // Access user profile information
        let  accessToken =  this.accessToken;
        let i =0;
      while ( i < 2){ 
        // Use the access token to retrieve user profile data
        /*this.googleAuthService.initClient().then((us:any) =>{ 
            this.googleAuthService.isUserSignedIn().then((isLogged:boolean )=>{
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
                    }
                }).catch((err:any)=> {
                  console.log("Profile unable to validate  ....")
                });
            }).catch((er:any) => {
              console.log("User signing issue ....")

            })
        }).catch((er:any) => {
          console.log("Google provider reach issues....")
        })*/
      /* this will not work as the USER is not logged in with their consent id provided by Google 
       await   fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Extract the desired user profile information (e.g., name, email)
            console.log('User profile:', JSON.stringify(data));
            // Use the information as needed (e.g., display on your website, store securely)
        })
        .catch(error => {
            // Handle errors during profile data retrieval
            console.error('Error fetching user profile:', error);
        });
        accessToken =this.getAccessToken();
        */
        console.log("Retry with Google Provider ID ... ")
         i++
       }
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
    console.log("user   "+ JSON.stringify( this.user));
    // this.accessToken = f.get("jwt_token")
    this. handleGoogleSignIn();
  }
  ngAfterViewInit() {
    this.selectCurrentRoute();
    this.cdr.detectChanges();
  }
  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then((accessToken:any )=> this.accessToken = accessToken);
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }
}
//  handleGoogleSignIn REFERENCE 
// https://www.googlecloudcommunity.com/gc/General-Misc-Q-A/How-to-get-user-profile-while-signing-in-with-Google-account/td-p/553876

// further example material ui https://github.com/SiddAjmera/KittyGramAuth.git