const express = require('express');
const router = express.Router();
const userFunctions = require('../controllers/userController');

router.get('/', userFunctions.listAllUsers)
router.post('/', userFunctions.createUser)

router.get('/:userId', userFunctions.findUser)
router.delete('/:userId', userFunctions.deleteUser)
router.put('/:userId', userFunctions.updateUser)


module.exports = router;