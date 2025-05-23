<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

require_once '../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

$email = $_GET['email'];
$customer_id = $_GET['session_id'];
$isNewUser = true;

function generateSecurePassword($length = 12)
{
  $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  $password = '';
  for ($i = 0; $i < $length; $i++) {
    $password .= $chars[random_int(0, strlen($chars) - 1)];
  }
  return $password;
}
$password = generateSecurePassword();

// Step 2: Create user via API
$apiUrl = $_ENV['CREATE_USERS'];

$userData = [
  'email' => $email,
  'password' => $password,
  'password2' => $password,
  'role' => 'account_owner',
  'is_subscribed' => true,
  'customer_stripe_id' => $customer_id,
  'subscription_status' => 'active',
  'subscription_id' => $customer_id,
];

// Initialize cURL
$ch = curl_init($apiUrl);

// Set options
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);

// Convert PHP array to JSON
$jsonData = json_encode($userData);

curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);

// Set headers
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json',
  'Content-Length: ' . strlen($jsonData)
]);

// Execute request and get response
$response = curl_exec($ch);

if ($response === false) {
  $error = curl_error($ch);
  curl_close($ch);
  die("cURL error: $error");
}

curl_close($ch);

// Decode and print the response (optional)
$responseData = json_decode($response, true);
if (isset($responseData['email'][0])) {
  if (strpos(strtolower($responseData['email'][0]), 'already exists') !== false) {
    $isNewUser = false;
    $from = 'safety-app-support@spotter.ai';
    $to = $email;
    $subject = 'Premium Subscription Activated!';
    $msg = <<<EOT
 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #008080; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Premium Subscription Activated!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Welcome Back to Spotter Sentinel Premium!</h2>
          
          <p>Your account has been successfully upgraded to premium status. You now have full access to all our premium features!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://safetyapp.spotter.ai/login/" 
               style="background-color: #008080; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Your Premium Account
            </a>
          </div>

          <p>If you have any questions about your premium subscription, our dedicated support team is here to help.</p>
          
          <p style="color: #666;">Best regards,<br>The Spotter Sentinel Team</p>
        </div>
      </div>
    `,
EOT;

    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 3;
    $mail->IsSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'];                      //Set the SMTP server to send through
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = 'tls';
    $mail->isHTML(true);                   //Enable SMTP authentication
    $mail->Username   = $_ENV['SMTP_USER'];                      //SMTP username
    $mail->Password   = $_ENV['SMTP_PASS'];                                  //SMTP password           //Enable implicit TLS encryption
    $mail->Port       = $_ENV['SMTP_PORT'];
    $mail->SMTPDebug  = SMTP::DEBUG_OFF;
    $mail->addAddress($email, 'Recipient');                             //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    //SMTP username
    //Recipients
    $mail->setFrom($from, 'Spotter Safety');
    $mail->addAddress($to);     //Add a recipient            //Name is optional

    //Content                 //Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body    = $msg;

    $mail->SMTPOptions = array('ssl' => array(
      'verify_peer' => false,
      'verify_peer_name' => false,
      'allow_self_signed' => false
    ));
    if (!$mail->Send()) {
      header("Location: Location: ../payment-status.html?success=fail");
      exit();
    } else {
      $slackData = [
        "blocks" => [
          [
            "type" => "header",
            "text" => ["type" => "plain_text", "text" => "🎉 Spotter Sentinel Subscription!", "emoji" => true]
          ],
          [
            "type" => "section",
            "text" => [
              "type" => "mrkdwn",
              "text" => $isNewUser ?
                "*Exciting news!* A new user has joined Spotter Sentinel! 🚀" :
                "*Fantastic update!* An existing user has upgraded to Premium! 🌟"
            ]
          ],
          [
            "type" => "section",
            "fields" => [
              ["type" => "mrkdwn", "text" => "*Email:*\n$email"],
              ["type" => "mrkdwn", "text" => "*Account Status:*\n" . ($isNewUser ? 'New User' : 'Existing User')]
            ]
          ],
          [
            "type" => "section",
            "fields" => [
              ["type" => "mrkdwn", "text" => "*Subscription ID:*\n$customer_id"],
              ["type" => "mrkdwn", "text" => "*Customer ID:*\n$customer_id"]
            ]
          ],
          [
            "type" => "context",
            "elements" => [
              ["type" => "mrkdwn", "text" => "Subscription activated at: " . date("Y-m-d H:i:s")]
            ]
          ]
        ]
      ];

      $ch = curl_init($_ENV['SLACK_WEBHOOK_URL']);
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($slackData));
      curl_exec($ch);
      curl_close($ch);
      header("Location: ../payment-status.html?success=pass");
      exit();
    }
  } else {
    $from = 'safety-app-support@spotter.ai';
    $to = $email;
    $subject = 'Welcome to Spotter Sentinel!';
    $msg = <<<EOT
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #008080; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to Spotter Sentinel!</h1>
        </div>
        
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Your Premium Account is Ready</h2>
          
          <p>Thank you for subscribing to Spotter Sentinel! Your account has been successfully created with full access to all our premium features.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #008080; margin-top: 0;">Your Login Credentials</h3>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Password:</strong> $password</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://safetyapp.spotter.ai/login/" 
               style="background-color: #008080; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Your Premium Account
            </a>
          </div>
          
          <div style="border-left: 4px solid #008080; padding-left: 15px; margin: 20px 0;">
            <p style="color: #666; margin: 0;">
              <strong>Important Security Note:</strong><br>
              Please change your password immediately after your first login.
            </p>
          </div>
          
          <p>If you have any questions about your premium subscription, our dedicated support team is here to help.</p>
          
          <p style="color: #666;">Best regards,<br>The Spotter Sentinel Team</p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>This email was sent to confirm your Spotter Sentinel subscription.</p>
        </div>
      </div>
EOT;

    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 3;
    $mail->IsSMTP();
    $mail->Host       = $_ENV['SMTP_HOST'];                      //Set the SMTP server to send through
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = 'tls';
    $mail->isHTML(true);                   //Enable SMTP authentication
    $mail->Username   = $_ENV['SMTP_USER'];                      //SMTP username
    $mail->Password   = $_ENV['SMTP_PASS'];                                  //SMTP password           //Enable implicit TLS encryption
    $mail->Port       = $_ENV['SMTP_PORT'];
    $mail->SMTPDebug  = SMTP::DEBUG_OFF;
    $mail->addAddress($email, 'Recipient');                            //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
    //SMTP username
    //Recipients
    $mail->setFrom($from, 'Spotter Safety');
    $mail->addAddress($to);     //Add a recipient            //Name is optional

    //Content                 //Set email format to HTML
    $mail->Subject = $subject;
    $mail->Body    = $msg;

    $mail->SMTPOptions = array('ssl' => array(
      'verify_peer' => false,
      'verify_peer_name' => false,
      'allow_self_signed' => false
    ));
    if (!$mail->Send()) {
      header("Location: Location: ../payment-status.html?success=fail");
      exit();
    } else {
      $slackData = [
        "blocks" => [
          [
            "type" => "header",
            "text" => ["type" => "plain_text", "text" => "🎉 Spotter Sentinel Subscription!", "emoji" => true]
          ],
          [
            "type" => "section",
            "text" => [
              "type" => "mrkdwn",
              "text" => $isNewUser ?
                "*Exciting news!* A new user has joined Spotter Sentinel! 🚀" :
                "*Fantastic update!* An existing user has upgraded to Premium! 🌟"
            ]
          ],
          [
            "type" => "section",
            "fields" => [
              ["type" => "mrkdwn", "text" => "*Email:*\n$email"],
              ["type" => "mrkdwn", "text" => "*Account Status:*\n" . ($isNewUser ? 'New User' : 'Existing User')]
            ]
          ],
          [
            "type" => "section",
            "fields" => [
              ["type" => "mrkdwn", "text" => "*Subscription ID:*\n$customer_id"],
              ["type" => "mrkdwn", "text" => "*Customer ID:*\n$customer_id"]
            ]
          ],
          [
            "type" => "context",
            "elements" => [
              ["type" => "mrkdwn", "text" => "Subscription activated at: " . date("Y-m-d H:i:s")]
            ]
          ]
        ]
      ];

      $ch = curl_init($_ENV['SLACK_WEBHOOK_URL']);
      curl_setopt($ch, CURLOPT_POST, true);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($slackData));
      curl_exec($ch);
      curl_close($ch);
      header("Location: ../payment-status.html?success=pass");
      exit();
    }
  }
}
