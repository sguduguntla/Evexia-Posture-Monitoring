/**
* Custom
*
* Hanles the main form funcitons that is displayed in the Dale
* homepages.
*
* Dependencies: jQuery, Waypoint, Easing
*
* Copyright 2014 Empirical Themes LLC
*/

	
/**********************************
************** WOW ****************
***********************************/
// Remove WOW dependancy
if ( typeof WOW === 'function' && !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {
	// Initialize WOW
	wow = new WOW({
		boxClass:     'anim',
		animateClass: 'animated', // default
		offset:       0          // default
	});
	wow.init();
}

$(window).load(function() {
	$("#slider").nivoSlider({
		slices: 4,
		boxCols: 8,
		boxRows: 4,
		animSpeed: 200,
		prevText: '<i class="fa fa-chevron-left"></i>',
		nextText: '<i class="fa fa-chevron-right"></i>',
	});
});
	
	
jQuery(document).ready(function($) {
	
	// Setup WOW to only animate things below, uncomment/comment this line to fit your needs
	$(".anim").waypoint(function() {$(this).removeClass("anim");},{triggerOnce:true, offset:"-95%"});
	
	// Remove backstretch dependancy
	if ( $.isFunction($.fn.backstretch) ) {
		$(".slider-wrapper").backstretch(["images/slider/slide-wrapper.jpg"]);
		if (window.devicePixelRatio >= 2) {
			$("section.blur,.slug .overlay").backstretch(["images/design/video-section-bg-retina.jpg"]);
			$(".slug .overlay,section.fixed .overlay").backstretch(["images/design/video-section-bg-opac-retina.png"]);
		} else {
			$("section.blur,.slug .overlay").backstretch(["images/design/video-section-bg.jpg"]);
			$(".slug .overlay,section.fixed .overlay").backstretch(["images/design/video-section-bg-opac.png"]);
		}
	}
	
	// Remove the master slider's dependancy
	if ( typeof MasterSlider === 'function' ) {
		// Laptop slider
		var testimonials = new MasterSlider();
		testimonials.setup('testimonials' , {
			space:0,
			fullwidth:true,
			loop:true,
			autoplay:true,
			overPause:false,
			speed:20,
			width:500,
			view:"fade",
			height:500
		});
		
		$(".ms-nav-next#tNext").click(function() {
			testimonials.api.next();
		});
		
		$(".ms-nav-prev#tPrev").click(function() {
			testimonials.api.previous();
		});
	}
	
	// Create the homepage down pointer thing
	var chevronDown = $(".slider-wrapper i.fa#go-down");
	if ( chevronDown.length ) {
		function animate() {
			$(chevronDown).animate({
				bottom:'35px',
				paddingBottom:"20px",
				opacity:.1
			}, 1000, "easeOutExpo", function() {
				$(this).animate({
					bottom:"15px",
					paddingBottom:"0",
					opacity:.5
				}, 1000, "easeOutBounce");
			});
		}
		setTimeout(function() {
			$(chevronDown).css({
				bottom: '35px',
				opacity:0,
				display:'block'
			});
			setInterval(animate, 2000);
		}, 6000);
	}
	

	/***************************
	*** SMOOTH ANCHOR SCROLL ***
	***************************/
	$('a[href*=#]:not([href=#])').click(function(e) {
		e.preventDefault();
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({
			  		scrollTop: target.offset().top
				}, 1000);
		  	}
		}
	});
	
	// Initialize the parallax background
	$.stellar({
		horizontalScrolling: false,
		verticalOffset: -400
	});
		
	/************************
	****** NiceScroll *****
	*************************/
    // Remove NiceScroll dependacny
    if ( $.isFunction($.fn.niceScroll) ) {
       	$("html").niceScroll({ // The document page (body)
            cursorcolor:"#6ebff3", 
            cursorborder:"0",
			zindex:999999999
        });
		$(".navbar ul.mini").niceScroll({
			cursoropacitymax:0,
			cursoropacitymin:0,
            cursorborder	:0
		});
    }
	
	/************************
	** Portfolio functions **
	*************************/
	// Go ahead and resize the gallary
	resizeGallary(true);
	
	// Remove isotope dependancy
	if ( $.isFunction($.fn.isotope) ) {
		// cache container
		var $container = $('.gallary ul');
		// initialize isotope
		$container.isotope({
		  // options...
			easing:"easeOutCirc",
			resizable:false // We will handle this
		});
		
		// filter items when filter link is clicked
		$('#filters a').click(function(e) {
			e.preventDefault();
			
			if ($(this).hasClass("hot") ) return;
			
			$("#filters a.hot").removeClass("hot");
			$(this).addClass("hot");
			
			e.preventDefault();
			$container.isotope({
				filter: $(this).attr('data-filter')
			});
		});
		
		// Remove _.debounce dependency (underscorejs)
		if ( typeof _.debounce === 'function' ) {
			var lazyLayout = _.debounce(function calculateLayout() {
				resizeGallary(false); // Resize the gallary
				$container.isotope( 'reLayout' ) // Resize the isotope
			}, 300);
			
			$(window).resize(lazyLayout);
		}
	}
	
	// Remove _.debounce dependency (underscorejs)
	if ( typeof _.debounce === 'function' ) {
		var menuLazyLayout = _.debounce(function calculateLayout() {
			// Remove the mini nav if its visible
			if ( $(window).width() > 767 && $(".navbar ul.mini:visible").length) $(".navbar-toggle").click();
			
			// Remove the margin-top on the panels if visible
			if ($ ("ul.panels li") ) $("ul.panels li.active").removeClass("active").trigger("mousedown");
					
		}, 300);
		$(window).resize(menuLazyLayout);
	}
	
	/**
	* The resizeGallary function calculates the image dementions
	* based off of the current browser window size.
	*
	* @param isFirst	- Set this to true if this is the first
	*						time callibarting the image sizes
	*/
	function resizeGallary(isFirst) {
		var columns = 4;
		if ( $(window).width() <= 1200 ) columns = 3;
		if ( $(window).width() <= 870 )  columns = 2;
		if ( $(window).width() <= 480 )  columns = 1;
		
		var widthScaleFactor = (columns*3)/4;
		var imgWidth = Math.floor($(window).width()/columns);
		var imgHeight = (imgWidth*widthScaleFactor)/columns;
		var childIndex = 0;
		
		if ( isFirst ) $(".gallary .preview").fadeOut(400);
		
		$(".gallary li").each(function() {
			// ratio is 4/3 (width/height)
			$(this).css("width", imgWidth);
			$(this).css("height", imgHeight);
		});
		
		if ( isFirst ) {
			$(".portfolio").waypoint(function() {
				$(".gallary li img").each(function() {
					$(this).css({
						opacity:"0",
						top:"-50px",
						display:"block"
					});
					var el = this;
					setTimeout(function() {
						$(el).animate({
							opacity:"1",
							top:"0"
						}, 1800, "easeOutExpo");
					},190*childIndex++);
				});
			}, {offset: 500, triggerOnce:true});
		}
	}
	
	function add_hover_effect(el) {
		
		var desc = typeof $(el).data("title") === 'undefined' ? "" : $(el).data("title");
		var icon = typeof $(el).data("icon") === 'undefined' ? "fa-eye" : $(el).data("icon");
		var start = typeof $(el).data("start") === 'undefined' ? 0 : $(el).data("start");
		var fadeIn = typeof $(el).data("fadeIn") === 'undefined' ? 500 : parseInt($(el).data("fadeIn"));
		var fadeOut = typeof $(el).data("fadeOut") === 'undefined' ? 200 : parseInt($(el).data("fadeOut"));
		var zoom = typeof $(el).data("zoom") === 'undefined' ? false :true;
		
		if ( start == "top" )
			start = -100;
		else if ( start == "bottom" )
			start = 100;
			
		$('<span class="desc"><i class="fa '+icon+'"></i><span class="title">'+desc+'</span></span>').css({
			opacity:0,
			top:start+"%"
		}).appendTo($(el));
		
		$(el).hover(function() {
			$(el).find("span.desc").stop().animate({
				opacity:1.00,
				top:0
			}, fadeIn, "easeOutCirc");
		}, function() {
			$(el).find("span.desc").stop().animate({
				opacity:0.00,
				top:start+"%"
			}, fadeOut, "easeOutCirc");
		});
		
		if ( zoom ) {
			
		}
		
		// Allow chaining
		return el;
	}
	
	// Add hover effect
	$("a#desc").each(function() {
		add_hover_effect(this);
	});
	
	/************************
	****** Team Functions ***
	*************************/
	$(".member-box").each(function() {
		$(this).find(".progress .progress-bar").css("width", "0");
	});
	
	$(".team .ms-slide").mouseover(function() {
		// Add the scroll effect if it isn't already there	
		if ( !$(this).hasClass("linked") ) {
			$(this).addClass("linked");
			var dataTitle =  typeof $(this).data("title") === 'undefined' ? "" : 'data-title="'+$(this).data('title')+'"';
			add_hover_effect($("<a href='#' "+dataTitle+" id='desc'></a>").appendTo($(this).find(".ms-slide-bgcont")).prepend($(this).find("img"))).trigger("mouseover");
		}
	});
	
	$(".team .ms-slide").click(function(e) {
		// Prevent the page from scrolling upwards
		e.preventDefault();
		var scrollToPos = $(window).width() < 1200 ? "-475px" : "-80px";
		
		$(".member-box#"+$(this).data("member-id")).css({
			opacity:0,
			top:"-200px",
			display:"block"
		}).stop().animate({
			opacity:1,
			top:scrollToPos
		}, 600, "easeOutCirc", function() {
			$(this).find(".progress .progress-bar").filter(function() {return $(this).css("width") == "0px";}).each(function() {
				$(this).animate({
					width:$(this).data("value")+"%"
				}, 400, "easeInExpo", function() {
					$(this).addClass("animated");	
				});
			});
		});
	});
	
	// If user presses the close key
	$(".member-box a#close").click(function(e) {
		// Prevent the page from scrolling upwards
		e.preventDefault();
		$(this).parents(".member-box").stop().fadeOut(200);
	});
	
	var smallest = Number.MAX_VALUE;
	var largest  = Number.MIN_VALUE;
	var c = 0;
	// Retrieve the highest/lowest values
	var highest = $(".ms-slide").each(function() {
		c = parseInt($(this).data("member-id"));
		if ( c < smallest ) smallest = c;
		if ( c > largest ) largest = c;
	});
	
	// If user presses esc key
	$(document).keyup(function(e) {
		if ( e.keyCode == 27 ) {
			$(".member-box a#close").click(); 
		} else if ( e.keyCode == 37 ) { // Pdd left
			var id = parseInt($(".member-box:visible").attr("id"));
			--id;
			$(".member-box a#close").click(); // Close all the open boxes
			if ( !$(".member-box#"+id).length ) id = largest;
			$(".ms-slide").filter(function() {return $(this).data("member-id") == id;}).click();
		} else if ( e.keyCode == 39 ) { // Pad right
			var id = parseInt($(".member-box:visible").attr("id"));
			++id;
			$(".member-box a#close").click(); // Close all the open boxes
			if ( !$(".member-box#"+id).length ) id = smallest;
			$(".ms-slide").filter(function() {return $(this).data("member-id") == id;}).click();
		}
	});
	
	/************************
	****** Progress Bars ****
	*************************/
	$(".progress .progress-bar").each(function() {
		// Make sure this bar doens't have a member-box parent
		if ( $(this).parents(".member-box").length ) {return;}
		$(this).waypoint(function() {
			var anim = typeof $(this).data("value") === 'undefined' ? 0 : parseFloat($(this).data("value"));
			$(this).animate({
				width:anim+"%"
			}, 600, 'easeInCirc');
		}, {offset:"95%", triggerOnce:true});
	});
	
	/************************
	****** Number List ******
	*************************/
	// Remove countUp dependancy
	if ( typeof countUp === 'function' ) {
		var i = 0;
		$("ul.number-list li").each(function() {
			var span	= $(this).children("span").attr("id", "count"+i);
			var amount	= typeof $(this).data("amount") === 'undefined' ? 0 : parseInt($(this).data("amount"));
			var numAnim	= new countUp("count"+i, 0, amount, 0, 5);
			$(this).waypoint(function() {
				numAnim.start();
			}, {offset:"67%", triggerOnce:true});
			++i;
		});
	} else {
		if ( $("ul.number-list").length > 0 ) {
			console.log("CountUp function not found.");	
		}
	}
	
	/************************
	****** Accordion ******
	*************************/
	$("ul.accordion").each(function() {
		$(this).css("height", $(this).height()+"px");
		
		$(this).children("li").each(function() {
			var a = $(this).children("span").children("a");
			if ( $(this).hasClass("active" ) )
				$(a).append('<i class="fa fa-chevron-down"></i>');
			else
				$(a).append('<i class="fa fa-chevron-right"></i>');
				
			var parent = this;
			$(a).click(function(e) {
				e.preventDefault();
				if (! $(parent).hasClass('active') ) {
					$("ul.accordion li.active article").slideUp(250, "easeOutExpo", function() {
						$(this).parent("li").removeClass("active");
						$(this).siblings("span").children("a").children("i").removeClass("fa-chevron-down").addClass("fa-chevron-right");
					});
					$(parent).addClass("active").children("article").slideDown(250, "easeOutExpo");
					$(a).children("i").removeClass("fa-chevron-right").addClass("fa-chevron-down");
				}
			});
		});
	});
	
	/************************
	****** Search Bar *******
	*************************/
	$(".navbar-form i.fa").click(function() {
		if ( $(this).hasClass('fa-search') ) {
			$(".search-field").fadeIn(400).find("input").focus();
			$(this).fadeOut(105, function() {
				$(this).siblings("i.fa-times").fadeIn(200);
			});
		} else { // Pressed the times icon
			$(".search-field").fadeOut(400);
			$(this).fadeOut(105, function() {
				$(this).siblings("i.fa-search").fadeIn(200);
			});
		}
	}).hover(function() {
		$(this).animate({
			color:"#6ebff3"
		}, 400);
	}, function() {
		$(this).animate({
			color: "#868686"
		}, 400);
	});
	
	$(document).keyup(function(e) {
		if ( e.keyCode == 27 ) {
			$(".navbar-form i.fa-times").click();
		}
	});
	
	/************************
	***** EasyPieChart *****
	************************/
	// Remove easyPieChart's dependancy
	if ( $.isFunction($.fn.easyPieChart) ) {
		$('.chart').easyPieChart({
			easing: 'easeOutExpo',
			trackColor: false,
			barColor:'#ffffff',
			lineWidth:4,
			size:140,
			lineCap:'square',
			animate:2500,
			scaleColor: false,
			onStep: function(from, to, percent) {
				$(this.el).find('.percent').text(Math.round(percent)+"%");
			}
		});
		var i = 0;
		$('.chart').each(function() {
			$(this).waypoint(function() {
				var el = this;
				setTimeout(function() {
					$(el).data('easyPieChart').update($(el).data('value'));
				},(i++)*100);
			},{offset:"90%", triggerOnce:true});
		});
	} else if ( $('.chart').length ) {console.log("easyPieChart function not found");}
	
	/************************
	*** Revolution Slider ***
	************************/
	// Remove the Revolution slider's dependancy
	if ( $.isFunction($.fn.revolution) ) {
		$('.slider-wrapper').revolution({
			 delay:9000,
			 startwidth:960,
			 startheight:820,
			 autoHeight:"on",
			 fullScreenAlignForce:"off",
	 
			 onHoverStop:"on",
	 
			 hideThumbsOnMobile:"off",
			 hideBulletsOnMobile:"off",
			 hideArrowsOnMobile:"off",
			 hideThumbsUnderResoluition:0,
	 
			 hideThumbs:0,
			 hideTimerBar:"off",
	 
			 navigationType:"bullet",
			 navigationArrows:"solo",
			 navigationStyle:"round",
	 
			 navigationHAlign:"center",
			 navigationVAlign:"bottom",
			 navigationHOffset:30,
			 navigationVOffset:30,
	 
			 soloArrowLeftHalign:"left",
			 soloArrowLeftValign:"center",
			 soloArrowLeftHOffset:20,
			 soloArrowLeftVOffset:0,
	 
			 soloArrowRightHalign:"right",
			 soloArrowRightValign:"center",
			 soloArrowRightHOffset:20,
			 soloArrowRightVOffset:0,
	 
	 
			 touchenabled:"on",
			 swipe_velocity:"0.7",
			 swipe_max_touches:"1",
			 swipe_min_touches:"1",
			 drag_block_vertical:"false",
	 
			 stopAtSlide:-1,
			 stopAfterLoops:-1,
			 hideCaptionAtLimit:0,
			 hideAllCaptionAtLilmit:0,
			 hideSliderAtLimit:0,
	 
			 dottedOverlay:"none",
	 
			 fullWidth:"off",
			 forceFullWidth:"off",
			 fullScreen:"off",
			 fullScreenOffsetContainer:"#topheader-to-offset",
	 
			 shadow:0
	 
		  });
	}
	
	// Remove parallax dependancy
	if ( $.isFunction($.fn.parallax) ) {
		// Initialize the parallax background
		$('#parallax').parallax({
		  calibrateX: true,
		  calibrateY: true,
		  invertX: true,
		  invertY: true,
		  limitX: 1000,
		  limitY: 300,
		  scalarX: 20,
		  scalarY: 20,
		  frictionX: .2,
		  frictionY: 0.5
		});
	}
    
	/************************
	*** Sticky navigation ***
	************************/
	// Find the location of the header
	if ( $("#nav-begins").length ) {
		$("#nav-begins").waypoint(function(d) {
			if ( d == "down" ) {
				$(this).css("height", "89px");
				$(".dropdown-menu, .dropdown section").stop().fadeOut('fast');
				$(".navigation").addClass("fixed").css('opacity', '0').stop().animate({
					opacity:'1'
				}, 400);
			}
		}, {offset: -($(".navigation").height())}).waypoint(function(d) {
			if ( d == "up" ) {
				$(this).css("height", "0");
				$(".navigation").removeClass("fixed");
			}
		});
	} else {
		$("body").waypoint(function(d) {
			if ( d == "down" ) {
				$("#nav-ends").css("height", "89px");
				$(".dropdown-menu, .dropdown section").stop().fadeOut('fast');
				$(".navigation").addClass("fixed").css('opacity', '0').stop().animate({
					opacity:'1'
				}, 400);
			}
		}, { offset: -($(".navigation").height()) }).waypoint(function(d) {
			if ( d == "up" ) {
				$("#nav-ends").css("height", "0");
				$(".navigation").removeClass("fixed");	
			}
		}, { offset: -30 });
	}
	
	/*****************************
	****** DropDown Setup ********
	*****************************/
	var count = 0;
	$(".dropdown").each(function() {
		$(this).attr("id", "drop"+(count++));
		$(this).removeClass("h").children("a").append('<i class="fa  fa-angle-down"></i>');
		var tO = null;
		$(this).mouseenter(function() {
			var el = this;
			tO = setTimeout(function () { // Ensure the user intends to drop the menu
				$(el).find(".dropdown-menu").stop().fadeIn(200);
			}, 235);
		}).mouseleave(function() {
			clearTimeout(tO);
			$(this).find(".dropdown-menu").stop().fadeOut(200);
		});
	});
	$(".dropdown.full").each(function() { // Reposition menu
		var section = $(this).find("section.dropdown-menu");
		var destLoc = -(parseInt($(this).attr("id").replace('drop', ''))*114);
		$(section).css({left:destLoc+"px"});
	});
	
	/**************************
	**** MINI Navigation ******
	**************************/	
	// Set up the mini navigation first
	$("ul.navbar-nav").children("li").each(function() {
		// Check to see what kind of list element this is
		if ( $(this).hasClass("dropdown") ) {
			// If it is a dropdown, then we have more work to do
			var cloned = $(this).clone();
			if ( $(cloned).hasClass("full") ) {
				var newListElement  = $('<li class="sub dropdown"><i class="fa fa-chevron-right"></i><ul></ul></li>');
				// Find the first link (don't know why the user would create more, but adding [0] ensures
				// we are only using the first
				$($(cloned).children('a')[0])
				.find("i.fa")
					.remove()
				.end()
				.prependTo(newListElement);
				// Loop through every individual sub-list element
				$(cloned).find("li").each(function() {
					// Find the element, remove the inner chevron, append it to the sub <ul> tag
					$(this).find("i.fa")
								.remove()
							.end()
							.appendTo($(newListElement).find("ul"));
				});
				// Finally, append the list element to the main nav
				$(newListElement).appendTo("ul.mini");
			} else {
				// Duplicate the link, add a chevron to it, then remove the inner link used
				// in the main navigation
				cloned.addClass("sub").prepend('<i class="fa fa-chevron-right"></i>')
										.appendTo("ul.mini")
										.find(".dropdown-menu")
											.removeClass("dropdown-menu")
										.end()
										.find("a i.fa")
											.remove()
										.end();
			}
			cloned = null;
		} else {
			// No dropdown, copy the element to the navigation
			$(this).clone().appendTo("ul.mini");	
		}
	});
	
	var menu 		  = $(".navigation ul.mini");
	var navM 		  = $(".navigation");
	$(".navbar-toggle").click(function() {
		if ( !$(navM).is(":animated")  ) {
			if ( !$(navM).hasClass("down") ) {
				$(navM).animate({height:"+=203"}, 350, "easeOutExpo");
				$(menu).slideDown(400, "easeOutExpo", function() {$(navM).addClass("down");});
			} else {
				$(navM).animate({height:"-=203"}, 250, "easeOutExpo", function() {$(navM).removeClass("down");$(this).css('height', '');});
				$(menu).slideUp(200, "easeOutExpo");
			}
		}
	});
	$(".navbar ul.mini i.fa").on("click", document, function(e) {
		e.preventDefault();
		if ( $(this).hasClass("fa-chevron-right") ) {
			$(this).removeClass('fa-chevron-right').addClass("fa-chevron-down").siblings("ul").slideDown(400, "easeOutExpo");
		} else {
			$(this).addClass('fa-chevron-right').removeClass("fa-chevron-down").siblings("ul").slideUp(400, "easeOutExpo");
		}
	});
	
	/**************************
	**** 	   TABS	     ******
	**************************/	
	$(".tabs").each(function() {
		var panels 		= $(this).children("ul.panels");
		var panelHeight = parseInt($(panels).height());
		$(panels).find("li").each(function() {
			$(this).find("a").click(function(e) { e.preventDefault(); });
			$(this).prepend("<span></span>");
			$(this).mousedown(function(e) {
				if ( !$(this).hasClass("active") ) {
					$(".tab-content#"+$(this).parent("ul.panels").find("li.active").removeClass("active").data("tab-id")).fadeOut(400);
					$(".tab-content#"+$(this).addClass("active").data("tab-id")).fadeIn(400);
					// Retrieve the height of the new section
					var contentHeight = parseInt($(".tab-content#"+$(this).addClass("active").data("tab-id")).height());
					if ( $(window).width() > 1199 ) {
						$("#tab-content-wrapper").css("margin-bottom", "0");
						$(".tab-content#"+$(this).data("tab-id")).css({
							height:contentHeight+"px"
						});
						$(panels).stop().animate({
							"height": contentHeight+"px"
						}, 535, "easeOutExpo");
						$(panels).children(":first").stop().animate({
							"margin-top":(Math.abs(panelHeight/2-contentHeight/2))+"px"
						}, 535, "easeOutExpo");
					} else {
						// Remove the top padding
						$("ul.panels li:first").css("margin", "0");
						// Animate the wrapper's height
						$("#tab-content-wrapper").stop().animate({
							height:(contentHeight)+"px",
							marginBottom:"65px"
						}, 535, "easeOutExpo");
					}
				}
			});
			if ( $(this).hasClass("active") ) {
				$(this).removeClass("active").trigger("mousedown");
			}
		});
	});
	
	/**************************
	****	 SIDEBAR	 ******
	**************************/	
	$(".search-wrapper input").on('focus', document, function() {
		$(this).parent(".search-wrapper").animate({
			boxShadow: "inset 2px 2px 2px 0px rgba(0,0,0,0.05)"
		}, 100, "easeOutExpo");
	}).on('blur', document, function() {
		$(this).parent(".search-wrapper").animate({
			boxShadow: "inset 0 0 0 0 rgba(0,0,0,0,0)"
		}, 100, "easeOutExpo");
	});
	
	$(".search-wrapper i.fa").click(function() {
		$(this).parents("form").submit();
	});
	
	// Hover post functionality
	$(".sidebar ul.posts li").each(function() {
		var tO = new Array();
		$(this).mouseenter(function() {
			$(this).find(".hover").stop().fadeIn(535, "easeOutExpo");
	
			$(this).find("span").css({display:"inline-block",opacity:0}).each(function(index, element) {
				tO.push(setTimeout(function() {
					$(element).stop().animate({
						opacity:1
					}, 435, "easeOutExpo");
				}, 100*index+135));
			});
		
		}).mouseleave(function() {
			for (var i = 0; i < tO.length; i++) clearTimeout(tO[i]);
			$(this).find('.hover').stop().fadeOut(200, "easeOutExpo");
		});
	});
	
	// jQuery.support.transition
// to verify that CSS3 transition is supported (or any of its browser-specific implementations)
$.support.transition = (function(){ 
		var thisBody = document.body || document.documentElement,
		thisStyle = thisBody.style,
		support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
		
		return support; 
	})();
}); // End of script

