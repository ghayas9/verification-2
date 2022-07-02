const express = require('express')
const { Join } = require('../Controllers/Employ')

const router = express.Router()

router.post('/join/:token',Join)


module.exports = router