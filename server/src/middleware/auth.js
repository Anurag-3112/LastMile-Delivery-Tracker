const jwt = require("jsonwebtoken");

const User = require("../models/User");
const {
    jwtSecret,
} = require("../config/env");

/*
 * Authenticate user from JWT
 */
const requireAuth =
    async (req, res, next) => {
        try {
            const authHeader =
                req.headers.authorization;

            if (
                !authHeader ||
                !authHeader.startsWith("Bearer ")
            ) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Authentication required",
                });
            }

            const token =
                authHeader.split(" ")[1];

            const decoded =
                jwt.verify(
                    token,
                    jwtSecret
                );

            const user =
                await User.findById(
                    decoded.userId
                ).select("-passwordHash");

            if (
                !user ||
                !user.isActive
            ) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Invalid authentication",
                });
            }

            req.user = user;

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid or expired token",
            });
        }
    };

/*
 * Require a specific user role
 */
const requireRole =
    (...allowedRoles) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message:
                        "Authentication required",
                });
            }

            if (
                !allowedRoles.includes(
                    req.user.role
                )
            ) {
                return res.status(403).json({
                    success: false,
                    message:
                        "Access denied",
                });
            }

            next();
        };
    };

module.exports = {
    requireAuth,
    requireRole,
};