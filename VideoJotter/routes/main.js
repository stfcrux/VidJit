const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
	const title = 'Video Jotter';
	res.render('index', {title: title}) // renders views/index.handlebars
});


router.get('/showLogin', (req, res) => {
	res.render('user/login') // renders views/users/login.handlebars
});

router.get('/showRegister', (req, res) => {
	res.render('user/register') // renders views/users/register.handlebars
});

router.get('/about', (req, res) => {
	const author = 'Jin wei';
	const version = '1.0.1'; 

	let success_msg = "Success Msg"
	let error_msg = "error Message using error_msg"
	
	
	let errors = [
					{text: "first error msg"}, // does not have to be called text, its just the key
					{text: "Second error msg"},
					{text: "Third error msg"}
				];

	res.render('about', {
		author:author,
		version:version,
		success_msg:success_msg,
		error_msg:error_msg,
		errors: errors
	});
});


// Logout User
router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
