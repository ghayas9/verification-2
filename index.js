const express=require('express');
const app =express();
const bodyParser=require('body-parser');
const mongoose =require('mongoose');
const cors =require('cors');
const multer = require('multer')
let port = process.env.PORT || 9000
const fs =require('fs')
const https = require('https')
const path = require('path')

// **************************************//
// ***********   DATABASE CONN *********//
// ************************************//

mongoose.connect(
    'mongodb+srv://ghayas:ghayas@cluster0.knli1.mongodb.net/complince?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => { console.warn('connected') }).
catch(()=>{console.warn('not connected')});


// **************************************//
// ***********   DATABASE CONN *********//
// ************************************//
app.use('/image', express.static(__dirname + '/Public/Image'))
app.use(multer().any())
app.use(cors({
    origin:'*'
})
);
// const requestIp =require('request-ip')

// app.use(requestIp.mw())
// app.use(multer().array())

app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: true }));


const company =require('./Routers/Company');
app.use(require('./Routers/verification.js'))
app.use(require('./Routers/Employ'))
app.use('/company',company)

app.get('/',(req,res)=>{
    res.send('hh')
})


// const server = https.createServer({
//     key: fs.readFileSync('./key.pem', 'utf8'),
//     cert: fs.readFileSync('./server.crt', 'utf8')
// },app)
// server.listen(port, () => console.log(port));
app.listen(port, () => console.log(port));






