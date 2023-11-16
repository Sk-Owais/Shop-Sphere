// this contain db table schema
let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig')
class UserPermission extends Model { }
UserPermission.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { tableName: 'userpermission', modelName: 'UserPermission', sequelize: sequelizeCon })

module.exports = { UserPermission }