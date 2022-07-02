const express = require('express')

const upload = require('../Controllers/Upload')
const {verification} = require('../Controllers/verification')
const route = express.Router()



route.post('/',upload.array('img', 2),verification)

module.exports = route