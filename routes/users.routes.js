const express = require('express');
const router = express.Router();
const authLoginUserMiddleware = require('../middlewares/authLoginUserMiddleware');

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

router.use('/signup',authLoginUserMiddleware, usersController.signup);
router.use('/login',authLoginUserMiddleware, usersController.login);

module.exports = router;
