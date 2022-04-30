const express = require('express');
const router = express.Router();

const {
    signup,
    login, 
    updateCustomerDetails,
    getCustomerDetails
} = require('../controllers/users');

router.post('/signup', signup);
router.post('/login', login);
router.post('/updateCustomerDetails', updateCustomerDetails);
router.post('/getCustomerDetails', getCustomerDetails);

module.exports = router;