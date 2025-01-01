import { Account } from "./account";
import { Role } from "./types";

export class User {
  id?: string| undefined;
  accountId?: string| undefined;
  account?: Account;
  email?: string | undefined;
  password?: string| undefined;
  confirmationCode?: string| undefined;
  role?: Role;
  picture:string | undefined;
  confirmed?: boolean;
  tfa?: boolean;
  externalId: {
    google:  string | undefined;
  } | undefined
  createdWith: string | undefined;
  build = function (data:any) {
    var user = new User();
    return Object.assign(user, data);
   };
  toSafeUser = function (user:User) {
    var id = user.id, accountId = user.accountId, email = user.email, role = user.role, confirmed = user.confirmed, tfa = user.tfa
       var code  = user.confirmationCode, pic= user.picture
    
    return { id: id, accountId: accountId, email: email, picture: pic, confirmationCode: code, role: role, confirmed: confirmed, tfa: tfa };
};

}
 /** @class */
/*
var User = (function () {
  function User() {
      this.confirmed = false;
      this.tfa = false;
      this.createdWith = 'password';
  }
  User.toSafeUser = function (user) {
      var id = user.id, accountId = user.accountId, email = user.email, role = user.role, confirmed = user.confirmed, tfa = user.tfa
         var code  = user.confirmationCode;
      
      return { id: id, accountId: accountId, email: email,  confirmationCode: code, role: role, confirmed: confirmed, tfa: tfa };
  };
  User.build = function (data) {
      var user = new User();
      return Object.assign(user, data);
  };
  return User;
}()); 
*/