const express = require('express');
const router = express.Router();

const auth = require('./auth/auth');
const config = require('./config/serialPort');
const order = require('./order/order');
const params = require('./params/params');
const report = require('./report/report');
const stock = require('./stock/stock');
const usr= require('./user/user');
const system = require('./system/system');
const crypt = require('./crypt/validation');

router.use(auth)
router.use(config)
router.use(order)
router.use(params)
router.use(report)
router.use(stock)
router.use(usr)
router.use(system)
router.use(crypt)

module.exports = router
