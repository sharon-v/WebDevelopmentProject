const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

router.get('/', getAllProducts);
router.post('/', createProduct);
router.patch('/:articleId', updateProduct);
router.delete('/:articleId', deleteProduct);

module.exports = router;