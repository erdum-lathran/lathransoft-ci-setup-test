interface EmailContent {
    title: string;
    message: string;
    buttonText?: string;
    buttonLink?: string;
  }
  
  export const generateEmailTemplate = ({ title, message, buttonText, buttonLink }: EmailContent): string => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="background-color: #EAF0F3; font-family: 'Barlow', sans-serif; font-size: 16px;">
          <table style="width: 100%; max-width: 500px; margin: auto; padding: 20px; background: white; border-radius: 6px;">
              <tr>
                  <td style="text-align: center;">
                      <img src="https://easyaab.com/assets/logo.png" alt="Logo" style="height: 80px;">
                      <h2 style="color: #5E5E5E;">${title}</h2>
                      <p style="color: #5E5E5E;">${message}</p>
                      
                      ${buttonText && buttonLink ? `
                      <a href="${buttonLink}" target="_blank">
                          <button style="padding: 10px 30px; color: white; border-radius: 50px; background-color: #AA322E; border: none; font-weight: 700; cursor: pointer;">
                              ${buttonText}
                          </button>
                      </a>
                      ` : ''}
  
                      <p style="color: #5E5E5E;">&copy; 2024 LathranSuite</p>
                  </td>
              </tr>
          </table>
      </body>
      </html>
    `;
  };
  
  