const { checkSchema } = require('express-validator');

module.exports = {
    signup: checkSchema({
        name: {
            trim: true,
            isLength: {
                options: {
                    min: 2
                }
            },
            errorMessage: "O nome precisa ter no mínimo 2 caracteres."
        },
        email: {
            isEmail: true,
            notEmpty: true,
            normalizeEmail: true,
            errorMessage: "Digite um e-mail válido."
        },
        password: {
            isLength: {
                options: {
                    min: 8
                }
            },
            errorMessage: "A senha precisa ter no mínimo 8 caracteres."
        }
    }),
    signin: checkSchema({
        email: {
            isEmail: true,
            notEmpty: true,
            normalizeEmail: true,
            errorMessage: "Digite um e-mail válido."
        },
        password: {
            notEmpty: true,
            errorMessage: "O campo senha não pode estar vazio."
        }
    })
};