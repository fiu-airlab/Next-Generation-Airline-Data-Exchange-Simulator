const express = require('express');
const router = express.Router();

const UserController = require("../../controllers/user");

/* POST signup. */
router.post('/signup', UserController.createUser);

/* POST login. */
router.post('/login', UserController.userLogin);

module.exports = router;
