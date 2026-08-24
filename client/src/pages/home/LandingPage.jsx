import {
    FiArrowRight,
    FiCheckCircle,
    FiClipboard,
    FiMapPin,
    FiPackage,
    FiShield,
    FiTruck,
    FiUsers,
} from "react-icons/fi";

import {
    Link,
} from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="landing-page">

            {/* ================================
                HEADER
            ================================= */}

            <header className="landing-header">

                <div className="landing-container landing-header-inner">

                    <Link
                        to="/"
                        className="landing-logo"
                    >
                        <div className="landing-logo-mark">
                            <FiTruck size={19} />
                        </div>

                        <div>
                            <div className="landing-logo-name">
                                LastMile
                            </div>

                            <div className="landing-logo-subtitle">
                                Delivery Platform
                            </div>
                        </div>
                    </Link>

                    <nav className="landing-nav">

                        <a href="#features">
                            Features
                        </a>

                        <a href="#how-it-works">
                            How it works
                        </a>

                        <a href="#roles">
                            Platform
                        </a>

                    </nav>

                    <div className="landing-header-actions">

                        <Link
                            to="/login"
                            className="landing-login-link"
                        >
                            Sign In
                        </Link>

                        <Link
                            to="/register"
                            className="landing-header-button"
                        >
                            Get Started
                        </Link>

                    </div>

                </div>

            </header>

            {/* ================================
                HERO
            ================================= */}

            <main>

                <section className="landing-hero">

                    <div className="landing-container landing-hero-grid">

                        <div className="landing-hero-content">

                            <div className="landing-eyebrow">
                                <span className="landing-eyebrow-dot" />

                                Last-mile delivery management
                            </div>

                            <h1>
                                Deliver better.
                                <br />

                                <span>
                                    Manage smarter.
                                </span>
                            </h1>

                            <p className="landing-hero-description">
                                A unified platform for creating
                                deliveries, managing shipments,
                                tracking orders and coordinating
                                last-mile operations.
                            </p>

                            <div className="landing-hero-actions">

                                <Link
                                    to="/register"
                                    className="landing-primary-button"
                                >
                                    Get Started

                                    <FiArrowRight
                                        size={17}
                                    />
                                </Link>

                                <a
                                    href="#how-it-works"
                                    className="landing-secondary-button"
                                >
                                    See how it works
                                </a>

                            </div>

                            <div className="landing-trust-row">

                                <div>
                                    <FiCheckCircle
                                        size={15}
                                    />

                                    Real-time tracking
                                </div>

                                <div>
                                    <FiCheckCircle
                                        size={15}
                                    />

                                    Role-based operations
                                </div>

                                <div>
                                    <FiCheckCircle
                                        size={15}
                                    />

                                    Centralized management
                                </div>

                            </div>

                        </div>

                        {/* Hero visual */}

                        <div className="landing-hero-visual">

                            <div className="hero-dashboard-card">

                                <div className="hero-dashboard-header">

                                    <div>
                                        <span>
                                            Delivery Overview
                                        </span>

                                        <strong>
                                            Today's activity
                                        </strong>
                                    </div>

                                    <div className="hero-status-dot">
                                        ●
                                    </div>

                                </div>

                                <div className="hero-stats">

                                    <div>
                                        <span>
                                            Active
                                        </span>

                                        <strong>
                                            12
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Delivered
                                        </span>

                                        <strong>
                                            38
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Pending
                                        </span>

                                        <strong>
                                            7
                                        </strong>
                                    </div>

                                </div>

                                <div className="hero-route-card">

                                    <div className="hero-route-header">

                                        <span>
                                            Current delivery
                                        </span>

                                        <span className="hero-route-status">
                                            In Transit
                                        </span>

                                    </div>

                                    <div className="hero-route">

                                        <div className="hero-location">

                                            <div className="hero-location-icon">
                                                <FiMapPin
                                                    size={15}
                                                />
                                            </div>

                                            <div>
                                                <small>
                                                    Pickup
                                                </small>

                                                <strong>
                                                    Bhopal
                                                </strong>
                                            </div>

                                        </div>

                                        <div className="hero-route-line">
                                            <span />
                                            <span />
                                            <span />
                                        </div>

                                        <div className="hero-location">

                                            <div className="hero-location-icon destination">
                                                <FiMapPin
                                                    size={15}
                                                />
                                            </div>

                                            <div>
                                                <small>
                                                    Destination
                                                </small>

                                                <strong>
                                                    Indore
                                                </strong>
                                            </div>

                                        </div>

                                    </div>

                                </div>

                                <div className="hero-progress">

                                    <div className="hero-progress-label">
                                        <span>
                                            Delivery progress
                                        </span>

                                        <strong>
                                            68%
                                        </strong>
                                    </div>

                                    <div className="hero-progress-bar">
                                        <div />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================================
                    FEATURES
                ================================= */}

                <section
                    id="features"
                    className="landing-section"
                >

                    <div className="landing-container">

                        <div className="landing-section-heading">

                            <span>
                                PLATFORM
                            </span>

                            <h2>
                                Everything you need
                                to manage delivery
                                operations.
                            </h2>

                            <p>
                                LastMile brings the core
                                delivery workflow together
                                in one place.
                            </p>

                        </div>

                        <div className="landing-feature-grid">

                            <div className="landing-feature-card">

                                <div className="landing-feature-icon">
                                    <FiPackage />
                                </div>

                                <h3>
                                    Shipment Management
                                </h3>

                                <p>
                                    Create and manage
                                    delivery orders from
                                    a centralized workspace.
                                </p>

                            </div>

                            <div className="landing-feature-card">

                                <div className="landing-feature-icon">
                                    <FiMapPin />
                                </div>

                                <h3>
                                    Delivery Tracking
                                </h3>

                                <p>
                                    Follow delivery progress
                                    and view the complete
                                    status history of an order.
                                </p>

                            </div>

                            <div className="landing-feature-card">

                                <div className="landing-feature-icon">
                                    <FiTruck />
                                </div>

                                <h3>
                                    Agent Operations
                                </h3>

                                <p>
                                    Give delivery agents the
                                    tools they need to manage
                                    assigned deliveries.
                                </p>

                            </div>

                            <div className="landing-feature-card">

                                <div className="landing-feature-icon">
                                    <FiUsers />
                                </div>

                                <h3>
                                    Role-based Access
                                </h3>

                                <p>
                                    Separate workflows for
                                    customers, delivery agents
                                    and administrators.
                                </p>

                            </div>

                            <div className="landing-feature-card">

                                <div className="landing-feature-icon">
                                    <FiClipboard />
                                </div>

                                <h3>
                                    Operational Control
                                </h3>

                                <p>
                                    Manage orders, delivery
                                    agents, service areas
                                    and pricing.
                                </p>

                            </div>

                            <div className="landing-feature-card">

                                <div className="landing-feature-icon">
                                    <FiShield />
                                </div>

                                <h3>
                                    Secure Access
                                </h3>

                                <p>
                                    Authenticated, role-aware
                                    access keeps each workflow
                                    separated and controlled.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================================
                    HOW IT WORKS
                ================================= */}

                <section
                    id="how-it-works"
                    className="landing-section landing-section-muted"
                >

                    <div className="landing-container">

                        <div className="landing-section-heading">

                            <span>
                                HOW IT WORKS
                            </span>

                            <h2>
                                From order creation
                                to successful delivery.
                            </h2>

                        </div>

                        <div className="landing-steps">

                            <div className="landing-step">

                                <div className="landing-step-number">
                                    01
                                </div>

                                <h3>
                                    Create an order
                                </h3>

                                <p>
                                    Enter pickup and
                                    delivery information
                                    and create a shipment.
                                </p>

                            </div>

                            <div className="landing-step">

                                <div className="landing-step-number">
                                    02
                                </div>

                                <h3>
                                    Assign & dispatch
                                </h3>

                                <p>
                                    Delivery operations
                                    coordinate the order
                                    and assigned agent.
                                </p>

                            </div>

                            <div className="landing-step">

                                <div className="landing-step-number">
                                    03
                                </div>

                                <h3>
                                    Track delivery
                                </h3>

                                <p>
                                    Monitor the order's
                                    progress through
                                    its delivery lifecycle.
                                </p>

                            </div>

                            <div className="landing-step">

                                <div className="landing-step-number">
                                    04
                                </div>

                                <h3>
                                    Complete delivery
                                </h3>

                                <p>
                                    Mark successful delivery
                                    or handle exceptions such
                                    as failed delivery.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================================
                    ROLES
                ================================= */}

                <section
                    id="roles"
                    className="landing-section"
                >

                    <div className="landing-container">

                        <div className="landing-section-heading">

                            <span>
                                ONE PLATFORM
                            </span>

                            <h2>
                                Designed around
                                every delivery role.
                            </h2>

                        </div>

                        <div className="landing-role-grid">

                            <div className="landing-role-card">

                                <div className="landing-role-icon">
                                    <FiPackage />
                                </div>

                                <span>
                                    CUSTOMER
                                </span>

                                <h3>
                                    Send and track
                                    deliveries.
                                </h3>

                                <p>
                                    Create orders, view
                                    delivery progress and
                                    manage your shipments
                                    from one account.
                                </p>

                            </div>

                            <div className="landing-role-card">

                                <div className="landing-role-icon">
                                    <FiTruck />
                                </div>

                                <span>
                                    DELIVERY AGENT
                                </span>

                                <h3>
                                    Manage deliveries
                                    on the move.
                                </h3>

                                <p>
                                    Access assigned orders,
                                    update delivery status
                                    and complete delivery
                                    workflows.
                                </p>

                            </div>

                            <div className="landing-role-card">

                                <div className="landing-role-icon">
                                    <FiUsers />
                                </div>

                                <span>
                                    ADMINISTRATOR
                                </span>

                                <h3>
                                    Control the operation.
                                </h3>

                                <p>
                                    Manage orders, agents,
                                    service zones, areas
                                    and rate configuration.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

                {/* ================================
                    CTA
                ================================= */}

                <section className="landing-cta">

                    <div className="landing-container">

                        <div className="landing-cta-card">

                            <div>

                                <span>
                                    READY TO GET STARTED?
                                </span>

                                <h2>
                                    Manage your last-mile
                                    operations better.
                                </h2>

                                <p>
                                    Sign in to access the
                                    LastMile delivery platform.
                                </p>

                            </div>

                            <Link
                                to="/login"
                                className="landing-cta-button"
                            >
                                Sign In

                                <FiArrowRight
                                    size={17}
                                />
                            </Link>

                        </div>

                    </div>

                </section>

            </main>

            {/* ================================
                FOOTER
            ================================= */}

            <footer className="landing-footer">

                <div className="landing-container landing-footer-inner">

                    <div className="landing-footer-brand">

                        <div className="landing-logo-mark">
                            <FiTruck size={17} />
                        </div>

                        <div>
                            <strong>
                                LastMile
                            </strong>

                            <span>
                                Delivery Platform
                            </span>
                        </div>

                    </div>

                    <div className="landing-footer-copy">
                        © 2026 LastMile. All rights reserved.
                    </div>

                </div>

            </footer>

        </div>
    );
};

export default LandingPage;