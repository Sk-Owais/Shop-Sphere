//this contain all business logic 
//joi will be export here
let { User } = require("../schema/userSchema")
let joi = require('joi')

async function create(params) {
    let valid = await check(params).catch((error) => {
        return { error }
    })

    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let userData = {
        name: params.userName,
        email_id: params.email,
        contact: params.phone,
        password: params.password
    }

    let data = await User.create(userData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        return { error: 'internal server error' }
    }
    return { data: data }
}

async function check(data) {
    let schema = joi.object({
        userName: joi.string().min(3).max(25).required(),
        email: joi.string().min(15).max(50).required(),
        phone: joi.number().required(),
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

module.exports = {
    create
}