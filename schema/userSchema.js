// this contain db table schema
let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig')
class User extends Model { }
User.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    token: {
        type: DataTypes.STRING(500),
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, { tableName: 'user', modelName: 'User', sequelize: sequelizeCon })

module.exports = { User }