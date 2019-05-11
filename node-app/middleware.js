function authMiddleware(req, res, next) {
	const { token } = req.cookies;
	if (!token) {
		res.redirect('/login');
		return;
	}
	next();
}

module.exports = { authMiddleware };
