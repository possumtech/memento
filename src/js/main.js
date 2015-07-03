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
	if ( response.status == 'connected' ) {

		FB.api( '/me/accounts?type=pages', function( response ){

			var pages = response.data;
			for( page in pages ) {

				pages[page].admin = false;
				for( perm in pages[page].perms ) {

					if( pages[page].perms[perm] == 'ADMINISTER' ) {
						pages[page].admin = true;
					}

				}

				var checkbox_markup = '<input type="checkbox" '
					+ 'id="%s" class="%s" name="%s" value="%s" />%s<br />';
				var checkbox_regex  = /(%s)/g;

				if( pages[page].admin ) {

					var checkbox_i = 0;
					checkbox = checkbox_markup.replace(
						checkbox_regex,
						function( match ) {
							checkbox_i++;

							switch( checkbox_i ) {
								case 1: return 'memento_page_' + page;
								case 2: return 'memento_page';
								case 3: return 'memento_page';
								case 4: return page;
								case 5: return pages[page].name;
							}

						}
					);

					$( '#memento_form' ).append( checkbox );

				}

			}

			$( '#memento_scrub' ).click( function() { do_scrub( pages ); } );

		});

	}
}

function do_scrub( pages ) {

	$( '.memento_page' ).each( function() {

		pages[this.value].scrub = this.checked;

		if( this.checked ) {

			var offset = 0;
			var limit = 100;

			var query = pages[this.value].id + '/feed?limit=' + limit + '&offset=' + offset;

			FB.api( query, function( response ) {

				console.dir( response );

			});

		}

	});

}
