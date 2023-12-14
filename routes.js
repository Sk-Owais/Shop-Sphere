let express = require('express')
let routes = express.Router()
let product = require('./controller/productController')
let auth = require('./controller/authController')
let category = require('./controller/categoryController')
let authMid = require('./middleware/authMiddleWare')
let dash = require('./controller/dasboardController')
let cart = require('./controller/cartController')

//user auth routes
routes.get('/', auth.index) //default - homepage
routes.get('/login', auth.index)
routes.post('/register', auth.register)
routes.post('/login', auth.login)

routes.get('/forget', auth.forgetPasswordUI)
routes.post('/forgetPassword', auth.forgetPassword)
routes.post('/reset/:email', auth.pReset)

routes.get('/dashboard', authMid.authM('user'), dash.index)

//product routes
routes.get('/product/create', authMid.authM('product_create'), product.addUI)
routes.post('/product/create', authMid.authM('product_create'), product.add)
routes.get('/product/', authMid.authM('product_view'), product.viewAll)
routes.get('/product/:id', authMid.authM('product_view'), product.viewDetails)
routes.get('/product/update/:id', authMid.authM('product_update'), product.updateUI)
routes.post('/product/:id', authMid.authM('product_update'), product.update)
routes.post('/product/delete/:id', authMid.authM('product_delete'), product.pDelete)
routes.post('/product/restore/:id', authMid.authM('product_restore'), product.restore)

//category routes
routes.get('/category/create', authMid.authM('category_create'), category.createUI)
routes.post('/category/create', authMid.authM('category_create'), category.create)
routes.get('/category/', authMid.authM('category_view'), category.viewAll)
routes.get('/category/:id', authMid.authM('category_view'), category.viewDetails)
routes.get('/category/update/:id', authMid.authM('category_update'), category.updateUI)
routes.post('/category/:id', authMid.authM('category_update'), category.update)
routes.post('/category/delete/:id', authMid.authM('category_delete'), category.cDelete)
routes.post('/category/restore/:id', authMid.authM('category_restore'), category.restore)

//cart routes
// routes.post('/add/cart/:id', authMid.authM('cart_add'), cart.create)

module.exports = { routes }