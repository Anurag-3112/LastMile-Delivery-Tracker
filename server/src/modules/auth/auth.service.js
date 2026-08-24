const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const {
    jwtSecret,
    jwtExpiresIn,
} = require("../../config/env");

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        jwtSecret,
        {
            expiresIn: jwtExpiresIn,
        }
    );
};

const registerCustomer = async ({
    name,
    email,
    phone,
    password,
}) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("An account with this email already exists");
        error.statusCode = 409;
        error.code = "EMAIL_ALREADY_EXISTS";
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email,
        phone,
        passwordHash,
        role: "CUSTOMER",
    });

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
    };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email });

    if (!user || !user.isActive) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
    };
};

module.exports = {
    registerCustomer,
    login,
};