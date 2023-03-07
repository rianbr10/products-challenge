const { v4: uuid } = require('uuid');
const jimp = require('jimp');

const User = require('../models/User');
const Product = require('../models/Product');

const addImage = async (buffer) => {
    let newName = `${uuid()}.jpg`;
    let tmpImg = await jimp.read(buffer);
    tmpImg.cover(500, 500).quality(80).write(`./public/media/${newName}`);
    return newName;
}

module.exports = {
    addAction: async (req, res) => {
        let { title, desc, price, token } = req.body;
        const user = await User.findOne({token}).exec();

        if(!title || !desc || !price) {
            res.json({
                error: "Preencha todos os campos obrigatórios."
            });
            return;
        }

        if(price) { 
            price = price.replace('.', '').replace(',', '.').replace('R$ ', '');
            price = parseFloat(price);
        }

        if(Math.sign(price) === -1) {
            res.json({
                error: "O preço precisa ser um número positivo"
            });
            return;
        } 

        const newProduct = new Product();
        newProduct.idUser = user._id;
        newProduct.dateCreated = new Date();
        newProduct.title = title;
        newProduct.price = price;
        newProduct.description = desc;

        if(req.files && req.files.img) {
            if(req.files.img.length == undefined) {
                if(['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img.mimetype)) {
                    let url = await addImage(req.files.img.data);
                    newProduct.images.push({
                    url,
                    default: false
                });
                }
            } else {
                for(let i=0; i < req.files.img.length; i++) {
                    if(['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img[i].mimetype)) {
                        let url = await addImage(req.files.img[i].data);
                        newProduct.images.push({
                        url,
                        default: true
                    });
                    }
                }
            }
        }

        if(newProduct.images.length > 0) {
            newProduct.images[0].default = true;
        }

        const info = await newProduct.save();
        res.json({
            id: info._id
        });
    },
    productList: async (req, res) => {
        let { sort = 'asc', offset = 0, limit = 8, title, description } = req.query;
        let filters = {};
        let total = 0;
        
        if(title) {
            filters.title = {'$regex': title, '$options': 'i'};
        }
        if(description) {
            filters.description = {'$regex': description, '$options': description};
        }
        console.log(filters)


        const productsTotal = await Product.find(filters).exec();
        total = productsTotal.length;

        const productsData = await Product.find(filters)
            .sort({dateCreated: (sort=='desc'?-1:1)})
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .exec();

        let products = [];
        for(let i in productsData) {
            let image;

            let defaultImg = productsData[i].images.find(e => e.default);
            if(defaultImg) {
                image = `${process.env.BASE}/media/${defaultImg.url}`;
            } else {
                image = `${process.env.BASE}/media/default.jpg`
            }

            products.push({
                id: productsData[i]._id,
                title: productsData[i].title,
                price: productsData[i].price,
                desc: productsData[i].description,
                image
            })
        }

        res.json({
            products,
            total
        })
    },
    getProduct: async (req, res) => {
        let { id } = req.params;

        if(!id) {
            res.json({
                error: "Sem produto."
            });
            return;
        }

        if(id.length < 12) {
            res.json({
                error: "ID inválido."
            });
            return;
        }

        const product = await Product.findById(id);
        if(!product) {
            res.json({
                error: "Produto não encontrado."
            });
            return;
        }

        let images = [];
        for(let i in product.images) {
            images.push(`${process.env.BASE}/media/${product.images[i].url}`);
        }

        let userInfo = await User.findById(product.idUser).exec();

        res.json({
            id: product._id,
            title: product.title,
            price: product.price,
            description: product.description,
            images,
            userInfor: {
                name: userInfo.name
            }
        })
    },
    editAction: async (req, res) => {
        let { id } = req.params;
        let { title, price, desc, images, token } = req.body;

        if(id.length < 12) {
            res.json({
                error: "ID inválido."
            })
            return;
        }

        const product = await Product.findById(id).exec();
        if(!product) {
            res.json({
                error: "Produto não encontrado."
            });
            return;
        }

        const user = await User.findOne({token}).exec();
        if(user._id.toString() !== product.idUser) {
            res.json({
                error: "Você não tem permissões para editar este produto."
            });
            return;
        }

        let updates = {};

        if(title) {
            updates.title = title;
        }
        if(Math.sign(price) === -1) {
            res.json({
                error: "O preço precisa ser um número positivo"
            });
            return;
        }
        if(price) { 
            price = price.replace('.', '').replace(',', '.').replace('R$ ', '');
            price = parseFloat(price);
            updates.price = price;
        }
        if(desc) {
            updates.description = desc;
        }
        if(images) {
            updates.images = images;
        }

        await Product.findByIdAndUpdate(id, {$set: updates});

        if(req.files && req.files.img) {
            const productI = await Ad.findById(id);

            if(req.files.img.length == undefined) {
                if(['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img.mimetype)) {
                    let url = await addImage(req.files.img.data);
                    productI.images.push({
                        url
                    });
                }
            } else {
                for(let i=0; i < req.files.img.length; i++) {
                    if(['image/jpeg', 'image/jpg', 'image/png'].includes(req.files.img[i].mimetype)) {
                        let url = await addImage(req.files.img[i].data);
                        productI.images.push({
                            url,
                        });
                    }
                }
            }

            productI.images = [...productI.images];
            await productI.save();
        }

        res.json({
            msg: "Alterações salvas."
        });

    },
    deleteProduct: async (req, res) => {
        let { id } = req.params;
        let { token } = req.body;

        if(id.length < 12) {
            res.json({
                error: "ID inválido."
            })
            return;
        }

        const product = await Product.findById(id).exec();
        if(!product) {
            res.json({
                error: "Produto não encontrado."
            });
            return;
        }

        const user = await User.findOne({token}).exec();
        if(user._id.toString() !== product.idUser) {
            res.json({
                error: "Você não tem permissões para deletar este produto."
            });
            return;
        }

        Product.findOneAndRemove(id).exec();
        res.json({
            msg: "Produto deletado com sucesso."
        });
    },
};