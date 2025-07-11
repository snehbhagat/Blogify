const JWT = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function createTokenUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role,
    };
    // Set token expiry for better security
    return JWT.sign(payload, secret, { expiresIn: '1h' });
}

function validateToken(token){
    // This will throw an error if token is invalid or expired
    return JWT.verify(token, secret);
}

module.exports = {
    createTokenUser,
    validateToken,
};