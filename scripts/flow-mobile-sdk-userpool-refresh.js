
/* Uses the aws-cognito-auth-js sdk to refresh the id and access tokens for a user using a refresh token.
 */
function refreshSession(){
	// Check that there are tokens present for a user to refresh
	if(cognitoUser != null){
		cognitoUser.getSession(function(err, userData) {
			if (err) {
				alert(err.message || JSON.stringify(err));
				return;
			}
			// Use the refresh token to refresh the session 
			refreshToken = userData.getRefreshToken();
			cognitoUser.refreshSession(refreshToken, (err, session) => {
				if(err) {
					console.log(err);
				} 
				else {
					console.log("Succesfully Refreshed Tokens")
					displayTokens(session)
				}
			});
		});
	}else{
		// TODO: display an appropriate message to the user
	}
}