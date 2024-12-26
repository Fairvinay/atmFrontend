import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit{
  profilePrefix: any;
  profileName: any;
fullName: string = "Vinayak A"
company: string ="Store Notify"
accountType: string ="Simple Account"
country: string ="IN"
address: string = "Maharashtra"
address1: string ="Pune, Kaspate, Nisarg"
phone: string = "(91) 7588230462"
phone2: string = "(91) 8459454855"
email: string = "vickyscab24@gmail.com"
email2: string = "fairvinay@gmail.com"
  
  ngOnInit(): void {
    let s = localStorage.getItem("sub");
    let n = localStorage.getItem("email");
    this.profilePrefix = ( s!==undefined && s !=null)? s.toString() :  this.profilePrefix ;
    this.profileName = ( n!==undefined && n !=null)? n.toString() : this.profileName;

  }
}
