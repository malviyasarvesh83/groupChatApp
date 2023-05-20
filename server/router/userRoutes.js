const express = require('express');
const router = express.Router();
const userController = require('../controller/user-controller');
const Authorization = require('../middleware/auth');

router.post('/signUp', userController.signUp);
router.post('/login', userController.login);
router.get('/dashboard', Authorization.authenticate, userController.dashboard);

module.exports = router;