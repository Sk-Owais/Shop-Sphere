let { User } = require('../schema/userSchema')
let { sequelizeCon, QueryTypes } = require('../init/dbconfig')
let security = require('../helpers/security')
function authM(permission) {
    return async (req, res, next) => {
        if (typeof (permission) != 'string') {
            return res.redirect('/login?msg=Unauthorized')
        }

        let token = req.session.token
        if (typeof (token) != 'string') {
            return res.redirect('/login?msg=Unauthorized')
        }
        let decrypt = await security.decrypt(token, '#A8798WEH+').catch((error) => {
            return { error }
        })

        if (!decrypt || (decrypt && decrypt.error)) {
            return res.redirect('/login?msg=Unauthorized')
        }
        let query = `select user.id,user.name,user.email_id,user.contact,p.name as permission
        from user
        left join userpermission as up
        on user.id=up.user_id
        left join permission as p
        on up.permission_id=p.id
        where user.id='${decrypt.id}'
        and token='${token}'`;
        let user = await sequelizeCon.query(query, { type: QueryTypes.SELECT }).catch((error) => {
            return { error }
        })
        if (!user || (user && user.error)) {
            return res.redirect('/login?msg=Unauthorized')
        }
        let permissions = {}
        for (let i of user) {
            if (i.permission) {
                permissions[i.permission] = true
            }
        }
        if (permissions.length <= 0 || !permissions[permission]) {
            return res.redirect('/login?msg=Unauthorized')
        }
        req['userData'] = {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            contact: user[0].contact,
            permissions

        }
        next()
    }
}

module.exports = {
    authM
}