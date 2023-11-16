let { User } = require('../schema/userSchema')
let joi = require('joi')
let security = require('../helpers/security')
let { UserPermission } = require('../schema/userPermissionSchema')
let generate = require('otp-generator')
let { mail } = require('../helpers/mailer')

async function check(data) {
    let schema = joi.object({
        userName: joi.string().required(),
        email: joi.string().required(),
        phone: joi.string().required(),
        password: joi.string().min(8).max(14).required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => {
        return { error }
    })

    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function register(params) {
    let valid = await check(params).catch((error) => {
        return { error }
    })

    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findUser = await User.findOne({ where: { email_id: params.email } }).catch((error) => {
        return { error }
    })
    if (findUser || (findUser && findUser.error)) {
        return { error: "Already exists" }
    }

    let msg_dig = await security.hash(params.password).catch((error) => {
        return { error }
    })
    if (!msg_dig || (msg_dig && msg_dig.error)) {
        return { error: "internal server error" }
    }
    let userData = {
        name: params.userName,
        email_id: params.email,
        contact: params.phone,
        password: msg_dig.data
    }

    let data = await User.create(userData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        return { error: "internal server error" }
    }
    let userPermission = {
        user_id: data.id,
        permission_id: 1
    }
    let upData = await UserPermission.create(userPermission).catch((error) => {
        return { error }
    })

    if (!upData || (upData && upData.error)) {
        return { error: "error" }
    }

    return { data }
}

async function checkLogin(params) {
    let schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    })

    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function login(params) {
    let valid = await checkLogin(params).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let find = await User.findOne({ where: { email_id: params.email } }).catch((error) => {
        return { error }
    })
    if (!find || (find && find.error)) {
        return { error: "Email is not found" }
    }
    let confirmation = await security.compare(params.password, find.password).catch((error) => {
        return { error }
    })
    if (!confirmation || (confirmation && confirmation.error)) {
        return { error: "wrong password" }
    }
    let token = await security.encrypt({ id: find.id }, "#A8798WEH+").catch((error) => {
        return { error }
    })
    if (!token || (token && token.error)) {
        return { error: token.error }
    }
    let updateToken = await User.update({ token: token }, { where: { id: find.id } }).catch((error) => {
        return { error }
    })
    if (!updateToken || (updateToken && updateToken.error) || (updateToken && updateToken[0] <= 0)) {
        return { error: "internal server error" }
    }
    return { token: token }
}

async function checkForP(params) {
    let schema = joi.object({
        email: joi.string().required()
    })
    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

async function forgetPassword(params) {
    let valid = await checkForP(params).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let find = await User.findOne({ where: { email_id: params.email } }).catch((error) => {
        return { error }
    })
    if (!find || (find && find.error)) {
        return { error: 'user not found' }
    }
    let otp = generate.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
    let hashOtp = await security.hash(otp).catch((error) => {
        return { error }
    })
    if (!hashOtp || (hashOtp && hashOtp.error)) {
        return { error: hashOtp.error }
    }
    let saveOtp = await User.update({ otp: hashOtp.data }, { where: { id: find.id } }).catch((error) => {
        return { error }
    })
    if (!saveOtp || (saveOtp && saveOtp.error)) {
        return { error: saveOtp.error }
    }
    let mailOption = {
        from: 'oshaik427@gmail.com',
        to: params.email,
        subject: ".....",
        text: `This is your otp ${otp}`
    }
    let sendMail = await mail(mailOption).catch((error) => {
        return { error }
    })
    if (!sendMail || (sendMail && sendMail.error)) {
        return { error: "mail cannot" }
    }
    return { data: `mail is send to ${params.email}` }
}

module.exports = {
    register,
    login,
    forgetPassword
}