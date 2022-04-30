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
    updateManagerDetails: (req, res) => {
        const managerId = req.params.managerId

        Manager.update({ _id: managerId }, req.body).then(() => {
            res.status(200).json({
                message: 'Details Updated'
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    getManagerDetails: (req, res) => {
        const managerId = req.params.managerId;

        Manager.findById(managerId).then((manager) => {
            res.status(200).json({
                manager
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    }
}