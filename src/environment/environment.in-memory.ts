export const environment = { 
  CLIDActual:'krRm8HbsGJdajy3oFTGwQxN5iQABQ6MMFce4pRmd6tfrgXBwG3jUjstTVS5J4tQcfigHPg9FJFazL96AAY36WrbDLxVY8Qo37A',
  googleconsentid: '396732087280-6b7n6c9u4egr6vqdhaed5i43drjn9klq.apps.googleusercontent.com',
  googleApisUserInfoUrl : 'https://an6xw76iz8.execute-api.ap-south-1.amazonaws.com/dev',
  //'https://www.googleapis.com/oauth2/v1/userinfo',
  production: true,
  useInMemoryDB: true,
  notReadyConsent: true,
  netlifyGoogleAuth : { 
    remoteUrl : '/api/auth/google',

    payLoad: { username : '' }
    },
  netlifyBackend : { 
    urlLogin : '/api/v1/user/login', 
    urlRegister:'/api/v1/user/register'
},
  bakendUrl:  'https://5j3c1fv094.execute-api.us-east-1.amazonaws.com/pro',
  // "https://aftpqxynif.execute-api.us-east-1.amazonaws.com/dev",
  // "https://ie89g9eeje.execute-api.us-east-1.amazonaws.com/dev",
  //'https://5j3c1fv094.execute-api.us-east-1.amazonaws.com/pre'  , //       'http://192.168.1.5:5000/api', //(spring) 'http://localhost:8080/api',
  backNodeJWTUrl: 'http://192.168.1.5:5000/api',  /// 'http://localhost:5000/api'
  backend: { 
    baseURL:  'https://storenotify.in/.netlify/functions/netlifyproxygoogleauth',
    //"https://tjfh2jct45.execute-api.ap-south-1.amazonaws.com/dev",
        site:'https://storenotify.in/',
        logoutSpring:  'https://5j3c1fv094.execute-api.us-east-1.amazonaws.com/pro'
        
        // "https://aftpqxynif.execute-api.us-east-1.amazonaws.com/dev"
        //"https://ie89g9eeje.execute-api.us-east-1.amazonaws.com/dev",
        // 'https://5j3c1fv094.execute-api.us-east-1.amazonaws.com/pre'
      }
};
