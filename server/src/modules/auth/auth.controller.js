const authService = require("./auth.service");

const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        data: {
            user: req.user,
        },
    });
};

const register = async (req, res, next) => {
    try {
        const result = await authService.registerCustomer(req.body);

        return res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
};