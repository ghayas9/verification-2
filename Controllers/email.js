const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '324109435320-q64cuge05oejrjfg1dnue18mmqt4c0d4.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04AkIO2faSy3iCgYIARAAGAQSNwF-L9Irx476vg9r6Olj519qlRcs5TJYW_gSpGTi5kTpqrhEBYMI_FJ_jfnP5NB48_r5bg68jlY';
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
    );
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

module.exports ={sendMail:async(req,res,email,name,token)=> {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
        service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'backendtesting9@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const host = 'https://frontend-testing-1.herokuapp.com'
        const url = host+'/acceptInvitation/'+token 
        const mailOptions = {
          from: 'AML <backendtesting9@gmail.com>',
          to: email,
          subject: 'you are invited from AML',
          text: 'Hello from gmail email using API',
          html: `<div>
                    <h1 style='color:blue;'>Hi ${name}</h1>
                    <br>
                    <h5>You are invited from ${req.payload.name}</h5>
                    <br>
                    <a style='padding:25px; color:blue' href='${url}'>Join</a>
                </div>`
        };

        const result = await transport.sendMail(mailOptions)
        return res.json({success:true,message:'Invitation send Successfully',detail:result})

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error})
    }
}

} 
