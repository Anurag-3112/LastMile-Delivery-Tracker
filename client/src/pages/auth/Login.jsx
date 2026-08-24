import {
    useState,
} from "react";

import {
    FiLock,
    FiMail,
    FiTruck,
} from "react-icons/fi";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    loginUser,
} from "../../api/auth.api";

import {
    useAuth,
} from "../../context/AuthContext";

const Login = () => {
    const navigate =
        useNavigate();

    const { login } =
        useAuth();

    const [form, setForm] =
        useState({
            email: "",
            password: "",
        });

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const handleChange = (
        e
    ) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            setError("");
            setLoading(true);

            try {
                const result =
                    await loginUser(
                        form
                    );

                login({
                    token:
                        result.data
                            .token,

                    user:
                        result.data
                            .user,
                });

                const role =
                    result.data.user
                        .role;

                if (
                    role ===
                    "ADMIN"
                ) {
                    navigate(
                        "/admin"
                    );
                } else if (
                    role ===
                    "DELIVERY_AGENT"
                ) {
                    navigate(
                        "/agent"
                    );
                } else {
                    navigate(
                        "/customer"
                    );
                }
            } catch (
            error
            ) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Login failed. Please check your credentials."
                );
            } finally {
                setLoading(
                    false
                );
            }
        };

    return (
        <div className="login-page">

            <div className="login-card">

                {/* Brand */}
                <div className="login-brand">

                    <div className="login-brand-mark">
                        <FiTruck
                            size={21}
                        />
                    </div>

                    <div>
                        <div className="login-brand-name">
                            LastMile
                        </div>

                        <div className="login-brand-subtitle">
                            Logistics Platform
                        </div>
                    </div>

                </div>

                {/* Heading */}
                <div className="login-heading">

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Sign in to manage
                        your deliveries
                        and shipments.
                    </p>

                </div>

                {/* Form */}
                <form
                    className="login-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* Email */}
                    <div className="login-field">

                        <label
                            htmlFor="email"
                        >
                            Email address
                        </label>

                        <div className="login-input-wrapper">

                            <FiMail
                                size={17}
                            />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="email"
                                required
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div className="login-field">

                        <label
                            htmlFor="password"
                        >
                            Password
                        </label>

                        <div className="login-input-wrapper">

                            <FiLock
                                size={17}
                            />

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                value={
                                    form.password
                                }
                                onChange={
                                    handleChange
                                }
                                autoComplete="current-password"
                                required
                            />

                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="login-submit"
                        disabled={
                            loading
                        }
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                {/* Register */}
                <div className="register-login-link">
                    Don't have an account?{" "}

                    <Link to="/register">
                        Create an account
                    </Link>
                </div>

                {/* Footer */}
                <div className="login-footer">
                    Secure logistics
                    management
                </div>

            </div>

        </div>
    );
};

export default Login;