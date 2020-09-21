const express = require('express');
const router = express.Router();

//User register URL using HTTP post => /user/register
router.post('/register',(req,res) => {
    let errors = [];
    let success_msg ='';

    //take the passwords from the user
    let password = req.body.password;
    let password2 = req.body.password2;

    let name = req.body.name;
    let email = req.body.email;


    if( password != password2){
        errors.push({text: 'Passwords do not match'}) // to add to an array, use .push()

    }

    if (password.length < 4){
        errors.push({text: 'Password must be at least 4 characters long'})
    }

    if (errors.length > 0){

        res.render('user/register', {
            errors: errors,
            name:name,
            email:email,
            password: password,
            password2:password2
        });

    }else{
        success_msg = `${email} resgistered successfully`; // ${} will show the keyed in value from the user must use `
        res.render('user/login',{
            success_msg: success_msg
        })
    }




});
module.exports = router;
