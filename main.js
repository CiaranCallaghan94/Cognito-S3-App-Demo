// https://qwertyuiop.auth.eu-west-1.amazoncognito.com/login?response_type=token&client_id=6v84rpc8e23889t83rlr1rf6ab&redirect_uri=https://www.google.com
// When using loose Javascript files:

var UserPoolId = "";
var ClientId = "";
var cognitoUser

function UpdateConfig(){
    UserPoolId = document.getElementById('userpoolId').value;
    ClientId =  document.getElementById('appClientId').value;
     
    document.getElementById("userpoolIdDisplay").innerHTML = UserPoolId;
    document.getElementById("clientIdDisplay").innerHTML = ClientId;
}

function DisplayTokens(result){
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

function RefreshSession(){
	if(cognitoUser != null){
		cognitoUser.getSession(function(err, userData) {
			if (err) {
				alert(err.message || JSON.stringify(err));
				return;
			}
			refreshToken = userData.getRefreshToken();
			cognitoUser.refreshSession(refreshToken, (err, session) => {
				if(err) {
                    alert(err);
					console.log(err);
				} 
				else {
					DisplayTokens(session);
                    alert("Succesfully Refreshed Tokens");
                    console.log("Succesfully Refreshed Tokens");
				}
			});
		});
	}
}

//function GetCurrentUser(){
//	if (cognitoUser != null){
//		cognitoUser.getUserData(function(err, userData) {
//			if (err) {
//				alert(err.message || JSON.stringify(err));
//				return;
//			}
//        console.log(userData);
//		  document.getElementById("userNameDisplay").innerHTML = userData.Username;
//		});
//	}else {
//	alert("No user is logged in")
//	}
//}

function SignIn(){
	console.log('Signing in')
	var uname = document.getElementById('uname').value;
	var pwd = document.getElementById('pwd').value;
    console.log(uname)
    console.log(pwd)
	var authenticationData = {
        Username : uname,
        Password : pwd
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var poolData = { UserPoolId : UserPoolId,
        ClientId : ClientId
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    var userData = {
        Username :uname,
        Pool : userPool
    };
    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            DisplayTokens(result);
            alert("Succesfully Signed in and generated Tokens")
            console.log(result);
        },

        onFailure: function(err) {
            // document.getElementById("signinresultname").innerHTML = err.name;
            // document.getElementById("signinresultmessage").innerHTML = err.message;
            console.log(err);
            alert(err.message);
        },
    });
}

function SignUp(){
	console.log('Signing Up');
}

function SignOut(){
	console.log('Signing Up');
}

