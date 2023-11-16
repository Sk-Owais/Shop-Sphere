let { Category } = require('../schema/categorySchema')
let joi = require('joi')
async function checkCreate(data) {
    let schema = joi.object({
        name: joi.string().required(),
        image: joi.string().required()
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
async function create(params, userData) {
    let valid = await checkCreate(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findCategory = await Category.findOne({ where: { name: params.name } }).catch((error) => {
        return { error }
    })
    if (findCategory || (findCategory && findCategory)) {
        return { error: "Category already exists" }
    }
    let categoryData = {
        name: params.name,
        image: params.image,
        created_by: userData.id,
        updated_by: userData.id
    }
    let data = await Category.create(categoryData).catch((error) => { return { error } })
    console.log("data",data);
    if (!data || (data && data.error)) {
        return { error: "internal server error", status: 500 }
    }
    return { data: data }
}
async function viewAll(params, permissions) {
    let limit = (params.limit) ? parseInt(params.limit) : 10
    let page = (params.page) ? parseInt(params.page) : 1
    let offset = (page - 1) * limit
    let where = {}
    if (!permissions.category_restore) {
        where = { is_deleted: false }
    }
    let counter = await Category.count({ where }).catch((error) => { return { error } })
    if (!counter || (counter && counter.error)) {
        return { error: 'Internal Server Error' }
    }
    if (counter <= 0) {
        return { error: 'No products found' }
    }
    let data = await Category.findAll({ limit, offset, raw: true, where }).catch((error) => {
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
    let data = await Category.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    return { data: data }

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
async function checkUpdate(data) {
    let schema = joi.object({
        id: joi.number().required(),
        name: joi.string().required(),
        image: joi.string().required()
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
async function update(id, params, userData) {
    params.id = id
    let valid = await checkUpdate(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Category.findOne({ where: { id }, raw: true }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: 'Category does not exist', status: 500 }
    }
    data.name = params.name
    data.image = params.image
    data.updated_by = userData.id
    let updateCategory = await Category.update(data, { where: { id } }).catch((error) => {
        return { error }
    })
    if (!updateCategory || (updateCategory && updateCategory.error)) {
        return { error: 'internal server error', status: 500 }
    }
    if (updateCategory <= 0) {
        return { error: 'Category not found' }
    }
    return { data: data }
}

async function cDelete(id, decision) {
    let valid = await check({ id }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Category.findOne({ where: { id }, raw: true }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    if (data.is_deleted == decision) {
        return { error: 'Category is already deleted' }
    }
    let updateCategory = await Category.update({ is_deleted: decision }, { where: { id } }).catch((error) => {
        return { error }
    })
    if (!updateCategory || (updateCategory && updateCategory.error)) {
        return { error: 'internal server error', status: 500 }
    }
    if (updateCategory <= 0) {
        return { error: 'Category not found' }
    }
    return { data: 'Record deleted successfully' }
}

module.exports = {
    create,
    viewAll,
    viewDetails,
    update,
    cDelete

}