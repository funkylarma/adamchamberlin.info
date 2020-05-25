(function(){
	
	// USE STRICT
	"use strict";
	
	/////////////////////////////////////////////
	// PAGE FUNCTIONS
	/////////////////////////////////////////////
	
	var page = {
		init: function () {
			
			// BROWSER CHECK
			jQuery.browser = {};
			jQuery.browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
			jQuery.browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
			jQuery.browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
			jQuery.browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
			jQuery.browser.msieMobile10 = /iemobile\/10\.0/.test(navigator.userAgent.toLowerCase());
					
			// BODY CLASSES
			if (isMobileAlt) {
				body.addClass("mobile-browser");
			} else {
				body.addClass("standard-browser");
			}
			if (isAppleDevice) {
				body.addClass("apple-mobile-browser");
			}

			// ADD IE CLASS
			if (IEVersion && IEVersion < 10) {
				body.addClass('browser-ie');
			}
			
			// ADD IE10 CLASS
			var pattern = /MSIE\s([\d]+)/,
				ua = navigator.userAgent,
				matched = ua.match(pattern);
			if (matched) {
			body.addClass('browser-ie10');
			}
			
			if (jQuery.browser.mozilla) {
				body.addClass('browser-ff');
			}
									
			// FITVIDS
			page.fitVids();

		},
    
		fitVids: function() {
			jQuery('.tumblr_video_container').fitVids();
		},

		getViewportHeight: function() {
			var height = "innerHeight" in window ? window.innerHeight: document.documentElement.offsetHeight; 
			return height;		
		},
    
		checkIE: function() {
			// ----------------------------------------------------------
			// A short snippet for detecting versions of IE in JavaScript
			// without resorting to user-agent sniffing
			// ----------------------------------------------------------
			// If you're not in IE (or IE version is less than 5) then:
			//     ie === undefined
			// If you're in IE (>=5) then you can determine which version:
			//     ie === 7; // IE7
			// Thus, to detect IE:
			//     if (ie) {}
			// And to detect the version:
			//     ie === 6 // IE6
			//     ie > 7 // IE8, IE9 ...
			//     ie < 9 // Anything less than IE9
			// ----------------------------------------------------------
			
			// UPDATE: Now using Live NodeList idea from @jdalton
			var undef,
				v = 3,
				div = document.createElement('div'),
				all = div.getElementsByTagName('i');
				
			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			);
			
			return v > 4 ? v : undef;
		}
	};

	/////////////////////////////////////////////
	// GLOBAL VARIABLES
	/////////////////////////////////////////////
	
	var $window = jQuery(window),
		body = jQuery('body'),
		windowheight = page.getViewportHeight(),
		deviceAgent = navigator.userAgent.toLowerCase(),
		isMobile = deviceAgent.match(/(iphone|ipod|android|iemobile)/),
		isMobileAlt = deviceAgent.match(/(iphone|ipod|ipad|android|iemobile)/),
		isAppleDevice = deviceAgent.match(/(iphone|ipod|ipad)/),
		IEVersion = page.checkIE();
		
	/////////////////////////////////////////////
	// LOAD + READY FUNCTION
	/////////////////////////////////////////////
		
	var onReady = {
		init: function(){
			page.init();
		}
	};
	
	jQuery(document).ready(onReady.init);
  
  jQuery('.header').data('size','big');

  jQuery(window).scroll(function(){
    if(jQuery(document).scrollTop() > 0) {
      if(jQuery('.header').data('size') === 'big') {
        jQuery('.header').data('size','small');
        jQuery('.header').stop();
        jQuery('.header').removeClass( "large" ).addClass( "small" );
        }
    } else {
      if(jQuery('.header').data('size') === 'small') {
        jQuery('.header').data('size','big');
        jQuery('.header').removeClass( "small" ).addClass( "big" );
      }  
    }
  });
  
  jQuery('#back-to-top i').click(function() {
    jQuery("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });
	
	jQuery('#show-about').click(function() {
    console.log('toggle the about box');
    if( jQuery('#about').hasClass('open')) {
                jQuery('#about').removeClass('open', 250);
            } else {
                jQuery('#about').addClass('open',250);
            }
		return false;
	});
	
})(jQuery);