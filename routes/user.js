const express = require('express');
const router = express.Router();
const alertMessage = require('../helpers/messenger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User register URL using HTTP post => /user/register
router.post('/register', (req, res) => {
    let errors = [];
    let success_msg = '';

    //take the passwords from the user
    let password = req.body.password;
    let password2 = req.body.password2;

    let name = req.body.name;
    let email = req.body.email;


    if (password != password2) {
        errors.push({ text: 'Passwords do not match' }) // to add to an array, use .push()

    }

    if (password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters long' })
    }

    if (errors.length > 0) {

        res.render('user/register', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        });

    } else {

        //select TOP(1) from user where email = 'abc@abc.com'
        User.findOne({ where: { email: req.body.email } })
            .then(user => {
                if (user) {
                    // if user is found, that means email has already been registered
                    res.render('user/register', {
                        error: user.email + ' already registered',
                        name,
                        email,
                        password,
                        password2
                    }
                    )
                } else {

                    // using bcryptjs libary to hash the password
                    // hash the password when the current email is not registered and before creating the user record
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw err;
                            password = hash;

                            // create a record in the data base
                            // insert into user (name,email,password) values (?,?,?)
                            User.create({ name, email, password }).then(user => {
                                alertMessage(res, 'success', user.name + 'added. Please Login', 'fas fa-sign-in-alt', true);
                                res.redirect('/showLogin');
                            }).catch(err => console.log(err));

                        })

                    })

                }
            });
        // success_msg = `${email} resgistered successfully`; // ${} will show the keyed in value from the user must use `
        // res.render('user/login',{
        //     success_msg: success_msg
        // })
    }

});




router.post('/login', (req,res,next) => {
    passport.authenticate('local',{
        successRedirect: '/video/listVideos',
        failureRedirect: '/showLogin',
        failureFlash: true
    })(req,res,next);

});

module.exports = router;
