$(document).ready(function() {
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_US/sdk.js', function(){
		FB.init({
			appId: FB_APP_ID,
			version: 'v2.3'
		});

		FB.getLoginStatus(function(response) {
			// Check login status on load, and if the user is
			// already logged in, go directly to the welcome message.
			if (response.status == 'connected') {
				onLogin(response);
			} else {
				// Otherwise, show Login dialog first.
				FB.login(function(response) {
					onLogin(response);
				}, {perms: 'manage_pages'});
			}
		});

	});
});

function onLogin(response) {
	if (response.status == 'connected') {

		FB.api('/me/accounts?type=pages', function(response){
			console.log(response);
		});

	}
}
