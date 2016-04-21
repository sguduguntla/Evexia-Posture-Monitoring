<?php
/**
* AJAX email form handler.
*
* This php file takes requests from outside scripts
* in order to send an email address to the admin. This
* file also attempts to perform server-side validation
* on the information passed from third-party users.
*
* ================== NOTE =======================
* While the information is validated and safety is
* ensured, there can still be a security hole as
* this form is susceptible of spam. If there is a
* problem with spam, conisder filtering the amount
* of emails from a specifc URL.
* ===============================================
*
* @author eThemes.com
* @version 2.1
*/

// Get the settings for the email
require_once '../settings.php';

// Get the variables
$name 	 = htmlspecialchars( trim( $_POST['name'] ) );
$email	 = htmlspecialchars( trim( $_POST['email'] ) );
$subject = htmlspecialchars( trim( $_POST['subject'] ) );
$message = htmlspecialchars ( trim( $_POST['message'] ) );

// Validate the infromation (including the email)
if ( strlen( $name ) <= 0 || strlen( $email ) <= 0 || strlen( $subject ) <= 0 || strlen( $message ) <= 0 || !filter_var($email, FILTER_VALIDATE_EMAIL) )
	return 0;
	
// Set the INI file to smtp
ini_set("SMTP", $GLOBALS['smtp']);

///////////////////////////////////////
// HEADERS - Change responsibly :) ////
///////////////////////////////////////
$headers = '';

// this is the subject of the message
$subject = "Website Contact: {$subject}";
$headers .= "Content-type: text/html\r\n";

$message  = "<b>Email</b>: {$email}<br /><br />";
$message .= "<b>Message</b>: {$usermsg}<br />";

$send = @mail($global_email, $subject, $message, $headers);

if ($send)
	echo 1;
else
	echo 0;
	
?>