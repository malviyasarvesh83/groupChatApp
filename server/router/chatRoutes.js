const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat-controller');
const Authorization = require('../middleware/auth');

router.post('/saveChat', Authorization.authenticate, chatController.addChat);
router.delete('/deleteChat/:id', Authorization.authenticate, chatController.deleteChat);

module.exports = router;