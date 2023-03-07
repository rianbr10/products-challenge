const express = require('express');
const router = express.Router();

const Auth = require('./middlewares/Auth');

const AuthValidator = require('./validators/AuthValidator');
const UserValidator = require('./validators/UserValidator');

const AuthController = require('./controllers/AuthController');
const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductController');

router.post('/user/signin', AuthValidator.signin, AuthController.signin);
router.post('/user/signup', AuthValidator.signup, AuthController.signup);

router.get('/user/me', Auth.private, UserController.info);
router.put('/user/me', UserValidator.editAction, Auth.private, UserController.editAction);

router.post('/product/add', Auth.private, ProductController.addAction);
router.get('/product/list', ProductController.productList);
router.get('/product/:id', ProductController.getProduct);
/* Rota de editar precisa ser com post por causa das imagens */
router.post('/product/:id', Auth.private, ProductController.editAction);
router.delete('/product/:id', Auth.private, ProductController.deleteProduct);

module.exports = router;