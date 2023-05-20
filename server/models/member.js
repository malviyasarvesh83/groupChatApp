const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Member = sequelize.define('member', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    memberName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    groupName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    isAdmin:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
})

module.exports = Member;