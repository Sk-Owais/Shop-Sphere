let productModel = require('../model/productModel')
async function add(req, res) {
    let modelData = await productModel.create(req.body).catch((error) => {
        return { error }
    })

    if (!modelData || (modelData && modelData.error)) {
        let error = (modelData && modelData.error) ? modelData.error : 'internal server error'

        return res.redirect('/product/create?msg=error')
    }
    return res.redirect('/product')
}

function addUI(req, res) {
    return res.render('product/add', {})
}

async function viewAll(req, res) {
    let products = await productModel.viewAll(req.query, req.userData.permissions).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        return res.render('product/view', { error: products.error })
    }
    return res.render('product/view', { products: products.data, page: products.page, limit: products.limit, total: products.total, permissions: req.userData.permissions })
}

async function viewDetails(req, res) {
    let products = await productModel.viewDetails(req.params.id).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        return res.render('product/view', { error: products.error })
    }
    return res.render('product/details', { products: products.data })
}

async function updateUI(req, res) {
    let products = await productModel.viewDetails(req.params.id).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/product'
        return res.redirect(url)
    }
    return res.render('product/update', { products: products.data })
}

async function update(req, res) {
    let products = await productModel.update(req.params.id, req.body).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/product'
        return res.redirect(url)
    }
    let url = (products && products.data && products.data.id) ? '/product/' + products.data.id : '/product'
    return res.redirect(url)
}

async function pDelete(req, res) {
    let products = await productModel.pDelete(req.params.id, true).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        let url = (req.params && req.params.id) ? '/product/' + req.params.id : '/product'
        return res.redirect(url)
    }
    return res.redirect('/product')

}

async function restore(req, res) {
    let products = await productModel.pDelete(req.params.id, false).catch((error) => { return { error } })
    console.log('p', products)
    if (!products || (products && products.error)) {
        let url = (req.params && req.params.id) ? '/product/' + req.params.id : '/product'
        return res.redirect(url)
    }
    return res.redirect('/product')
}

module.exports = {
    add,
    viewAll,
    viewDetails,
    addUI,
    updateUI,
    update,
    pDelete,
    restore
}