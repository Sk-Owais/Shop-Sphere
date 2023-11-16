let categoryModel = require('../model/categoryModel')

async function createUI(req, res) {
    return res.render('category/create')
}

async function create(req, res) {
    let category = await categoryModel.create(req.body,req.userData).catch((error) => { return { error } })
    // console.log("cat",category);
    if (!category || (category && category.error)) {
        let error = (category && category.error) ? category.error : 'internal server error'
        return res.redirect('/category/create?msg=error')
    }
    return res.redirect('/category')
}

async function viewAll(req, res) {
    let category = await categoryModel.viewAll(req.query, req.userData.permissions).catch((error) => { return { error } })
    if (!category || (category && category.error)) {
        return res.render('category/view', { error: category.error })
    }
    return res.render('category/view', { category: category.data, page: category.page, limit: category.limit, total: category.total, permissions: req.userData.permissions })
}

async function viewDetails(req, res) {
    let category = await categoryModel.viewDetails(req.params.id).catch((error) => { return { error } })
    if (!category || (category && category.error)) {
        return res.render('category/view', { error: category.error })
    }
    return res.render('category/details', { category: category.data })
}

async function updateUI(req, res) {
    let category = await categoryModel.viewDetails(req.params.id).catch((error) => { return { error } })
    if (!category || (category && category.error)) {
        let url = (category && category.data && category.data.id) ? '/category/' + category.data.id : '/category'
        return res.redirect(url)
    }
    return res.render('category/update', { category: category.data })
}

async function update(req, res) {
    let category = await categoryModel.update(req.params.id, req.body, req.userData).catch((error) => { return { error } })
    if (!category || (category && category.error)) {
        let url = (category && category.data && category.data.id) ? '/category/' + category.data.id : '/category'
        return res.redirect(url)
    }
    let url = (category && category.data && category.data.id) ? '/category/' + category.data.id : '/category'
    return res.redirect(url)
}

async function cDelete(req, res) {
    let category = await categoryModel.cDelete(req.params.id, true).catch((error) => { return { error } })
    if (!category || (category && category.error)) {
        let url = (req.params && req.params.id) ? '/category/' + req.params.id : '/category'
        return res.redirect(url)
    }
    return res.redirect('/category')
}

async function restore(req, res) {
    let category = await categoryModel.cDelete(req.params.id, false).catch((error) => { return { error } })
    if (!category || (category && category.error)) {
        let url = (req.params && req.params.id) ? '/category/' + req.params.id : '/category'
        return res.redirect(url)
    }
    return res.redirect('/category')
}

module.exports = {
    createUI,
    create,
    viewAll,
    viewDetails,
    updateUI,
    update,
    cDelete,
    restore
}