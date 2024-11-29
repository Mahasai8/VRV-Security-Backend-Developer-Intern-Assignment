const express = require('express');
const { authenticate, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/dashboard', authenticate, (req, res) => res.render('dashboard', { user: req.user }));

router.get('/user', authenticate, authorizeRole('User'), (req, res) => {
res.render('user')});
router.get('/moderator', authenticate, authorizeRole('Moderator'), (req, res) => {
res.render('moderator')});
router.get('/admin', authenticate, authorizeRole('Admin'), (req, res) => {res.render('admin')});


module.exports = router;
