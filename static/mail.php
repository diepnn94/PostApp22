<?php
$name = $_POST["name"];
$email = $_POST["email"];
$phone = $_POST["phone"];
$message = $_POST["message"];
$Body = "";

$name = trim($name);
$message = trim($message);
$phone = trim($phone);
$email = trim($email);

$EmailTo = "amy94nguyen@gmail.com";
$Subject = "Contact Form: New Message Received";

// prepare email body text
$Body .= "Name: ";
$Body .= $name;
$Body .= "\n";

$Body .= "Email: ";
$Body .= $email;
$Body .= "\n";

$Body .= "Phone: ";
$Body .= $phone;
$Body .= "\n";

$Body .= "\nMessage: \n";
$Body .= $message;
$Body .= "\n";

// send email
$success = mail($EmailTo, $Subject, $Body, "From:".$email);

// redirect to success page
if ($success){
   echo "success";
}else{
    echo "invalid";
}

?>
