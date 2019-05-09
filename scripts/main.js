// ----- ADD configuration here ------
// UserPool Configuration Variables
var userPoolId = "";
var clientId = "";
// IdentityPool Configuration Variables
var identityPoolId = '';
// S3 Configuration Variables
var s3bucket = ''
// ----------------------------------
var userpoolRegion = userPoolId.split("_")[0]
var userpoolUrl = 'cognito-idp.'+userpoolRegion+'.amazonaws.com/'+userPoolId

var accessToken = '';
var idToken = '';
var refreshToken = '';
var identityId = '';
var s3 = '';

function displayTokens(result){
    idToken = result.idToken;
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;

    idTokenDisplay.innerHTML = idToken.jwtToken;
    accessTokenDisplay.innerHTML = accessToken.jwtToken;
    refreshTokenDisplay.innerHTML = refreshToken.token;
}

function signInButton() {
    console.log('Signing in');

    // Get the user auth parameters from the ui
    var uname = document.getElementById('uname').value;
    var pwd = document.getElementById('pwd').value;

    signIn(uname,pwd);
}

function signIn(uname,pwd){

    var authenticationData = {
        Username: uname,
        Password: pwd,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var poolData = {
        UserPoolId: userPoolId,
        ClientId: clientId
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username: uname,
        Pool: userPool
    };
    //console.log('attributesdata');
    var attributesData = {

    }
    var mfaCode = '';

    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // Display Tokens
            succesfulCognitoUserPoolSignIn(result);
        },

        newPasswordRequired: function (userAttributes, requiredAttributes) {

            console.log('Resetting the user Password');

            cognitoUser.completeNewPasswordChallenge('password', attributesData, this);
        },

        onFailure: function (err) {

            console.log('ops! something went wrong');
            console.log(err.message || JSON.stringify(err));
        }

    });
}

function succesfulCognitoUserPoolSignIn(result){
  console.log('Succesful Authentication');
  accessToken = result.getAccessToken().getJwtToken();
  idToken = result.getIdToken().getJwtToken();
  refreshToken = result.getRefreshToken().token;
  console.log('The ID token: ' + idToken);
  console.log('The Access token: ' + accessToken);
  console.log('The Refresh token: ' + refreshToken);
  displayTokens(result);
}

function getTempCredentialsFromIdentityPool(){
  console.log('Getting Temporary Credentials');
  AWS.config.region = 'eu-west-1';
  var params = {};
  params[userpoolUrl] = idToken;
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId, // your identity pool id here
      Logins: params
  });

  AWS.config.credentials.get(function (err) {
      if (err) {
          console.log(err);
      }
      else {
          displayTempCreds(AWS.config.credentials);
          s3 = new AWS.S3();
      }
  });
}

function displayTokens(result){
  idTokenObject = result.idToken;
  accessTokenObject = result.accessToken;
  refreshTokenObject = result.refreshToken;
  document.getElementById('idTokenDisplay').innerHTML = idTokenObject.jwtToken;
  document.getElementById('accessTokenDisplay').innerHTML =  accessTokenObject.jwtToken;
  document.getElementById('refreshTokenDisplay').innerHTML = refreshTokenObject.token;
}

function displayTempCreds(credentials){
  console.log('Identity ID: ' + credentials.identityId);
  console.log('Access Key: ' + credentials.accessKeyId);
  console.log('Secrete Key: ' + credentials.secretAccessKey);
  console.log('Session Token: ' + credentials.sessionToken);

  document.getElementById('accessKeyDisplay').innerHTML =  credentials.accessKeyId;
  document.getElementById('secretKeyDisplay').innerHTML =  credentials.secretAccessKey;
  document.getElementById('sessionTokenDisplay').innerHTML = credentials.sessionToken;
  document.getElementById('identityIdDisplay').innerHTML = credentials.identityId;
}

function getS3Object(){

  var fullkeyObjectValue = document.getElementById('s3fullkey').value;
  var params = {
  Bucket: s3bucket,
  Key: fullkeyObjectValue
 };
 console.log(params);
 s3.getObject(params, function(err, data) {
   if (err){
     console.log(err, err.stack);
     document.getElementById("s3img").src = '';
   } // an error occurred
   else     {
     console.log(data);           // successful response
     console.log(data.Body);
     var base64img = arrayBufferToBase64(data.Body)
     document.getElementById("s3img").src = "data:image/jpeg;base64," + base64img;
   }
 });
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

$( document ).ready(function() {
    console.log( "ready!" );
    // Display IAM policy
    var iamPolicy = { "Version": "2012-10-17", "Statement": [ { "Action": [ "s3:GetObject" ], "Effect": "Allow", "Resource": [ "arn:aws:s3:::" + s3bucket + "/${cognito-identity.amazonaws.com:sub}/*" ] } ] }
    document.getElementById('iamPolicyDisplay').innerHTML = JSON.stringify(iamPolicy, undefined, 2);


    $('#buttonSignin').click(function() {
      console.log('Sign In button clicked');
      signInButton();
    });
    $('#buttonGetCreds').click(function() {
      console.log('Get Credentials button clicked');
      getTempCredentialsFromIdentityPool();
    });
    $('#buttonGetObject').click(function() {
      console.log('Get S3 Object button clicked');
      getS3Object();
    });
});
