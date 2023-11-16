// this contain db table schema
let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig')
class Product extends Model { }
Product.init({
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
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue:false
    }
}, { tableName: 'product', modelName: 'Product', sequelize: sequelizeCon })

module.exports = { Product }