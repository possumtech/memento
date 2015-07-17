var MEMENTO_LIMIT = 100;

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

			$( '#memento_scrub' ).click( function() { do_fetch( pages ); } );

		});

	}
}

function do_fetch( pages ) {

	$( '.memento_page' ).each( function() {

		pages[this.value].scrub = this.checked;

		if( this.checked ) {

			var posts = new Posts( MEMENTO_LIMIT );

			fetch_loop( posts, pages[this.value].id );

		}

	});

}

function do_scrub( posts ) {

	console.dir( posts );
	document.xxx = posts;

}

function fetch_loop( posts, page ) {

	var query = page + '/feed?limit=' + posts.limit + '&offset=' + posts.offset;

	FB.api( query, function( response ) {

		posts.posts = posts.posts.concat( response.data );

		if( response.data && response.data.length == posts.limit ) {

			fetch_loop( posts, page );

		} else {

			do_scrub( posts );

		}

	});


	posts.offset += posts.limit;
}

function Posts( limit ) {

	this.limit  = limit;
	this.offset = 0;

	this.posts = new Array();
}
