module.exports = {
    getAllProducts: (req, res) => {
        Product.find().then((products) => {
            res.status(200).json({
                products,
            });
        }).catch(error => {
            res.status(500).json({
                error,
            });
        });
    },
    createProduct: (req, res) => {
        const { productName, price, quantity } = req.body;

        const product = new Product({
            // _id: new mongoose.Types.ObjectId(),
            // גם תמונה ותיאור ומידה
            productName,
            price,
            quantity,
            picture,
            size,
            discription,
            discount, //maybe
        });

        product.save().then(() => {
            res.status(200).json({
                message: 'Created product',
            });
        }).catch(error => {
            res.status(500).json({
                error,
            });
        });
    },
    getProduct: (req, res) => {
        const productId = req.params.productId;

        Product.findById(productId).then((product) => {
            res.status(200).json({
                product,
            });
        }).catch(error => {
            res.status(500).json({
                error,
            });
        });
    },
    updateProduct: (req, res) => {
        const productId = req.params.productId;

        Product.update({ _id: productId }, req.body).then(() => {
            res.status(200).json({
                message: 'Product Updated',
            });
        }).catch(error => {
            res.status(500).json({
                error,
            });
        });
    },
    deleteProduct: (req, res) => {
        const productId = req.params.productId;

        Product.deleteOne({ _id: productId }).then(() => {
            res.status(200).json({
                message: `Product _id:${articleId} Deleted`,
            });
        }).catch(error => {
            res.status(500).json({
                error,
            });
        });
    },
};
