/*
* ----------------------------------------------------------------------------------------
Author        : Rama Hardian Sidik
Template Name : Boine - onepage html multipurpose body builder gmy landingpage template
Version       : 1.1
Filename      : main.js
* ----------------------------------------------------------------------------------------
*/
"use strict";
var w = $(window);
var header = $('#main-header');
var popupImage = $(".popup-image");
var imagezoom = $('.img-popup-btn');
var videoPopup = $(".video-popup");
var mobileMenu = $('.mobile-navwrap');
// zoom magnificpopup init ------------------------
var magnific = function () {
  imagezoom.magnificPopup({
    type: 'image',
    gallery: {
      enabled: true
    }
  });
  if (popupImage.length > 0) {
    popupImage.magnificPopup({
      type: 'image',
      fixedContentPos: true,
      gallery: {
        enabled: true
      },
      removalDelay: 300,
      mainClass: 'mfp-fade'
    });
  }
  //Video Popup init
  $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    fixedContentPos: true
  });
  //Video Popup
  if (videoPopup.length > 0) {
    videoPopup.magnificPopup({
      type: "iframe",
      removalDelay: 300,
      mainClass: "mfp-fade",
      overflowY: "hidden",
      iframe: {
        markup: '<div class="mfp-iframe-scaler">' +
          '<div class="mfp-close"></div>' +
          '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
          '</div>',
        patterns: {
          youtube: {
            index: 'youtube.com/',
            id: 'v=',
            src: '//www.youtube.com/embed/%id%?autoplay=1'
          },
          vimeo: {
            index: 'vimeo.com/',
            id: '/',
            src: '//player.vimeo.com/video/%id%?autoplay=1'
          },
          gmaps: {
            index: '//maps.google.',
            src: '%id%&output=embed'
          }
        },
        srcAction: 'iframe_src'
      }
    });
  }
};
// scroll spy init ------------------------
var ScrollSpy = function (event) {
  var Id;
  var Menulist = $("#main-navigation ul");
  var MenuHeight = Menulist.outerHeight() + 200;
  var menuItems = Menulist.find("li > a");
  var mobilemenulist = $(".navigation-mobilemenu ul");
  var menuItemsmobile = mobilemenulist.find("li > a");
  // Anchors menu items
  var scrollItems = menuItems.map(function () {
    var item = $($(this).attr("href"));
    if (item.length) {
      return item;
    }
  });
  var fromTop = $(window).scrollTop() + MenuHeight;
  // id of current item
  var cur = scrollItems.map(function () {
    if ($(this).offset().top < fromTop)
      return this;
  });
  // id of the element
  cur = cur[cur.length - 1];
  var id = cur && cur.length ? cur[0].id : "";
  if (Id !== id) {
    Id = id;
    // Set/remove active class
    menuItems
      .parent().removeClass("aktif")
      .end().filter("[href=#" + id + "]").parent().addClass("aktif");
  }
};
// window on scroll
w.on('scroll', function () {
  ScrollSpy()
  if (w.scrollTop() > 0) {
    header.addClass('fixi');
  } else {
    header.removeClass('fixi');
  }
});
var slidecarousel = function (event) {
// testimoni slide
$('#wrap-testi').owlCarousel({
  center: true,
  stagePadding: 30,
  margin: 30,
  nav: false,
  loop: true,
  autoplay: true,
  autoplayTimeout: 10000,
  smartSpeed: 900,
  responsiveClass: true,
  responsive: {
    0: {
      items: 1
    },
    680: {
      items: 2
    },
    960: {
      items: 3
    }
  }
});
// service slide
$('#item-slide').owlCarousel({
  loop: true,
  stagePadding: 0,
  margin: 0,
  nav: false,
  dots: true,
  center: true,
  autoplay: true,
  autoplayTimeout: 10000,
  smartSpeed: 900,
  touchDrag: true,
  mouseDrag: true,
  responsiveClass: true,
  responsive: {
    0: {
      items: 1
    },
    680: {
      margin: 20,
      items: 2
    },
    960: {
      items: 3
    }
  }
});
// team slide
$('#team-slide').owlCarousel({
  loop: true,
  margin: 0,
  nav: false,
  autoplay: true,
  autoplayTimeout: 5000,
  autoplayHoverPause: true,
  dots: true,
  center: true,
  touchDrag: true,
  mouseDrag: true,
  responsive: {
    0: {
      items: 1
    },
    680: {
      margin: 20,
      items: 2
    },
    960: {
      items: 3
    }
  }
});
};
// grid gallery 
var isotopeinit = function (event) {
  setTimeout(function () {
    $('.masonry').imagesLoaded(function() {
    $('.masonry').isotope({
      resizable: false,
      itemSelector: '.item',
      layoutMode: 'masonry',
      filter: '*',
      sortBy: 'random'
    });
  });
  }, 1000);
};
// click button ---- 
var buttonclick = function (event) {
  //------------- open menu mobile 
  $('.toggle-nav').click(function () {
    $(this).addClass('open');
    mobileMenu.toggleClass("openmenu");
    if (mobileMenu.hasClass("openmenu")) {
    } else {
      $('.toggle-nav').removeClass('open');
    }
  });
  //Filtering items on portfolio
  var portfolioFilter = $('.filter li');
  // filter items on button click
  $(portfolioFilter).on('click', function () {
    var filterValue = $(this).attr('data-filter');
    $('.masonry').isotope({ filter: filterValue });
  });
  //Add/remove class on filter list
  $(portfolioFilter).on('click', function () {
    $(this).addClass('aktip').siblings().removeClass('aktip');
  });
  // mobile navigation init ----------------------
  $('#navmobile > .navigation-listmobile li a').on("click", function (e) {
    var anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $(anchor.attr('href')).offset().top - 50
    }, 0);
    mobileMenu.removeClass('openmenu');
    $('.wrap-mobiltoggle').removeClass('open');
    e.preventDefault();
  });
  //slide testimonial navigation -------------
  $('.nextslide').on('click', function () {
    $('#wrap-testi').trigger('next.owl.carousel');
  });
  $('.prevslide').on('click', function () {
    $('#wrap-testi').trigger('prev.owl.carousel');
  });
};
// form post ------
var formpost = function (event) {
  $('#formpost').submit(function (e) {
    e.preventDefault();
  }).validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      name: {
        required: true,
        minlength: 5
      },
      message: {
        required: true
      }
    },
    messages: {
      email: {
        required: 'Check your email input '
      },
      name: {
        required: 'Please check your first name input'
      },
      message: {
        required: 'Please write something for us'
      }
    },
    submitHandler: function (form) {
      $.ajax({
        type: "POST",
        url: "https://mail-sage.vercel.app/mail",
        data: $(form).serialize(),
        beforeSend: function () {
          $('.flashinfo').show();
          $('.flashinfo').html('<span class="material-icons">hourglass_bottom</span>Please wait...');
          $('input, textarea').attr('readonly', "readonly");
          $('button').attr('disable', "true");
        },
        success: function (msg) {
          if (msg == 'your message send') {
            $('#formpost').trigger("reset");
            $('.flashinfo').show();
            $('input, textarea').removeAttr('readonly');
            $('input, textarea').val('');
            $('button').removeAttr('disable');
            $('.flashinfo').html('<span class="material-icons">info</span>Your message has been sent, I will reply to you shortly');
          } else {
            $('input, textarea').removeAttr('readonly');
            $('input, textarea').val('');
            $('button').removeAttr('disable');
            $('#formpost').trigger("reset");
            $('.flashinfo').hide();
            $('.flashinfo').html('<span class="material-icons">info</span>something unknown error');
          }
        }
      });
      return false;
    }
  });
};
//page onload init -------   
$(window).load(function () {
  $('#loader').fadeOut(300);
});
// documennt ready
$(document).ready(function () {
  //detect mobile device
  var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };
  //init if not on mobile device
  if (!isMobile.any()) { }
  magnific();
  formpost();
  buttonclick();
  slidecarousel();
  isotopeinit();
});