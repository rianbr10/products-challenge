const { validationResult, matchedData } = require('express-validator');
const bcrypt = require("bcrypt");

const User = require('../models/User');
const Product = require('../models/Product');

module.exports = {
    info: async (req, res) => {
        let token = req.query.token;

        const user = await User.findOne({token});
        const products = await Product.find({idUser: user._id.toString()});
        
        let productsList = [];
        for(let i in products) {
            productsList.push({
                id: products[i]._id,
                title: products[i].title,
                price: products[i].price,
                images: products[i].images,
                dateCreated: products[i].dateCreated
            })
        }

        res.json({
            name: user.name,
            email: user.email,
            products: productsList
        })
    },
    editAction: async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.json({
                error: errors.mapped()
            });
            return;
        }
        const data = matchedData(req);
        let updates = {};

        const user = await User.findOne({token: data.token});

        if(data.name) {
            updates.name = data.name;
        }
        if(data.email) {
            const emailCheck = await User.findOne({email: data.email});
            if(emailCheck) {
                res.json({
                    error: "E-mail já existente."
                });
                return;
            }
            updates.email = data.email;
        }
        if(data.password) {
            updates.passwordHash = await bcrypt.hash(data.password, 10);
        }

        await User.findOneAndUpdate({token: data.token}, {$set: updates});

        res.json({
        }) 
    }
};