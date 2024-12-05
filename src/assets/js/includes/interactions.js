import jQuery from 'jquery';
window.$ = jQuery;

jQuery.expr.filters.onscreen = function(el) {
   return (
     (el.offsetLeft + el.offsetWidth) > 0
     || (el.offsetTop + el.offsetHeight) > 0
     || (el.offsetLeft > window.innerWidth || el.offsetTop < window.innerHeight)
   );
 };

 jQuery.expr.filters.offscreen = function(el) {
   return (
     (el.offsetLeft + el.offsetWidth) < 0
     || (el.offsetTop + el.offsetHeight) < 0
     || (el.offsetLeft > window.innerWidth || el.offsetTop > window.innerHeight)
   );
 };

 ( function( $ ) {

   "use strict";

   // If we have some sections with the animate class
   if ( $('article.post') ) {

     // Loop through the on screen posts and hide
     $('.post:offscreen').each( function() {
       $(this).addClass('animate');
     });

     // Bind to the scroll function
     $(window).scroll( function() {

       // Loop the posts and animate them in
       $('.post').each( function( i ) {
         if ( ( $(window).scrollTop() + $(window).height() ) > ( $(this).offset().top ) ) {
           $(this).addClass('animate-in');
         } else {
           $(this).removeClass('animate-in');
         }
       });
     });
   }

 } )( jQuery );
