require("dotenv").config();

const requiredEnvVariables = [
    "MONGO_URI",
    "JWT_SECRET",
];

for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
        throw new Error(`Missing required environment variable: ${variable}`);
    }
}

module.exports = {
    nodeEnv: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5001,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};