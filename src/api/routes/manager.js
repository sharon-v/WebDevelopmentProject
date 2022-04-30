const express = require('express');
const router = express.Router();

const {
    signup,
    login,
    updateManagerDetails,
    getManagerDetails
} = require('../controllers/users');

router.post('/signup', signup);
router.post('/login', login);
router.post('/updateManagerDetails', updateManagerDetails);
router.post('/getManagerDetails', getManagerDetails);

module.exports = router;