
export  const environment = { 
    CLIDActual:'krRm8HbsGJdajy3oFTGwQxN5iQABQ6MMFce4pRmd6tfrgXBwG3jUjstTVS5J4tQcfigHPg9FJFazL96AAY36WrbDLxVY8Qo37A',
    googleconsentid: '396732087280-6b7n6c9u4egr6vqdhaed5i43drjn9klq.apps.googleusercontent.com',
    googleApisUserInfoUrl : 'https://an6xw76iz8.execute-api.ap-south-1.amazonaws.com/dev',
    //'https://www.googleapis.com/oauth2/v1/userinfo',
    production: true,
  useInMemoryDB: false,
  notReadyConsent: true,
  netlifyGoogleAuth : { 
    remoteUrl : '/api/auth/google',

    payLoad: { username : '' }
    },
  netlifyBackend : { 
    urlLogin : '/api/v1/user/login', 
    urlRegister:'/api/v1/user/register'
},
  bakendUrl: 'https://5j3c1fv094.execute-api.us-east-1.amazonaws.com/pro',
   //"https://aftpqxynif.execute-api.us-east-1.amazonaws.com/dev",
   //  "https://ie89g9eeje.execute-api.us-east-1.amazonaws.com/dev",
    // 'https://5j3c1fv094.execute-api.us-east-1.amazonaws.com/pre', //'http://192.168.1.5:5000/api', //(spring) 'http://localhost:8080/api',
    backNodeJWTUrl: 'http://192.168.1.5:5000/api',  /// 'http://localhost:5000/api'
    backend: { 
      baseURL:  'https://storenotify.in/.netlify/functions/netlifyproxygoogleauth',
      //"https://tjfh2jct45.execute-api.ap-south-1.amazonaws.com/dev",
        site:'https://storenotify.in/',
        logoutSpring:  'https://5j3c1fv094.execute-api.us-east-1.amazonaws.com/pro'
        // "https://aftpqxynif.execute-api.us-east-1.amazonaws.com/dev"
        //"https://ie89g9eeje.execute-api.us-east-1.amazonaws.com/dev",
        //'https://5j3c1fv094.execute-api.us-east-1.amazonaws.com/pre'
      
      //"https://6722d24aa52404a3058b270b--code-nice.netlify.app"
     
      //"http://reach.glaubhanta.site/api"  //"https://budget-node-20231209t130808-yeslsq337q-el.a.run.app"  //"https://budget-node-dot-budget-client-407513.el.r.appspot.com" //  "https://budget-client-407513.el.r.appspot.com/login"  //  "https://localhost:8080" // "https://192.168.1.4:8080" "https://meta-falcon-407301.el.r.appspot.com"
      }
}

let a :any = [ 1, 2 , 4 ,5 ];

a.forEach( (r :any) => { 
   console.log(r)
})