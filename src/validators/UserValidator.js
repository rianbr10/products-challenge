const { checkSchema } = require('express-validator');

module.exports = {
    editAction: checkSchema({
        token: {
            notEmpty: true,
        },
        name: {
            optional: true,
            trim: true,
            isLength: {
                options: {
                    min: 2
                }
            },
            errorMessage: "O nome precisa ter no mínimo 2 caracteres."
        },
        email: {
            optional: true,
            isEmail: true,
            notEmpty: true,
            normalizeEmail: true,
            errorMessage: "Digite um e-mail válido."
        },
        password: {
            optional: true,
            isLength: {
                options: {
                    min: 8
                }
            },
            errorMessage: "A senha precisa ter no mínimo 8 caracteres."
        }
    })
};