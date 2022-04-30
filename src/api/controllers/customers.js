// איו עדיין מימוש לפונקציות פה

module.exports = {
    
    signup: (req, res) => {
        res.status(200).json({
            message: 'Signup'
        })
    },
    login: (req, res) => {
        res.status(200).json({
            message: 'Login'
        })
    },
    // אני חושבת שלא צריך אבל אני אשאיר אם תצטרכי כנל במנהל הוספתי
    updateCustomerDetails: (req, res) => {
        const customerId = req.params.customerId

        customer.update({ _id: customerId }, req.body).then(() => {
            res.status(200).json({
                message: 'Details Updated'
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    getCustomerDetails: (req, res) => {
        const costomerId = req.params.customerId;

        Customer.findById(customerId).then((customer) => {
            res.status(200).json({
                customer
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    }
}