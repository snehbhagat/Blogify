const { Schema, model } = require('mongoose');
const { createHmac, randomBytes } = require('crypto');

const usernameSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageUrl: {
        type: String,
        default: "/images/default.avif",
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, { timestamps: true });

// FIXED pre-save hook
usernameSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');

    user.salt = salt;
    user.password = hashedPassword;
    next();
});

//virtual method to compare passwords
usernameSchema.static('matchPassword' , async function(email , password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');
    if (hashedPassword !== userProvidedHash) {
        throw new Error('Invalid password');
    }
    return user;
})

const User = model('user', usernameSchema);
module.exports = User;
