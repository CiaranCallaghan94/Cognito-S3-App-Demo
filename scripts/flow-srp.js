console.log("srp flow started");

AWS.config.update({region: 'eu-west-1'});
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'IDENTITY_POOL_ID'});

var idpClient = new AWS.CognitoIdentityServiceProvider();

var params = {
	ClientId: "1lhslobn96hha2vgbdqlmpij7l",
	AuthFlow: "USER_PASSWORD_AUTH",
	AuthParameters: {
		USERNAME:"james",
		PASSWORD:"password"
	}
}
idpClient.initiateAuth(params,function(res){console.log(res)});

// console.log(response);

const requestHeaders = new Headers({
    'Content-Type': 'application/x-amz-json-1.1',
    'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
    'Host': 'cognito-idp.eu-west-1.amazonaws.com'
});
const requestParams = {
	method: "POST",
	body: JSON.stringify(params),
	headers: requestHeaders
}
const myRequest = new Request('https://cognito-idp.eu-west-1.amazonaws.com/',requestParams);

fetch(myRequest).then(response => {console.log(response)});

