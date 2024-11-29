const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const router = express.Router();

router.get('/signup', (req, res) => res.render('signup.ejs',{ msg: "Register Here" }));
router.get('/login', (req, res) => res.render('login.ejs', { msg: "Login Here" }));
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
