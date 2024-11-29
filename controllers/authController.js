const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const TOKEN_EXPIRY = '15m'; // Token expires in 15 minutes

const generateToken = (user) => {
  const sessionExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
  return jwt.sign(
    { 
      id: user._id, 
      username: user.username, 
      role: user.role, 
      sessionExpiry 
    },
    process.env.JWT_SECRET
  );
};

function validatePassword(password) {
  const minLength = 8;
  const uppercaseRegex = /[A-Z]/;      // At least one uppercase letter
  const digitRegex = /\d/;            // At least one digit
  const specialCharRegex = /[@#$%^&*(),.?":{}|<>!]/; // At least one special character

  if (password.length < minLength) {
    return "Password must be at least 8 characters long.";
  }
  if (!uppercaseRegex.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!digitRegex.test(password)) {
    return "Password must contain at least one digit.";
  }
  if (!specialCharRegex.test(password)) {
    return "Password must contain at least one special character.";
  }
  return "Password is valid!";
}

exports.signup = async (req, res) => {
    const username=req.body.username
    const password=req.body.password
    const role=req.body.role

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('signup.ejs', { msg: "User already exist" })
        }
        const passwordValidation = validatePassword(password);
        if (passwordValidation !== "Password is valid!") {
            console.log(passwordValidation)
            return res.status(400).json({ message: passwordValidation });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword, role });
        console.log(newUser);
        return res.render('login.ejs', { msg: "Login here" })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const username=req.body.username;
    const password=req.body.password;
    try {
            const user = await User.findOne({ username });
            console.log(user)
            if (!user) {
                return res.render('login.ejs', { msg: "NO user Found" });
            }

            const match = await bcrypt.compare(password,user.password);
            console.log(match);
            if(!(await bcrypt.compare(password, user.password))){
              return res.render('login.ejs', { msg: "Your password is incorrect ! Please enter correct password" });
            }
            const token = generateToken(user);
            res.cookie('token', token, { httpOnly: true });
            return res.redirect('/dashboard');
    } catch (error) {
            // res.status(500).json({ error: error.message });
            return res.render('login.ejs', { msg: "Wrong credentials" })
    }  
};





exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

