const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);

function hashPassword(password) {
	return bcrypt.hashSync(password, salt);
}

module.exports = { hashPassword };
