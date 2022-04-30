const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    setProductDetails
} = require('../controllers/products');

router.get('/', getAllProducts);
router.post('/', createProduct);
router.get('/:ProductId', getProduct);
router.patch('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);
router.delete('/:productId', setProductDetails);

module.exports = router;