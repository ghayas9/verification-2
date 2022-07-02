const {google }=require('googleapis');
const path = require('path');
const fs = require('fs');
const CLIENT_ID = '165102394556-5btomvdd6vugkdnio7ssk4g65j98d3b5.apps.googleusercontent.com';
            const CLIENT_SECRET = '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';
            const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
            const REFRESH_TOKEN = '1//045-IaOblNJ7KCgYIARAAGAQSNwF-L9IrBf0lfPmyT5g5PwPE2tVKblOqaRXPv5H4QhA5dhmgWAynUbzKc-hliX7AmbUWeCUipAU';

        const oauth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
        );

        oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

        const drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
        });

/* 
filepath which needs to be uploaded
Note: Assumes example.jpg file is in root directory, 
though this can be any filePath
*/

const uploadFile = async(name)=> {
    return new Promise((rej,res)=>{
      try {
        const response = await drive.files.create({
          requestBody: {
            name:  name,
            mimetype: 'image/jpeg'
          },
          media: fs.fs.readFileSync(path.join(__dirname,'../Public/Image/'+name))
        });
    
        res(response)
        
      } catch (error) {
        rej(error) 
      }
    })
  }
//   uploadFile();
  
  async function deleteFile() {
    try {
      const response = await drive.files.delete({
        fileId: 'YOUR FILE ID',
      });
      console.log(response.data, response.status);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  // deleteFile();
  
  async function generatePublicUrl() {
    try {
      const fileId = 'YOUR FILE ID';
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      /* 
      webViewLink: View the file in browser
      webContentLink: Direct download link 
      */
      const result = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  }

  module.exports = {
    uploadFile
  }