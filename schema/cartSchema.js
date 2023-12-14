let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig')
class Cart extends Model { }
Cart.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    productID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    totalAmount: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { tableName: 'cart', modelName: 'Cart', sequelize: sequelizeCon })

module.exports = { Cart }