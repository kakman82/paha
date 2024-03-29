export const verifyEmailTemplate = (code, name) => {
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
              flex-wrap: wrap;
             
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
  
          button {
            
              margin-top: 30px;
              margin-right: auto;
              margin-left: auto;
              display: flex;
              justify-content: center;
              background-color: #00CED1;
              border: #00CED1;
              border-radius: 10px;
              padding: 12px;
  
          }
          .codeText{
              font-size: xx-large;
              letter-spacing: 7px;
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
              <span>You can use this code to verify your email address:</span>
              <button>
                  <p class="codeText">${code}</p>
              </button>
          </div>
          <div class="infoText">
  
              <p>If you have any questions, just reply to this email—we're always happy to help out.
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
