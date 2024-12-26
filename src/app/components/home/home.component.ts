import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivationStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { MenuItemDirective } from "../../auth/directives/menu-item.directive";
import { Subscription } from 'rxjs';
import { Location } from "@angular/common";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit , AfterViewInit,  OnDestroy{
  profilePrefix: any;
  profileName: any;
  accessToken: any;
  @ViewChildren(MenuItemDirective)
  private buttons: QueryList<MenuItemDirective> | undefined;
  private routerSub: Subscription;
  loadingRoute: boolean | undefined;
  public selected: string | undefined;
 
  constructor( private cdr: ChangeDetectorRef,
    private location: Location,
 private authService: SocialAuthService,
    private router: Router
  ) {
     let checkAppJwtToken =  this.location.path().split("/")[1]
     if(checkAppJwtToken!==undefined && checkAppJwtToken !== null && checkAppJwtToken !== ''){ 
     if ( checkAppJwtToken.indexOf("app?jwt_token") > -1 ){
           console.log("app path ")
           window.location.href = '/';
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
  ngOnInit(): void {
    let s = localStorage.getItem("sub");
    let n = localStorage.getItem("email");
    this.profilePrefix = ( s!==undefined && s !=null)? s.toString() :  this.profilePrefix ;
    this.profileName = ( n!==undefined && n !=null)? n.toString() : this.profileName;
    console.log("home  s "+s)
    console.log("home n "+n)
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
