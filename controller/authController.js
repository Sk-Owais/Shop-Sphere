let authModel = require("../model/authModel")

async function register(req, res) {
    let regData = await authModel.register(req.body).catch((error) => {
        return { error }
    })
    if (!regData || (regData && regData.error)) {
        let error = (regData && regData.error) ? regData.error : 'internal server error'
        return res.send({ error })
    }
    // return res.send({ data: modelData1.data })
    return res.redirect('/?msg=success')
}

async function login(req, res) {
    let loginData = await authModel.login(req.body).catch((error) => {
        return { error }
    })
    if (!loginData || (loginData && loginData.error)) {
        let error = (loginData && loginData.error) ? loginData.error : "internal server error"
        return res.send({ error })
    }
    // return res.send({ data: loginData.data, token: loginData.token })
    req.session.token = loginData.token
    return res.redirect('/dashboard')
}

async function index(req, res) {
    res.render('regLog', {})
}

async function forgetPassword(req, res) {
    let forgetData = await authModel.forgetPassword(req.body).catch((error) => {
        return { error }
    })
    if (!forgetData || (forgetData && forgetData.error)) {
        let error = (forgetData && forgetData.error) ? forgetData.error : "internal server error"
        return res.send({ error })
    }
    return res.render('resPass', { email: req.body.email })
}
function forgetPasswordUI(req, res) {
    return res.render('forgetPassword', {})
}
async function pReset(req, res) {
    let resetData = await authModel.pReset(req.params.email, req.body).catch((error) => { return { error } })
    if (!resetData || (resetData && resetData.error)) {
        let error = (resetData && resetData.error) ? resetData.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.redirect('/login')
}
module.exports = {
    register,
    login,
    index,
    forgetPassword,
    forgetPasswordUI,
    pReset
}