import {
    useState,
} from "react";

import {
    FiLock,
    FiMail,
    FiPhone,
    FiTruck,
    FiUser,
} from "react-icons/fi";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    registerUser,
} from "../../api/auth.api";

const Register = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (
            form.password !==
            form.confirmPassword
        ) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        setLoading(true);

        try {
            await registerUser({
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
            });

            navigate("/login", {
                state: {
                    message:
                        "Account created successfully. Please sign in.",
                },
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to create account."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                {/* Brand */}
                <div className="login-brand">

                    <div className="login-brand-mark">
                        <FiTruck size={21} />
                    </div>

                    <div>
                        <div className="login-brand-name">
                            LastMile
                        </div>

                        <div className="login-brand-subtitle">
                            Delivery Platform
                        </div>
                    </div>

                </div>

                {/* Heading */}
                <div className="login-heading">

                    <h1>
                        Create your account
                    </h1>

                    <p>
                        Create a customer account
                        to manage and track your
                        deliveries.
                    </p>

                </div>

                {/* Form */}
                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    {/* Name */}
                    <div className="login-field">

                        <label htmlFor="name">
                            Full name
                        </label>

                        <div className="login-input-wrapper">

                            <FiUser size={17} />

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                                required
                            />

                        </div>

                    </div>

                    {/* Email */}
                    <div className="login-field">

                        <label htmlFor="email">
                            Email address
                        </label>

                        <div className="login-input-wrapper">

                            <FiMail size={17} />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />

                        </div>

                    </div>

                    {/* Phone */}
                    <div className="login-field">

                        <label htmlFor="phone">
                            Phone number
                        </label>

                        <div className="login-input-wrapper">

                            <FiPhone size={17} />

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={form.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                                required
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div className="login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="login-input-wrapper">

                            <FiLock size={17} />

                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Create a password"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />

                        </div>

                    </div>

                    {/* Confirm Password */}
                    <div className="login-field">

                        <label htmlFor="confirmPassword">
                            Confirm password
                        </label>

                        <div className="login-input-wrapper">

                            <FiLock size={17} />

                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={
                                    form.confirmPassword
                                }
                                onChange={handleChange}
                                autoComplete="new-password"
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
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Login link */}
                <div className="register-login-link">
                    Already have an account?{" "}

                    <Link to="/login">
                        Sign in
                    </Link>
                </div>

                <div className="login-footer">
                    Customer registration
                    only
                </div>

            </div>

        </div>
    );
};

export default Register;