let { Cart } = require('../schema/cartSchema')
let joi = require('joi')
let { Product } = require('../schema/productSchema')
async function checkCreate(data) {
    let schema = joi.object({
        productId: joi.number().required(),
        userId: joi.number().required(),
        quantity: joi.number().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: valid.error }
    }
    return { data: valid }
}