import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiCheckCircle,
    FiPackage,
    FiPlus,
    FiTruck,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router-dom";

import {
    useAuth,
} from "../../context/AuthContext";

import {
    getMyOrders,
} from "../../api/order.api";

import StatusBadge from
    "../../components/ui/StatusBadge";

const CustomerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadOrders =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const result =
                        await getMyOrders();

                    setOrders(
                        result?.data?.orders ||
                        []
                    );
                } catch (error) {
                    setError(
                        "Unable to load your dashboard data."
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadOrders();
    }, []);

    const totalOrders =
        orders.length;

    const activeOrders =
        useMemo(() => {
            return orders.filter(
                (order) =>
                    [
                        "CREATED",
                        "ASSIGNED",
                        "PICKED_UP",
                        "IN_TRANSIT",
                        "OUT_FOR_DELIVERY",
                    ].includes(
                        order.status
                    )
            );
        }, [orders]);

    const deliveredOrders =
        useMemo(() => {
            return orders.filter(
                (order) =>
                    order.status ===
                    "DELIVERED"
            );
        }, [orders]);

    const currentDelivery =
        useMemo(() => {
            return activeOrders[0] || null;
        }, [activeOrders]);

    const recentOrders =
        useMemo(() => {
            return [...orders]
                .sort(
                    (a, b) =>
                        new Date(
                            b.createdAt || 0
                        ) -
                        new Date(
                            a.createdAt || 0
                        )
                )
                .slice(0, 4);
        }, [orders]);

    const formatDate = (
        date
    ) => {
        if (!date) {
            return "";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    if (loading) {
        return (
            <div className="customer-dashboard">
                <div className="page-header">
                    <div>
                        <div className="dashboard-skeleton-title" />
                        <div className="dashboard-skeleton-text" />
                    </div>
                </div>

                <div className="dashboard-stats">
                    {[1, 2, 3].map(
                        (item) => (
                            <div
                                className="stat-card dashboard-skeleton-card"
                                key={item}
                            >
                                <div className="dashboard-skeleton-line short" />
                                <div className="dashboard-skeleton-number" />
                                <div className="dashboard-skeleton-line" />
                            </div>
                        )
                    )}
                </div>

                <div className="dashboard-skeleton-panel" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="customer-dashboard">
                <div className="dashboard-error-card">
                    <div className="dashboard-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load dashboard
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="ui-button ui-button-primary ui-button-md"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="customer-dashboard">

            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">
                        Welcome back,{" "}
                        {user?.name ||
                            "Customer"}
                    </h1>

                    <p className="page-description">
                        Here's what's happening
                        with your deliveries.
                    </p>
                </div>

                <button
                    className="ui-button ui-button-primary ui-button-md"
                    onClick={() =>
                        navigate(
                            "/customer/orders/new"
                        )
                    }
                >
                    <FiPlus size={17} />

                    Create Shipment
                </button>
            </div>

            {/* Statistics */}
            <div className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Total Orders
                        </span>

                        <div className="stat-card-icon stat-card-icon-blue">
                            <FiPackage
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {totalOrders}
                    </div>

                    <div className="stat-card-description">
                        All orders
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Active Orders
                        </span>

                        <div className="stat-card-icon stat-card-icon-orange">
                            <FiTruck
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {
                            activeOrders.length
                        }
                    </div>

                    <div className="stat-card-description">
                        Currently in progress
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Delivered
                        </span>

                        <div className="stat-card-icon stat-card-icon-green">
                            <FiCheckCircle
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {
                            deliveredOrders.length
                        }
                    </div>

                    <div className="stat-card-description">
                        Successfully completed
                    </div>
                </div>

            </div>

            {/* Current Delivery */}
            {currentDelivery && (
                <section className="dashboard-section">

                    <div className="section-header">
                        <div>
                            <h2 className="section-title">
                                Current Delivery
                            </h2>

                            <p className="section-description">
                                Your shipment currently
                                in progress
                            </p>
                        </div>

                        <button
                            className="text-button"
                            onClick={() =>
                                navigate(
                                    `/customer/orders/${currentDelivery._id}`
                                )
                            }
                        >
                            View Tracking
                        </button>
                    </div>

                    <div className="current-delivery-card">

                        <div className="current-delivery-top">

                            <div>
                                <div className="order-number">
                                    {
                                        currentDelivery.orderNumber
                                    }
                                </div>

                                <div className="order-date">
                                    Created{" "}
                                    {formatDate(
                                        currentDelivery.createdAt
                                    )}
                                </div>
                            </div>

                            <StatusBadge
                                status={
                                    currentDelivery.status
                                }
                            />

                        </div>

                        <div className="delivery-route">

                            <div className="delivery-location">
                                <span className="delivery-location-label">
                                    Pickup
                                </span>

                                <strong>
                                    {
                                        currentDelivery
                                            .pickup
                                            ?.address ||
                                        "Pickup location"
                                    }
                                </strong>
                            </div>

                            <div className="delivery-route-line">
                                <div className="delivery-route-dot" />

                                <div className="delivery-route-arrow">
                                    →
                                </div>

                                <div className="delivery-route-dot" />
                            </div>

                            <div className="delivery-location delivery-location-right">
                                <span className="delivery-location-label">
                                    Drop
                                </span>

                                <strong>
                                    {
                                        currentDelivery
                                            .drop
                                            ?.address ||
                                        "Delivery location"
                                    }
                                </strong>
                            </div>

                        </div>

                        <div className="delivery-progress">

                            {[
                                "CREATED",
                                "ASSIGNED",
                                "PICKED_UP",
                                "IN_TRANSIT",
                                "OUT_FOR_DELIVERY",
                                "DELIVERED",
                            ].map(
                                (status, index, statuses) => {
                                    const currentIndex =
                                        statuses.indexOf(
                                            currentDelivery.status
                                        );

                                    const isCompleted =
                                        index <= currentIndex;

                                    const isCurrent =
                                        index === currentIndex;

                                    const labels = {
                                        CREATED: "Created",
                                        ASSIGNED: "Assigned",
                                        PICKED_UP: "Picked Up",
                                        IN_TRANSIT: "In Transit",
                                        OUT_FOR_DELIVERY:
                                            "Out for Delivery",
                                        DELIVERED: "Delivered",
                                    };

                                    return (
                                        <div
                                            className="progress-item"
                                            key={status}
                                        >
                                            <div
                                                className={`progress-step ${isCompleted
                                                        ? "completed"
                                                        : ""
                                                    } ${isCurrent
                                                        ? "current"
                                                        : ""
                                                    }`}
                                            >
                                                <span className="progress-dot">
                                                    {isCompleted
                                                        ? "✓"
                                                        : "○"}
                                                </span>

                                                <span>
                                                    {labels[status]}
                                                </span>
                                            </div>

                                            {index <
                                                statuses.length -
                                                1 && (
                                                    <div
                                                        className={`progress-line ${index <
                                                                currentIndex
                                                                ? "completed"
                                                                : ""
                                                            }`}
                                                    />
                                                )}
                                        </div>
                                    );
                                }
                            )}

                            {currentDelivery.status ===
                                "FAILED" && (
                                    <div className="progress-step failed">
                                        <span className="progress-dot">
                                            !
                                        </span>

                                        <span>
                                            Delivery Failed
                                        </span>
                                    </div>
                                )}
                        </div>

                        <div className="current-delivery-footer">

                            <div>
                                <span className="footer-label">
                                    Total charge
                                </span>

                                <strong>
                                    ₹
                                    {
                                        currentDelivery
                                            .pricing
                                            ?.totalCharge ??
                                        0
                                    }
                                </strong>
                            </div>

                            <button
                                className="ui-button ui-button-secondary ui-button-md"
                                onClick={() =>
                                    navigate(
                                        `/customer/orders/${currentDelivery._id}`
                                    )
                                }
                            >
                                View Details
                            </button>

                        </div>

                    </div>
                </section>
            )}

            {/* Recent Activity */}
            <section className="dashboard-section">

                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            Recent Activity
                        </h2>

                        <p className="section-description">
                            Your latest order activity
                        </p>
                    </div>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="dashboard-empty-card">

                        <div className="dashboard-empty-icon">
                            <FiPackage size={24} />
                        </div>

                        <h3>
                            No orders yet
                        </h3>

                        <p>
                            You haven't created any
                            orders yet.
                        </p>

                    </div>
                ) : (
                    <div className="activity-card">

                        {recentOrders.map(
                            (
                                order,
                                index
                            ) => (
                                <div
                                    className="activity-row"
                                    key={
                                        order._id
                                    }
                                >

                                    <div className="activity-icon">
                                        <FiPackage
                                            size={16}
                                        />
                                    </div>

                                    <div className="activity-content">

                                        <div className="activity-title">
                                            {
                                                order.orderNumber
                                            }
                                        </div>

                                        <div className="activity-meta">
                                            Order created{" "}
                                            {formatDate(
                                                order.createdAt
                                            )}
                                        </div>

                                    </div>

                                    <StatusBadge
                                        status={
                                            order.status
                                        }
                                    />

                                    <button
                                        className="activity-action"
                                        onClick={() =>
                                            navigate(
                                                `/customer/orders/${order._id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

        </div>
    );
};

export default CustomerDashboard;