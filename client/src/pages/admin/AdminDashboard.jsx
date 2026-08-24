import {
    useEffect,
    useState,
} from "react";

import {
    FiActivity,
    FiAlertCircle,
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiPackage,
    FiTruck,
    FiUsers,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router-dom";

import {
    getAdminDashboard,
} from "../../api/admin.api";

const AdminDashboard = () => {
    const navigate =
        useNavigate();

    const [
        dashboard,
        setDashboard,
    ] = useState(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {
        const loadDashboard =
            async () => {
                try {
                    setLoading(true);
                    setError("");

                    const result =
                        await getAdminDashboard();

                    setDashboard(
                        result.data
                    );
                } catch (error) {
                    setError(
                        error.response?.data
                            ?.message ||
                        "Unable to load dashboard"
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">
                            Admin Dashboard
                        </h1>

                        <p className="page-description">
                            Loading your
                            operations overview...
                        </p>
                    </div>
                </div>

                <div className="dashboard-loading-grid">
                    <div className="dashboard-skeleton" />
                    <div className="dashboard-skeleton" />
                    <div className="dashboard-skeleton" />
                    <div className="dashboard-skeleton" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">
                            Admin Dashboard
                        </h1>

                        <p className="page-description">
                            Monitor your delivery
                            operations.
                        </p>
                    </div>
                </div>

                <div className="dashboard-error">
                    <div className="dashboard-error-icon">
                        <FiAlertCircle
                            size={22}
                        />
                    </div>

                    <div>
                        <h3>
                            Unable to load
                            dashboard
                        </h3>

                        <p>
                            {error}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const orders =
        dashboard?.orders || {};

    const agents =
        dashboard?.agents || {};

    const totalOrders =
        orders.total || 0;

    const delivered =
        orders.delivered || 0;

    const failed =
        orders.failed || 0;

    const inTransit =
        orders.inTransit || 0;

    const created =
        orders.created || 0;

    const assigned =
        orders.assigned || 0;

    const pickedUp =
        orders.pickedUp || 0;

    const outForDelivery =
        orders.outForDelivery || 0;

    return (
        <div className="admin-dashboard">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-eyebrow">
                        <FiActivity
                            size={14}
                        />

                        Operations Overview
                    </div>

                    <h1 className="page-title">
                        Admin Dashboard
                    </h1>

                    <p className="page-description">
                        Monitor orders, agents,
                        deliveries, and overall
                        operational activity.
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="ui-button ui-button-primary ui-button-md"
                        onClick={() =>
                            navigate(
                                "/admin/orders"
                            )
                        }
                    >
                        <FiPackage
                            size={16}
                        />

                        Manage Orders
                    </button>
                </div>
            </div>

            {/* Primary Stats */}

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
                        All orders in the
                        system
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            In Transit
                        </span>

                        <div className="stat-card-icon stat-card-icon-orange">
                            <FiTruck
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {inTransit}
                    </div>

                    <div className="stat-card-description">
                        Currently moving
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
                        {delivered}
                    </div>

                    <div className="stat-card-description">
                        Successfully
                        delivered
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Failed
                        </span>

                        <div className="stat-card-icon stat-card-icon-red">
                            <FiAlertCircle
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {failed}
                    </div>

                    <div className="stat-card-description">
                        Require attention
                    </div>
                </div>
            </div>

            {/* Operational Overview */}

            <div className="admin-dashboard-grid">
                <section className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h2 className="section-title">
                                Order Activity
                            </h2>

                            <p className="section-description">
                                Current order
                                lifecycle
                            </p>
                        </div>

                        <FiActivity
                            size={19}
                        />
                    </div>

                    <div className="order-activity-list">
                        <div className="activity-row">
                            <div className="activity-row-left">
                                <span className="activity-dot activity-dot-blue" />

                                <span>
                                    Created
                                </span>
                            </div>

                            <strong>
                                {created}
                            </strong>
                        </div>

                        <div className="activity-row">
                            <div className="activity-row-left">
                                <span className="activity-dot activity-dot-purple" />

                                <span>
                                    Assigned
                                </span>
                            </div>

                            <strong>
                                {assigned}
                            </strong>
                        </div>

                        <div className="activity-row">
                            <div className="activity-row-left">
                                <span className="activity-dot activity-dot-orange" />

                                <span>
                                    Picked Up
                                </span>
                            </div>

                            <strong>
                                {pickedUp}
                            </strong>
                        </div>

                        <div className="activity-row">
                            <div className="activity-row-left">
                                <span className="activity-dot activity-dot-yellow" />

                                <span>
                                    Out for
                                    Delivery
                                </span>
                            </div>

                            <strong>
                                {outForDelivery}
                            </strong>
                        </div>

                        <div className="activity-row">
                            <div className="activity-row-left">
                                <span className="activity-dot activity-dot-green" />

                                <span>
                                    Delivered
                                </span>
                            </div>

                            <strong>
                                {delivered}
                            </strong>
                        </div>

                        <div className="activity-row">
                            <div className="activity-row-left">
                                <span className="activity-dot activity-dot-red" />

                                <span>
                                    Failed
                                </span>
                            </div>

                            <strong>
                                {failed}
                            </strong>
                        </div>
                    </div>
                </section>

                {/* Agent Overview */}

                <section className="dashboard-panel">
                    <div className="dashboard-panel-header">
                        <div>
                            <h2 className="section-title">
                                Agent Availability
                            </h2>

                            <p className="section-description">
                                Current workforce
                                status
                            </p>
                        </div>

                        <FiUsers
                            size={19}
                        />
                    </div>

                    <div className="agent-overview">
                        <div className="agent-overview-item">
                            <div className="agent-overview-icon agent-overview-icon-green">
                                <FiCheckCircle
                                    size={18}
                                />
                            </div>

                            <div>
                                <span>
                                    Available
                                </span>

                                <strong>
                                    {
                                        agents.available ||
                                        0
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="agent-overview-item">
                            <div className="agent-overview-icon agent-overview-icon-orange">
                                <FiTruck
                                    size={18}
                                />
                            </div>

                            <div>
                                <span>
                                    Busy
                                </span>

                                <strong>
                                    {
                                        agents.busy ||
                                        0
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="agent-overview-item">
                            <div className="agent-overview-icon agent-overview-icon-gray">
                                <FiClock
                                    size={18}
                                />
                            </div>

                            <div>
                                <span>
                                    Offline
                                </span>

                                <strong>
                                    {
                                        agents.offline ||
                                        0
                                    }
                                </strong>
                            </div>
                        </div>
                    </div>

                    <button
                        className="dashboard-panel-link"
                        onClick={() =>
                            navigate(
                                "/admin/agents"
                            )
                        }
                    >
                        Manage Agents

                        <FiArrowRight
                            size={15}
                        />
                    </button>
                </section>
            </div>

            {/* Quick Actions */}

            <section className="dashboard-panel">
                <div className="dashboard-panel-header">
                    <div>
                        <h2 className="section-title">
                            Quick Actions
                        </h2>

                        <p className="section-description">
                            Frequently used
                            administration tools
                        </p>
                    </div>
                </div>

                <div className="quick-actions-grid">
                    <button
                        className="quick-action-card"
                        onClick={() =>
                            navigate(
                                "/admin/orders"
                            )
                        }
                    >
                        <div className="quick-action-icon">
                            <FiPackage
                                size={19}
                            />
                        </div>

                        <div>
                            <strong>
                                Orders
                            </strong>

                            <span>
                                View and manage
                                all orders
                            </span>
                        </div>

                        <FiArrowRight
                            size={16}
                        />
                    </button>

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            navigate(
                                "/admin/agents"
                            )
                        }
                    >
                        <div className="quick-action-icon">
                            <FiUsers
                                size={19}
                            />
                        </div>

                        <div>
                            <strong>
                                Agents
                            </strong>

                            <span>
                                Manage delivery
                                agents
                            </span>
                        </div>

                        <FiArrowRight
                            size={16}
                        />
                    </button>

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            navigate(
                                "/admin/zones"
                            )
                        }
                    >
                        <div className="quick-action-icon">
                            <FiActivity
                                size={19}
                            />
                        </div>

                        <div>
                            <strong>
                                Zones
                            </strong>

                            <span>
                                Configure delivery
                                zones
                            </span>
                        </div>

                        <FiArrowRight
                            size={16}
                        />
                    </button>

                    <button
                        className="quick-action-card"
                        onClick={() =>
                            navigate(
                                "/admin/rate-cards"
                            )
                        }
                    >
                        <div className="quick-action-icon">
                            <FiTruck
                                size={19}
                            />
                        </div>

                        <div>
                            <strong>
                                Rate Cards
                            </strong>

                            <span>
                                Configure delivery
                                pricing
                            </span>
                        </div>

                        <FiArrowRight
                            size={16}
                        />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;