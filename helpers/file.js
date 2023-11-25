let multer = require('multer')
function uploadFile(req, res, option) {
    let limit = (option && option.limit) ? option.limit : 2 * 1000 * 1000
    let type = (option && option.type) ? option.type : []
    return new Promise((res, rej) => {
        if (!option.fileName) {
            return rej('Empty')
        }
        let upload = multer({ limit })
        let mul = upload.fields([{ name: option.fileName, maxCount: 2 }])
        mul(req, res, (error, data) => {
            if (error) {
                return rej(error)
            }
            return res({ data: true })
        })
    })
}