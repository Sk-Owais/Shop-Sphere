let express = require('express')
let app = express()
let session = require('express-session')
let { routes } = require('./routes.js')
let config = require('config')
let port = config.get('port')
// let cors = require('cors')

// function corsFun(origin, callback) {
//     console.log('ori', origin)
//     let whiteList = {
//         localhost: true
//     }
//     if (whiteList[origin]) {
//         callback(null, true)
//     } else {
//         callback(new Error("Not allowed by CORS"))
//     }
// }

// app.use(cors({ origin: corsFun }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(session({
    secret: '#786@54$',

}))
app.use(routes)
app.listen(port, () => {
    console.log('Database Connected', port)
})