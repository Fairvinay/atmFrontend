//import { crt, auth , }  from  "aws-crt" ;
//import {HttpRequest,HttpHeaders  } from  "aws-crt/dist/native/http" 

/*
export function sigV4ASign(method:any, endpoint:any, config = crt):any  {
    const host = new URL(endpoint).host;
    const request = new HttpRequest(method, endpoint);
    config =   AwsSigningConfig;
    request.headers.add('host', host);
  
     auth.aws_sign_request(request, config);
    return request.headers;
}
*//*
export function sigV4ASignBasic(method:any, endpoint:any, service:any):any {
    const host = new URL(endpoint).host;
    const header = new HttpHeaders
    header.add('host', host);
    const request = new HttpRequest(method, endpoint, header);
     
      //.add('host', host);

    const config = {
        service: service,
        region: "*",
        algorithm: auth.AwsSigningAlgorithm.SigV4Asymmetric,
        signature_type:   auth.AwsSignatureType.HttpRequestViaHeaders,
        signed_body_header:  auth.AwsSignedBodyHeaderType.XAmzContentSha256,
        provider: auth.AwsCredentialsProvider.newDefault()
    };

     auth.aws_sign_request(request, config);
    return header ;
}
 */

export function isNullOrUndefined   (value: any | null | undefined): value is null | undefined    {
    return value === null || value === undefined;
  }