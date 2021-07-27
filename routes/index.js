const express = require('express');
const router = express.Router();
const userFunctions = require('../controllers/userController');
const loginFunctions = require('../controllers/loginController');

router.get('/users', userFunctions.listAllUsers)
router.post('/users', userFunctions.createUser)

router.get('/users/:userId', userFunctions.findUser)
router.delete('/users/:userId', userFunctions.deleteUser)
router.put('/users/:userId', userFunctions.updateUser)

router.post('/login', loginFunctions.login)


module.exports = router;