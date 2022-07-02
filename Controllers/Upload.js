const multer = require("multer");
const GoogleDriveStorage = require('multer-google-drive')
const {google }=require('googleapis');
const path = require('path')

//********Upload***************//
const storage = multer.diskStorage({
    destination: function (request, file, callback) {
      callback(null, __dirname+'./public/image');
    },
    filename: function (request, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
  });

const uploads = multer({
    storage:storage
});


// service account key file from Google Cloud console.
const KEYFILEPATH = 'GoogleServiceaAccount.json';


// Request full drive scope and profile scope, giving full access to google drive as well as the users basic profile information.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Create a service account initialize with the service account key file and scope needed
const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES
});

const drive = google.drive({version: 'v3', auth});
 const upload = multer({
  storage: GoogleDriveStorage({
    drive: drive,
    parents: '1c5o2MY0a3idabA3ekA_PESzLd3BMmgt4',
    fileName: function (req, file, cb) {
      let filename = `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, filename);
    }
  })
})


module.exports = upload
//********Upload***************//