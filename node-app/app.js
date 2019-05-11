const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const sqlite3 = require('sqlite3').verbose();

const { authMiddleware } = require('./middleware.js');
const { hashPassword } = require('./utils.js');

const app = express();
const config = JSON.parse(fs.readFileSync('../config.json'));
const port = 3000;

const db = new sqlite3.Database('../sqlite.db');

app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', [authMiddleware], function(req, res) {
	let message;
	if (req.cookies.token) {
		message = "You're logged into the Node app!";
	} else {
		message = 'You can register/login using the register/login link';
	}
	res.render('index', { message });
	return;
});

app.get('/login', function(req, res) {
	res.render('login');
	return;
});

app.get('/register', function(req, res) {
	res.render('register');
	return;
});

app.post('/register', function(req, res) {
	const { username, email, password } = req.body;

	db.run(
		'INSERT INTO users (username, password, email) VALUES ($username, $password, $email)',
		{
			$username: username,
			$password: hashPassword(password),
			$email: email
		},
		function(err) {
			if (err) {
				console.error(err);
				return;
			}
			res.redirect('/');
		}
	);
});

app.post('/login', function(req, res) {
	const { username, password } = req.body;

	db.get(
		'SELECT * FROM users where username = $username;',
		{
			$username: username
		},
		function(err, row) {
			if (err) {
				console.error(err);
				res.render('index', {
					error: err
				});
				return;
			}

			if (row === undefined) {
				res.render('index', {
					error: "Sorry, but that user doesn't exist"
				});
				return;
			}

			if (bcrypt.compare(password, row.password)) {
				res.cookie(
					'token',
					jwt.sign(
						{ username: row.username, email: row.email },
						config.secret
					),
					{
						domain: `.${config.domain}`
					}
				);

				res.redirect('/');
				return;
			}
		}
	);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
