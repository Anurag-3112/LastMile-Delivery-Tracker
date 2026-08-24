import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiPackage,
    FiPower,
    FiRefreshCw,
    FiTruck,
    FiXCircle,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router-dom";

import {
    getAgentProfile,
    getAssignedOrders,
    updateAvailability,
} from "../../api/agent.api";

const AgentDashboard = () => {
    const navigate =
        useNavigate();

    const [profile, setProfile] =
        useState(null);

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [updatingAvailability, setUpdatingAvailability] =
        useState(false);

    const [error, setError] =
        useState("");

    const loadData =
        async (
            showLoader = true
        ) => {
            try {
                setError("");

                if (showLoader) {
                    setLoading(true);
                }

                const [
                    profileResult,
                    ordersResult,
                ] = await Promise.all([
                    getAgentProfile(),
                    getAssignedOrders(),
                ]);

                setProfile(
                    profileResult.data
                        ?.profile
                );

                setOrders(
                    ordersResult.data
                        ?.orders || []
                );
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load agent dashboard"
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

    useEffect(() => {
        loadData();
    }, []);

    const assignedCount =
        orders.filter(
            (order) =>
                order.status ===
                "ASSIGNED"
        ).length;

    const inProgressCount =
        orders.filter(
            (order) =>
                [
                    "PICKED_UP",
                    "IN_TRANSIT",
                    "OUT_FOR_DELIVERY",
                ].includes(
                    order.status
                )
        ).length;

    const deliveredCount =
        orders.filter(
            (order) =>
                order.status ===
                "DELIVERED"
        ).length;

    const failedCount =
        orders.filter(
            (order) =>
                order.status ===
                "FAILED"
        ).length;

    const activeOrders =
        useMemo(
            () =>
                orders.filter(
                    (order) =>
                        ![
                            "DELIVERED",
                            "FAILED",
                        ].includes(
                            order.status
                        )
                ),
            [orders]
        );

    const toggleAvailability =
        async () => {
            if (!profile) {
                return;
            }

            const next =
                profile.availability ===
                    "AVAILABLE"
                    ? "OFFLINE"
                    : "AVAILABLE";

            try {
                setUpdatingAvailability(
                    true
                );

                setError("");

                const result =
                    await updateAvailability(
                        next
                    );

                setProfile(
                    result.data.profile
                );
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to update availability"
                );
            } finally {
                setUpdatingAvailability(
                    false
                );
            }
        };

    const handleRefresh =
        async () => {
            setRefreshing(true);

            await loadData(false);
        };

    const getStatusIcon =
        (status) => {
            switch (status) {
                case "DELIVERED":
                    return (
                        <FiCheckCircle
                            size={18}
                        />
                    );

                case "FAILED":
                    return (
                        <FiXCircle
                            size={18}
                        />
                    );

                case "OUT_FOR_DELIVERY":
                    return (
                        <FiTruck
                            size={18}
                        />
                    );

                default:
                    return (
                        <FiClock
                            size={18}
                        />
                    );
            }
        };

    const getStatusClass =
        (status) => {
            return `order-status-badge order-status-${String(
                status || ""
            ).toLowerCase()}`;
        };

    if (loading) {
        return (
            <div className="page-loading">
                <FiRefreshCw
                    size={18}
                    className="spin"
                />

                Loading your dashboard...
            </div>
        );
    }

    return (
        <div className="agent-dashboard">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-eyebrow">
                        Delivery Operations
                    </div>

                    <h1 className="page-title">
                        Agent Dashboard
                    </h1>

                    <p className="page-description">
                        Manage your delivery
                        assignments and update
                        shipment progress.
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="ui-button ui-button-secondary ui-button-md"
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            refreshing
                        }
                    >
                        <FiRefreshCw
                            size={16}
                            className={
                                refreshing
                                    ? "spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>
                </div>
            </div>

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Availability */}

            <section className="agent-availability-card">
                <div className="agent-availability-main">
                    <div
                        className={`agent-availability-icon ${profile?.availability ===
                                "AVAILABLE"
                                ? "available"
                                : "offline"
                            }`}
                    >
                        <FiPower
                            size={20}
                        />
                    </div>

                    <div>
                        <span className="agent-availability-label">
                            Your Availability
                        </span>

                        <div className="agent-availability-status">
                            <span
                                className={
                                    profile?.availability ===
                                        "AVAILABLE"
                                        ? "status-dot status-dot-success"
                                        : "status-dot status-dot-muted"
                                }
                            />

                            {profile?.availability ||
                                "OFFLINE"}
                        </div>

                        <p>
                            {profile?.availability ===
                                "AVAILABLE"
                                ? "You are available to receive delivery assignments."
                                : "You are currently unavailable for new assignments."}
                        </p>
                    </div>
                </div>

                <button
                    className={
                        profile?.availability ===
                            "AVAILABLE"
                            ? "ui-button ui-button-secondary ui-button-md"
                            : "ui-button ui-button-primary ui-button-md"
                    }
                    onClick={
                        toggleAvailability
                    }
                    disabled={
                        updatingAvailability
                    }
                >
                    {updatingAvailability ? (
                        <>
                            <FiRefreshCw
                                size={16}
                                className="spin"
                            />

                            Updating...
                        </>
                    ) : profile?.availability ===
                        "AVAILABLE" ? (
                        <>
                            <FiPower
                                size={16}
                            />

                            Go Offline
                        </>
                    ) : (
                        <>
                            <FiPower
                                size={16}
                            />

                            Go Available
                        </>
                    )}
                </button>
            </section>

            {/* Stats */}

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Assigned
                        </span>

                        <div className="stat-card-icon stat-card-icon-blue">
                            <FiPackage
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {assignedCount}
                    </div>

                    <div className="stat-card-description">
                        Waiting to be picked
                        up
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            In Progress
                        </span>

                        <div className="stat-card-icon stat-card-icon-orange">
                            <FiTruck
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {inProgressCount}
                    </div>

                    <div className="stat-card-description">
                        Active deliveries
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
                        {deliveredCount}
                    </div>

                    <div className="stat-card-description">
                        Successfully
                        completed
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Failed
                        </span>

                        <div className="stat-card-icon stat-card-icon-gray">
                            <FiXCircle
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {failedCount}
                    </div>

                    <div className="stat-card-description">
                        Failed delivery
                        attempts
                    </div>
                </div>
            </div>

            {/* Active Deliveries */}

            <section className="dashboard-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            Active Deliveries
                        </h2>

                        <p className="section-description">
                            Orders currently
                            assigned to you
                        </p>
                    </div>
                </div>

                {activeOrders.length ===
                    0 ? (
                    <div className="empty-state-card">
                        <div className="empty-state-icon">
                            <FiCheckCircle
                                size={25}
                            />
                        </div>

                        <h3>
                            No active deliveries
                        </h3>

                        <p>
                            You don't have any
                            active deliveries
                            right now.
                        </p>
                    </div>
                ) : (
                    <div className="agent-order-list">
                        {activeOrders.map(
                            (
                                order
                            ) => (
                                <article
                                    className="agent-order-card"
                                    key={
                                        order._id
                                    }
                                >
                                    <div className="agent-order-card-top">
                                        <div className="agent-order-main">
                                            <div className="agent-order-icon">
                                                {getStatusIcon(
                                                    order.status
                                                )}
                                            </div>

                                            <div>
                                                <h3>
                                                    {
                                                        order.orderNumber
                                                    }
                                                </h3>

                                                <span>
                                                    Shipment
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={getStatusClass(
                                                order.status
                                            )}
                                        >
                                            {
                                                order.status
                                            }
                                        </span>
                                    </div>

                                    <div className="agent-order-route">
                                        <div className="agent-route-item">
                                            <span>
                                                PICKUP
                                            </span>

                                            <div>
                                                <FiMapPin
                                                    size={
                                                        15
                                                    }
                                                />

                                                <p>
                                                    {
                                                        order
                                                            .pickup
                                                            ?.address
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="agent-route-connector">
                                            <span />
                                        </div>

                                        <div className="agent-route-item">
                                            <span>
                                                DELIVERY
                                            </span>

                                            <div>
                                                <FiMapPin
                                                    size={
                                                        15
                                                    }
                                                />

                                                <p>
                                                    {
                                                        order
                                                            .drop
                                                            ?.address
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="agent-order-footer">
                                        <div className="agent-order-meta">
                                            <span>
                                                Package
                                            </span>

                                            <strong>
                                                {
                                                    order
                                                        .package
                                                        ?.billableWeight
                                                }{" "}
                                                kg
                                            </strong>
                                        </div>

                                        <button
                                            className="ui-button ui-button-secondary ui-button-sm"
                                            onClick={() =>
                                                navigate(
                                                    `/agent/orders/${order._id}`
                                                )
                                            }
                                        >
                                            View Order

                                            <FiArrowRight
                                                size={
                                                    14
                                                }
                                            />
                                        </button>
                                    </div>
                                </article>
                            )
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AgentDashboard;