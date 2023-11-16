//this contain all business logic 
//joi will be export here
let { Product } = require('../schema/productSchema')
let joi = require('joi')
async function create(params) {
    let valid = await checkCreate(params).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let productData = {
        name: params.productName,
        price: params.productPrice,
        description: params.desc
    }
    let data = await Product.create(productData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        return { error: 'internal server error' }
    }
    return { data: data }
}
async function checkCreate(data) {
    let schema = joi.object({
        productName: joi.string().required(),
        productPrice: joi.number().required(),
        desc: joi.string().required()
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
async function viewAll(params, permissions) {
    let limit = (params.limit) ? parseInt(params.limit) : 10;
    let page = (params.page) ? parseInt(params.page) : 1;
    let offset = (page - 1) * limit
    let where = {}
    if (!permissions.product_restore) {
        where = { is_deleted: false }
    }
    let counter = await Product.count({ where }).catch((error) => {
        return { error }
    })
    if (!counter || (counter && counter.error)) {
        return { error: 'Internal Server Error' }
    }
    if (counter <= 0) {
        return { error: 'No products found' }
    }
    let data = await Product.findAll({ limit, offset, raw: true, where }).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    return { data: data, total: counter, page, limit }
}
async function viewDetails(id) {
    let valid = await check({ id }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    return { data: data }
}
async function update(id, params) {
    params.id = id
    let valid = await checkUpdate(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id }, raw: true }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    data.name = params.productName
    data.price = params.productPrice
    data.description = params.desc
    let updateProduct = await Product.update(data, { where: { id } }).catch((error) => {
        return { error }
    })
    if (!updateProduct || (updateProduct && updateProduct.error)) {
        return { error: 'internal server error', status: 500 }
    }
    return { data: data }
}
async function checkUpdate(data) {
    let schema = joi.object({
        id: joi.number().required(),
        productName: joi.string().required(),
        productPrice: joi.number().required(),
        desc: joi.string().required()
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
async function pDelete(id, decision) {
    let valid = await check({ id }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id }, raw: true }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    if (data.is_deleted == decision) {
        return { error: 'This product is already deleted' }
    }
    let updateProduct = await Product.update({ is_deleted: decision }, { where: { id } }).catch((error) => {
        return { error }
    })
    if (!updateProduct || (updateProduct && updateProduct.error)) {
        return { error: 'internal server error', status: 500 }
    }
    if (updateProduct <= 0) {
        return { error: 'product not found' }
    }
    return { data: 'Record deleted successfully' }
}
async function check(data) {
    let schema = joi.object({
        id: joi.number().required()
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
    create,
    viewAll,
    viewDetails,
    update,
    pDelete
}