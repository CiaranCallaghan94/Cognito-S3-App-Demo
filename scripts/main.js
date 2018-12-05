// https://qwertyuiop.auth.eu-west-1.amazoncognito.com/login?response_type=token&client_id=6v84rpc8e23889t83rlr1rf6ab&redirect_uri=https://www.google.com
// When using loose Javascript files:

var userPoolId = "";
var clientId = "";
var cognitoUser;

function updateConfig(){
    userPoolId = document.getElementById('userpoolId').value;
    clientId =  document.getElementById('appClientId').value;
     
    document.getElementById("userpoolIdDisplay").innerHTML = userPoolId;
    document.getElementById("clientIdDisplay").innerHTML = clientId;
}

function displayTokens(result){
    var idToken = result.idToken;
    var accessToken = result.accessToken;
    var refreshToken = result.refreshToken;
           
    //document.getElementById("signinresultname").innerHTML = "Success";
    //document.getElementById("signinresultmessage").innerHTML = "User has succesfully logged in";

    document.getElementById("idToken").innerHTML = idToken.jwtToken;
    document.getElementById("idTokenParsed").innerHTML = JSON.stringify(idToken.payload);
    document.getElementById("accessToken").innerHTML = accessToken.jwtToken;
    document.getElementById("accessTokenParsed").innerHTML = JSON.stringify(accessToken.payload);
    document.getElementById("refreshToken").innerHTML = refreshToken.token;
}

function signIn() {
    console.log('Signing in');

    // Get the user auth parameters from the ui
    var uname = document.getElementById('uname').value;
    var pwd = document.getElementById('pwd').value;

    // call the implementation of this flow
    flowMobileSDKSRP(uname, pwd);
}

function signUp(){
    console.log('Signing Up');
}

function signOut(){
    console.log('Signing Out');
}

// TODO: RefreshToken reference

// TODO:
//function GetCurrentUser(){
//  if (cognitoUser != null){
//      cognitoUser.getUserData(function(err, userData) {
//          if (err) {
//              alert(err.message || JSON.stringify(err));
//              return;
//          }
//        console.log(userData);
//        document.getElementById("userNameDisplay").innerHTML = userData.Username;
//      });
//  }else {
//  alert("No user is logged in")
//  }
//}