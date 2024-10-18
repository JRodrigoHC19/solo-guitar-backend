const { DataTypes } = require('sequelize');
const { sequelize } = require('./database/connection');


const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        values: ['cliente', 'empresa'],
        allowNull: false,
        defaultValue: 'cliente'
        
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true
    },
    sex: {
        type: DataTypes.ENUM,
        values: ['male', 'female', 'other'],
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    url_web: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'usuarios'
});


module.exports = {
    User
};
