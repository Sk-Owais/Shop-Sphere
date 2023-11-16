let userModel = require('../model/userModel')
async function createUser(req, res) {
    let modelData = await userModel.create(req.body).catch((error) => {
        return { error }
    })
    if (!modelData || (modelData && modelData.error)) {
        let error = (modelData && modelData.error) ? modelData.error : 'internal server error'
        return res.send({ error })
    }
    return res.send({ data: modelData.data })
}

module.exports = {
    createUser
}