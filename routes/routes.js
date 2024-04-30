const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const uploadcsv = multer({ storage: storage });
const registerController = require('../controllers/registerController');
const csvUploadController = require('../controllers/csvUploadController');
const rateLimitMiddleware = require('../middleware/Ratelimit');

router.post('/register', registerController.register);

router.post('/uploadCoupon', uploadcsv.single('couponCSV'), csvUploadController.uploadCoupon);
router.post('/uploadGiftCard', uploadcsv.single('giftcardCSV'), csvUploadController.uploadGiftCard);
router.post('/uploadBatchCode', uploadcsv.single('batchcodeCSV'), csvUploadController.uploadBatchCode)


module.exports = router;