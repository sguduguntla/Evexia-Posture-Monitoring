/**
* Contact Form
*
* Hanles the main form funcitons that is displayed in the Dale
* homepages.
*
* Dependencies: jQuery
*
* Copyright 2014 Empirical Themes LLC
*/
 
// Path to the AJAX functions
var pathToAjax = "ajax/email.php";

/**
* Shorthand function that handles the displaying of the custom 
* message.
*
* @param message - The message to display to the user
* @param type 	 - (Optional) Type of message (i.e., 'warning')
*/
function displayFormMsg(message, warningType) {
	
	// For the primary contact form style
	var fa = "";
	if ( warningType == "warning" ) fa = '<i class="fa fa-exclamation-triangle"></i>';
	
	var classType = 'message';
	
	if ( $(".content-section.contact").hasClass("style-2") ) {
		classType = 'alert';
	}
	
	alert($(".content-section.contact"));
	// Fade message out
	msg = $(".form #message");
	msg.css("opacity", "0");
	msg.append('<div class="'+ classType + ' '+warningType+'"><div class="col-lg-12"><p>'+fa+message+'</p><i class="fa fa-sort-asc arr"></i></div></div>');	
	msg.animate({
		opacity:1
	}, 400, "easeOutCirc");
}

var processing = false;
$("button#submit_contact").click(function (e) {
	// Prevent url from changing
	e.preventDefault();
	
	if ( processing )
		return;
	else
		processing = true;
		
	msg = $(".form #message");
	var childMsg = msg.find('div.message');
	
	if ( childMsg.length ) {
		$(childMsg).animate({
			opacity:0
		}, 100, "easeOutCirc", function() {
			$(this).remove();	
		});
	}
	
	var isValid = true;
	
	// Validate inputs
	$(".form.contact input, .form.contact textarea").each(function() {
		if ( $(this).val() <= 0 ) {
			displayFormMsg("Looks like you've missed something.", "warning");
			$(this).addClass("err");
			return isValid=false;
		}
		
		// Specifically the email
		if ( $(this).attr("name") == "contactEmail" ) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if ( !re.test($(this).val()) ) {
				displayFormMsg("Human, that's not a valid email!", "warning");
				$(this).addClass("err");
				return isValid=false;
			}
		}
	});
	
	if ( isValid ) {
		// Form is valid, send message
		$.ajax( {
				type: "POST",
				url: pathToAjax,
				data:{
					name:$(".form.contact input[name='contactName']").val(),
					email:$(".form.contact input[name='contactEmail']").val(),
					subject:$(".form.contact input[name='contactSubject']").val(),
					message:$(".form.contact textarea").val(),
				}
		}).done(function(response) {
			// Success, remove the button
			if ( response == 1 ) {
				$(".form.contact #message_sent").css({
					opacity:"0",
					display:"block"
				}).animate({
					opacity:1
				}, 400, "easeOutCirc", function() {
					// Add the text message
					$(this).append("<p>Message Sent, Thank You</p>");

					// Display the checkmark
					$(this).find("i.fa").css({
						opacity:"0",
						display:"block"
					}).animate({
						opacity:1
					}, 400, "easeOutCirc"/*, function() {   // UNCOMMENT LINES TO SHOW SUCCESS MESSAGE TO USER ///
						// Move checkmark to the top
						$(this).animate({
							top:"30%"
						}, 600, "easeOutCirc", function () {
							$(this).siblings("p").css({
								opacity:0,
								display:"block"
							}).animate({
								opacity:1
							}, 700, "easeOutCirc");
						});
					}*/);
				});
			} else {
				displayFormMsg("Something went wrong :/", "warning");
				processing = false;
			}
		}).fail(function() {
			// Error
			displayFormMsg("Something went wrong :/", "warning");
			processing = false;
		}).always(function() {
			// Completed
		});
	} else {
		processing = false;
	}
});

// Handle the default active funcitonality
$(".form.contact input").focus(function() {
	// Set the destination color
	var toColor = "#6ebff3";
	if ( $(this).hasClass("err") ) toColor = "#f5b075";
	$(this).siblings("i.fa").animate({
		color:toColor
	}, 600, "easeOutCirc");
}).blur(function() {
	$(this).siblings("i.fa").animate({
		color:"#8b8b8b"
	}, 300, "easeOutCirc");
});

// Close message thing when user presses it
$(".form.contact #message").click(function() {
	$(this).stop().animate({
		opacity:0
	}, 100, "easeOutCirc", function() {
		$(this).children('.message').remove();	
	});
});