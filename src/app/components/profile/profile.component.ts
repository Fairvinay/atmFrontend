import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { isNullOrUndefined } from 'src/app/core/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit , AfterViewInit {
  profilePrefix: any;
  profileName: any;
fullName: string = "Vinayak A"
company: string ="Store Notify"
accountType: string ="Simple Account"
country: string ="IN"
address: string = "Pune"
phone: string = "(91) 7588230462"
email: string = "vickyscab24@gmail.com"
 job: string = "Web Designer"
pictureUrl  : string | undefined ;
  
constructor(private cdr: ChangeDetectorRef,){

}
  ngOnInit(): void {
    let s = localStorage.getItem("sub");
    let n = localStorage.getItem("email");
    let im =  localStorage.getItem("imageUrl" );

    this.profilePrefix = ( s!==undefined && s !=null)? s.toString() :  this.profilePrefix ;
    this.profileName = ( n!==undefined && n !=null)? n.toString() : this.profileName;
    
    console.log("im "+im)
    if(!isNullOrUndefined(im)){
      console.log("im " )
      this.pictureUrl = im;
      //this.cdr.detectChanges();
    }
     if(this.profileName !== 'vvanvekar@gmail.com'  && this.profilePrefix !== 'vvanvekar@gmail.com'){
        this.pictureUrl = '/assets/images/profile-img-default.png'
        console.log("profile default")
        this.fullName = "Guest Register please ";
        this.company  = "register please"
        this.accountType= "register please"
        this.country  = "register please"
        this.address  =  "register please"
        this.phone = "register please"
        this.job = "register please"
        this.email  =  this.profileName
     }
     
     else if (this.profileName !==  null  && this.profileName !== 'null' ){
       this.pictureUrl = '/assets/images/profile-img-self.png'
       
     }
     else if (this.profileName ==  null  || this.profileName == 'null' ){
      this.pictureUrl = '/assets/images/profile-img-default.png'
      this.fullName = "Guest Register please ";
      }
    }
    ngAfterViewInit() {
      console.log("View initialised ....")
     
       let im =  localStorage.getItem("imageUrl" );
       console.log("im "+im)
       if(!isNullOrUndefined(im)){
         console.log("im " )
         this.pictureUrl = im;
         this.cdr.detectChanges();
       }
      
       //( im!==undefined && im !=null)? im.toString() : '/assets/images/profile-img-default.png';
      
     }
}
