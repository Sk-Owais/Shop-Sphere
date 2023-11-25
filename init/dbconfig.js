//sequelize will be import here 
// this will connect with db
let { Sequelize, Model, DataTypes, Op, QueryTypes } = require('sequelize')
let sequelizeCon = new Sequelize('Mysql://root:root@localhost/demo')
sequelizeCon.authenticate().then().catch((error) => {
    console.log(error)
})

module.exports = {
    sequelizeCon,
    Model,
    DataTypes,
    Op,
    QueryTypes
}