const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return User.insert({
      email,
      passwordHash,
    });
  }

  static async logIn({ email, password }) {
    const user = await User.findByEmail(email);
    if (!user) throw new Error('invalid email/password');

    const passwordsMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordsMatch) throw new Error('invalid email/password');

    return user;
  }
};
