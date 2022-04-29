module.exports = {
    getAllProducts: (req, res) => {
        res.status(200).json({
            message: 'Get All Products'
        })
    },
    createProduct: (req, res) => {
        res.status(200).json({
            message: 'Create a new product'
        })
    },
    updateProduct: (req, res) => {
        const productId = req.params.productId

        res.status(200).json({
            message: `Update product - ${productId}`
        })
    },
    deleteProduct: (req, res) => {
        const productId = req.params.productId

        res.status(200).json({
            message: `Delete product - ${productId}`
        })
    }
}