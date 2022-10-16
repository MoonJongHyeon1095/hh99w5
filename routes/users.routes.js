const express = require('express');
const router = express.Router();
const authLoginUserMiddleware = require('../middlewares/authLoginUserMiddleware');

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

router.use('/signup',authLoginUserMiddleware, usersController.createUser);
router.use('/login',authLoginUserMiddleware, usersController.findUser);

module.exports = router;
