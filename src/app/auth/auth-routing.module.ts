import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

 
 
import { AuthGuard } from "../guards/auth.guard";
 
import { AppGuard } from "../guards/app.guard";

const routes: Routes = [
  
  {
    path: "app",
   
    canActivate: [AuthGuard],
  },
 
];

@NgModule({
  imports: [
   
   RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
