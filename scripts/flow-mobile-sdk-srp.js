
/* Uses the aws-cognito-auth-js sdk to authenticate a user using SRP and get id, access and refresh tokens.
 */
function flowMobileSDKSRP(username, password){
    // Create a user AuthenticationDetails object with the provided user auth parameters
    var authenticationData = {
        Username : username,
        Password : password
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
    // Create a CognitoUserPool object from our pool and client identifiers
    var poolData = {
        UserPoolId : userPoolId,
        ClientId : clientId
    };
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // Create a CognitoUser object with the configured objects
    var userData = {
        Username :username,
        Pool : userPool
    };
    cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
    // Authenticate the user
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log(result);
            // Display the tokens in the ui
            displayTokens(result);
        },
        onFailure: function(err) {
            // TODO: handle common errors and return specific recommendations
            // Display any errors returned to the ui
            document.getElementById("signinresultname").innerHTML = err.name;
            document.getElementById("signinresultmessage").innerHTML = err.message;
            console.log(err);
        },
    });
}