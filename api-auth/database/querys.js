const { User } = require('../models');
const bcrypt = require('bcryptjs');

// post de creacion de usuario
const createUser = async function (data) {
    try {
        const hashed_password = await bcrypt.hash(data.password, 10);
        const new_user = await User.create({...data, password: hashed_password});
        return { 
            id: new_user.id,
            email: new_user.email,
            role: new_user.role
        };
    } catch (error) {
        return { status: -1, msg: error.message };
    }
}


// get del logeo - uso del token publico
const getUserByIdAndEmailAndRole = async function (id, email, role) {
    try {
        const user = await User.findOne({ where: { id: id, email: email, role: role } });
        if (!user) { throw new Error('Invalid email or password') }
        return { user };
    } catch (error) {
        return { status: -1, msg: error.message };
    }
}


// post de logeo de usuario - uso de credenciales
const getUserByEmailAndPassword = async function (email, password) {
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) { return { code: 0, msg: "ningun usuario encontrado!" }}
        
        const validPwd = await bcrypt.compare(password, user.password);
        if (!validPwd) { return { code: 1, msg: "constraseña incorrecta!" }}

        json_user = user.toJSON();
        delete json_user.password;
        switch (user.role) {
            case 'cliente':
                delete json_user.country;
                delete json_user.url_web;
                break;
            case 'empresa':
                delete json_user.date_of_birth;
                delete json_user.sex;
                break;
        }
        
        return { user: json_user };
    } catch (error) {
        console.error("Error:", error);
        return { status: -1, msg: error.message };
    }
}


const isEmailRegisted = async function (email) {
    try {
        const user = await User.findOne({ where: { email }, attributes: ['id'] });
        return !!user;
    } catch (error) {
        return { status: -1, msg: error.message };
    }
}

module.exports = {
    getUserByEmailAndPassword,
    getUserByIdAndEmailAndRole,
    isEmailRegisted,
    createUser,
};