import jQuery from 'jquery';
window.$ = jQuery;

jQuery.expr.filters.onscreen = function (el) {
  return (
    el.offsetLeft + el.offsetWidth > 0 ||
    el.offsetTop + el.offsetHeight > 0 ||
    el.offsetLeft > window.innerWidth ||
    el.offsetTop < window.innerHeight
  );
};

jQuery.expr.filters.offscreen = function (el) {
  return (
    el.offsetLeft + el.offsetWidth < 0 ||
    el.offsetTop + el.offsetHeight < 0 ||
    el.offsetLeft > window.innerWidth ||
    el.offsetTop > window.innerHeight
  );
};

function fadeIn(el) {
  $(el + ':offscreen').each(function () {
    $(this).addClass('animate');
  });
  $(window).scroll(function () {
    // Loop the posts and animate them in
    $(el).each(function (i) {
      if ($(window).scrollTop() + $(window).height() > $(this).offset().top) {
        $(this).addClass('animate-in');
      } else {
        $(this).removeClass('animate-in');
      }
    });
  });
}

(function ($) {
  'use strict';

  if ($('.post--list--content article')) {
    fadeIn('.post--list--content article');
  }

  if ($('.activity--list--content article')) {
    fadeIn('.activity--list--content article');
  }

  if ($('.archive--list .h-entry')) {
    fadeIn('.archive--list .h-entry');
  }

  if ($('.post-single picture')) {
    fadeIn('.post-single picture');
  }

  if ($('.comment')) {
    fadeIn('.comment');
  }
})(jQuery);
