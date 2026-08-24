require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");

const MONGO_URI =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI;

const EMAIL = "admin@lastmile.com";
const PASSWORD = "Admin@12345";

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected");

        const user = await User.findOne({
            email: EMAIL,
        });

        if (!user) {
            console.log("ADMIN USER NOT FOUND");
            process.exit(1);
        }

        console.log("Admin found:");
        console.log({
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            hasPasswordHash:
                Boolean(user.passwordHash),
        });

        const passwordMatches =
            await bcrypt.compare(
                PASSWORD,
                user.passwordHash
            );

        console.log(
            "Password matches:",
            passwordMatches
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "Check failed:",
            error
        );

        process.exit(1);
    }
};

run();
