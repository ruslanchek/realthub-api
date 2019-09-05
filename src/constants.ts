export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: '30d',
};

export const authConstants = {
  passwordResetExpires: 1000 * 60 * 5,
};
