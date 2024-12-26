import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-acknowledge',
  templateUrl: './acknowledge.component.html',
  styleUrls: ['./acknowledge.component.css']
})
export class AcknowledgeComponent {
  site: string = environment.backend.site;
  acknowledgeForm: FormGroup | undefined;
  backUrl :any 
  googleLogin = "Sign with Google";
  isSpringJwt : any =  {
    text: "Node",
    value:true
  }
  defaultAuth : any ='Node'; 
  baseUrl: string | undefined;
   
  loggedIn: boolean = false;
  loginService: any;
  router: any;
  loginnodeServ: any;
 
}


