export const passwordResetTemplate = (name, url) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            background-color: #E0FFFF;
            font-family: sans-serif;
        }
        .main {
            background-color: white;
            min-height: 50vh;
            margin-right: auto;
            margin-left: auto;
            margin-top: 20px;
            max-width: 80vw ;
            border-radius: 10px;
            border: solid 2px #00CED1;
        }
        .content {
            
            display: flex;
            flex-direction: column;
            text-align: center;
           
        }
        b {
            margin-top: 20px;
            color: #00CED1;
            font-size: x-large;
        }
        p {
            font-size: xx-large;
            font-weight: 800;
            color: #008B8B;
        }

        span {
            font-size: larger;
            color: grey;
        }

        .linkButton {
          
            margin-top: 30px;
            margin-right: auto;
            margin-left: auto;
            display: flex;
            justify-content: center;
            background-color: #00CED1;
            border: #00CED1;
            border-radius: 10px;
            padding: 12px;
            cursor: pointer;
            text-decoration: none;

        }
        .buttonText{
            font-size: x-large;
            text-align: center;
            margin: auto;
            color: white;
        }
       
        .infoText {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50px;
            margin-right: 10px;
            margin-left: 20px;
        }
        .infoText p {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: grey;
            font-size: medium;
            font-weight: 400;
        }


    </style>
</head>
<body>
    <div class="main">
        <div class="content">
            <b>Xpenss.</b>
            <p>Hello ${name},</p>
            <span>Forgot your password?</span>
            <br>
            <span>We received a request to reset the password for your account</span>
            <br>
            <span>To reset your password, click the below button</span>

                <a class=linkButton href="${url}">

                    <p class="buttonText">Reset Password</p>
                </a>

            <br>
            <br>
            <span>Or just copy and paste this URL into your browser.</span>
            <br>
            <a style="font-size: smaller" href="${url}">${url}</a>
        </div>
        <div class="infoText">

            <p>If you did not request a password reset, you can safely ignore this email. <br>Only a person with access your email can reset your password.
            </p>
            <p>
                Cheers,
            </p>            
             <p style="margin-top: 0px">
                Xpenss Team
             </p>   
        </div>
    </div>
</body>
</html>
    
    `;
};
