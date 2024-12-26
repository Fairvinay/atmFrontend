import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent {
   // Array of embedded site URLs
   embeddedSites = [
    { name: 'StoreNotify', url: 'https://petercharliejohn.com'  }, //'https://storenotify.in'
    { name: 'Dashboard', url: 'https://combineus.netlify.app'}, // Add other URLs here 'https://example.com' https://ayyaztech.com
     { name: 'Dmart In ', url: 'https://dmart.in' },
 { name: 'Muthoot Finance In', url: 'https://www.muthootfinance.com/' },
  { name: 'Manappuram ', url: 'https://www.manappuram.com/' },
 { name: 'Kalyan Jwel ', url: 'https://www.kalyanjewellers.net/' },	
  { name: 'Cash Free ', url: 'https://www.cashfree.com/' },
    { name: 'PayUFinance ', url: 'https://payu.in/' },
                  { name: 'Ola in  ', url: 'https://www.olacabs.com/customer/account/login' },
     { name: 'Uber In ', url: 'https://www.uber.com/global/en/sign-in/'},
  { name: 'Amazon In', url: 'https://amazon.in' },
   { name: 'Flipkart In', url: 'https://flipkart.in' },	
 ];

  //currentSiteUrl = this.embeddedSites[0].url;
  // Default site URL
  currentSiteUrl: SafeResourceUrl | undefined;

  // Inject DomSanitizer into the component
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    /** Trigger on data load from source in case html has embed.js. */
    //iframely.load();

    // Initial setup to mark the URL as safe
    this.currentSiteUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embeddedSites[0].url);
  }
  // Method to change the embedded site
  changeSite(url: string) {
    this.currentSiteUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(url);
      /** Trigger on data load from source in case html has embed.js. */
     //iframely
  }

  // Logout action
  logout() {
    console.log('Logging out...');
    // Implement your logout logic here
  }
}
