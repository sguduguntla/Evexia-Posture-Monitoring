 var initProfile = function() {
     var isDown = false;

     $(".showProfile").click(function(e) {

         e.preventDefault();
         var nav = $(".nav-wrapper");
         var defaultNavHeight = $(".nav-wrapper").css("height");

         if (!isDown) {
             TweenLite.to("nav", 0.5, {
                 height: $(window).height(),
                 backgroundColor: "rgba(0, 0, 0, 0.9)",
                 zIndex: 4,
                 ease: Sine.easeOut
             });

             if ($(this).parent().parent().css("background-color") == "rgb(255, 255, 255)") {
                 if ($(".showProfile i").hasClass("fa-chevron-up")) {
                     $(".showProfile").html('<i style="color: black" class="fa fa-lg fa-chevron-down"></i>');
                 } else {
                     $(".showProfile").html('<i style="color: black" class="fa fa-lg fa-chevron-up"></i>');
                 }
             } else {
                 if ($(".showProfile i").hasClass("fa-chevron-up")) {
                     $(".showProfile").html('<i style="color: white" class="fa fa-lg fa-chevron-down"></i>');
                 } else {
                     $(".showProfile").html('<i style="color: white" class="fa fa-lg fa-chevron-up"></i>');
                 }
             }

             var profileStr = '<div style="z-index: 1000;" id="profileInfo" class="animate fadeIn"><div class="row">';

             profileStr += '<form class="col s12 animate fadeIn">';
             profileStr += '<div class="circle" style="box-shadow: 2px 5px 5px black; background-image: url(img/profilePic.jpg); background-size: cover; margin: 0 auto; border: 1px solid inset; border-radius: 200px; width: 250px; height: 250px; margin-bottom: 30px;"></div>';
             profileStr += '<div class="row">';
             profileStr += '<div class="col s12 m6 l6 push-l3 push-m3">';
             profileStr += '<input style="text-align: center" id="icon_prefix" value="Guest" type="text" class="validate">';
             profileStr += '</div>';
             profileStr += '</div>';
             profileStr += '<div class="row">';
             profileStr += '<div class="col s12 m6 l6 push-l3 push-m3">';
             profileStr += '<input style="text-align: center" id="icon_prefix" value="guest@gmail.com" type="text" class="validate"></div></div>';
             profileStr += '<div class="row">';
             profileStr += '<div class="col s12 m6 l6 push-l3 push-m3">';
             profileStr += '<input style="text-align: center" id="icon_prefix" placeholder="New Password" type="password" class="validate">';
             profileStr += '</div>';
             profileStr += '</div>';
             profileStr += '<div class="row">';
             profileStr += '<div class="col s12 m6 l6 push-l3 push-m3 center">';
             profileStr += '<input type="submit" value="UPDATE" style="color: black;" class="white btn waves-dark waves-effect"/>'
             profileStr += '</div>';
             profileStr += '</div>';
             profileStr += '</div>';
             profileStr += '</div>';
             profileStr += '</form>';
             profileStr += '</div>';
             profileStr += '</div>';

             $(".nav-wrapper").append(profileStr);

             $(".brand-logo").html("Guest's Profile");

             isDown = true;
         } else {

             TweenLite.to("nav", 0.8, {
                 height: 64,
                 color: "white",
                 backgroundColor: "rgba(0, 0, 0, 0.9)",
                 ease: Sine.easeOut
             });

             if ($(this).parent().parent().css("background-color") == "rgb(255, 255, 255)") {
                 if ($(".showProfile i").hasClass("fa-chevron-up")) {
                     $(".showProfile").html('<i style="color: black" class="fa fa-lg fa-chevron-down"></i>');
                 } else {
                     $(".showProfile").html('<i style="color: black" class="fa fa-lg fa-chevron-up"></i>');
                 }
             } else {
                 if ($(".showProfile i").hasClass("fa-chevron-up")) {
                     $(".showProfile").html('<i style="color: white" class="fa fa-lg fa-chevron-down"></i>');
                 } else {
                     $(".showProfile").html('<i style="color: white" class="fa fa-lg fa-chevron-up"></i>');
                 }
             }

             $("#profileInfo").remove();

             $(".brand-logo").html("Guest's Dashboard");

             isDown = false;
         }

     });
 }