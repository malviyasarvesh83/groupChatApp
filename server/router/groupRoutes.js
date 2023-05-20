const express = require('express');
const router = express.Router();
const groupController = require('../controller/group-controller');
const Authorization = require('../middleware/auth');

router.post('/createGroup', Authorization.authenticate, groupController.createGroup);
router.get('/getGroup', Authorization.authenticate, groupController.getGroup);
router.post('/addMember', Authorization.authenticate, groupController.addMember);
router.get('/getMember', Authorization.authenticate, groupController.getMember);

module.exports = router;