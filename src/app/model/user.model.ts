export class User {
    username: string | undefined;
    password: string | undefined 

    toString = () => { 
        return " { \"  \" : \""+ this.username +"\"  ,  \"  \" : \""+ this.password +"\"  } "
    }
}
