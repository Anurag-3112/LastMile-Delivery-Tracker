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
    FiRefreshCw,
    FiSearch,
    FiTruck,
    FiXCircle,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router-dom";

import {
    getAssignedOrders,
} from "../../api/agent.api";

const STATUS_OPTIONS = [
    {
        value: "ALL",
        label: "All Orders",
    },
    {
        value: "ASSIGNED",
        label: "Assigned",
    },
    {
        value: "PICKED_UP",
        label: "Picked Up",
    },
    {
        value: "IN_TRANSIT",
        label: "In Transit",
    },
    {
        value: "OUT_FOR_DELIVERY",
        label: "Out for Delivery",
    },
    {
        value: "DELIVERED",
        label: "Delivered",
    },
    {
        value: "FAILED",
        label: "Failed",
    },
];

const STATUS_LABELS = {
    CREATED: "Created",
    ASSIGNED: "Assigned",
    PICKED_UP: "Picked Up",
    IN_TRANSIT: "In Transit",
    OUT_FOR_DELIVERY:
        "Out for Delivery",
    DELIVERED: "Delivered",
    FAILED: "Failed",
};

const AgentOrders = () => {
    const navigate =
        useNavigate();

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const loadOrders =
        async (
            showLoader = true
        ) => {
            try {
                setError("");

                if (showLoader) {
                    setLoading(true);
                }

                const result =
                    await getAssignedOrders();

                setOrders(
                    result.data
                        ?.orders || []
                );
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load assigned orders."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

    useEffect(() => {
        loadOrders();
    }, []);

    const filteredOrders =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return orders.filter(
                (order) => {
                    const matchesStatus =
                        statusFilter ===
                        "ALL" ||
                        order.status ===
                        statusFilter;

                    if (
                        !matchesStatus
                    ) {
                        return false;
                    }

                    if (
                        !normalizedSearch
                    ) {
                        return true;
                    }

                    const orderNumber =
                        String(
                            order.orderNumber ||
                            ""
                        ).toLowerCase();

                    const pickup =
                        String(
                            order.pickup
                                ?.address ||
                            ""
                        ).toLowerCase();

                    const drop =
                        String(
                            order.drop
                                ?.address ||
                            ""
                        ).toLowerCase();

                    return (
                        orderNumber.includes(
                            normalizedSearch
                        ) ||
                        pickup.includes(
                            normalizedSearch
                        ) ||
                        drop.includes(
                            normalizedSearch
                        )
                    );
                }
            );
        }, [
            orders,
            search,
            statusFilter,
        ]);

    const counts =
        useMemo(() => {
            return {
                all: orders.length,

                assigned:
                    orders.filter(
                        (order) =>
                            order.status ===
                            "ASSIGNED"
                    ).length,

                inProgress:
                    orders.filter(
                        (order) =>
                            [
                                "PICKED_UP",
                                "IN_TRANSIT",
                                "OUT_FOR_DELIVERY",
                            ].includes(
                                order.status
                            )
                    ).length,

                delivered:
                    orders.filter(
                        (order) =>
                            order.status ===
                            "DELIVERED"
                    ).length,

                failed:
                    orders.filter(
                        (order) =>
                            order.status ===
                            "FAILED"
                    ).length,
            };
        }, [orders]);

    const handleRefresh =
        async () => {
            setRefreshing(true);

            await loadOrders(false);
        };

    const getStatusIcon =
        (status) => {
            switch (status) {
                case "DELIVERED":
                    return (
                        <FiCheckCircle
                            size={17}
                        />
                    );

                case "FAILED":
                    return (
                        <FiXCircle
                            size={17}
                        />
                    );

                case "OUT_FOR_DELIVERY":
                    return (
                        <FiTruck
                            size={17}
                        />
                    );

                case "IN_TRANSIT":
                    return (
                        <FiTruck
                            size={17}
                        />
                    );

                default:
                    return (
                        <FiClock
                            size={17}
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

                Loading assigned orders...
            </div>
        );
    }

    return (
        <div className="agent-orders-page">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-eyebrow">
                        Delivery Operations
                    </div>

                    <h1 className="page-title">
                        Assigned Orders
                    </h1>

                    <p className="page-description">
                        View and manage all
                        shipments currently
                        assigned to you.
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

            {/* Error */}

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Summary */}

            <div className="orders-summary-grid">
                <SummaryCard
                    label="Total"
                    value={
                        counts.all
                    }
                    icon={
                        <FiPackage
                            size={18}
                        />
                    }
                    iconClass="stat-card-icon-blue"
                />

                <SummaryCard
                    label="Assigned"
                    value={
                        counts.assigned
                    }
                    icon={
                        <FiClock
                            size={18}
                        />
                    }
                    iconClass="stat-card-icon-orange"
                />

                <SummaryCard
                    label="In Progress"
                    value={
                        counts.inProgress
                    }
                    icon={
                        <FiTruck
                            size={18}
                        />
                    }
                    iconClass="stat-card-icon-orange"
                />

                <SummaryCard
                    label="Delivered"
                    value={
                        counts.delivered
                    }
                    icon={
                        <FiCheckCircle
                            size={18}
                        />
                    }
                    iconClass="stat-card-icon-green"
                />
            </div>

            {/* Filters */}

            <section className="orders-toolbar">
                <div className="orders-search">
                    <FiSearch
                        size={17}
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search by order number or address..."
                    />
                </div>

                <div className="orders-filter">
                    <select
                        className="ui-select"
                        value={
                            statusFilter
                        }
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >
                        {STATUS_OPTIONS.map(
                            (option) => (
                                <option
                                    key={
                                        option.value
                                    }
                                    value={
                                        option.value
                                    }
                                >
                                    {
                                        option.label
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>
            </section>

            {/* Results */}

            <section className="orders-list-section">
                <div className="section-header">
                    <div>
                        <h2 className="section-title">
                            Shipments
                        </h2>

                        <p className="section-description">
                            Showing{" "}
                            {
                                filteredOrders.length
                            }{" "}
                            of{" "}
                            {
                                orders.length
                            }{" "}
                            orders
                        </p>
                    </div>
                </div>

                {filteredOrders.length ===
                    0 ? (
                    <div className="empty-state-card">
                        <div className="empty-state-icon">
                            <FiPackage
                                size={25}
                            />
                        </div>

                        <h3>
                            {orders.length ===
                                0
                                ? "No orders assigned"
                                : "No matching orders"}
                        </h3>

                        <p>
                            {orders.length ===
                                0
                                ? "You don't have any delivery assignments right now."
                                : "Try changing your search or status filter."}
                        </p>

                        {orders.length >
                            0 && (
                                <button
                                    className="ui-button ui-button-secondary ui-button-md"
                                    onClick={() => {
                                        setSearch(
                                            ""
                                        );

                                        setStatusFilter(
                                            "ALL"
                                        );
                                    }}
                                >
                                    Clear Filters
                                </button>
                            )}
                    </div>
                ) : (
                    <div className="agent-orders-list">
                        {filteredOrders.map(
                            (
                                order
                            ) => (
                                <article
                                    className="agent-order-list-card"
                                    key={
                                        order._id
                                    }
                                >
                                    <div className="agent-order-list-main">
                                        <div className="agent-order-list-header">
                                            <div className="agent-order-title">
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
                                                {STATUS_LABELS[
                                                    order
                                                        .status
                                                ] ||
                                                    order.status}
                                            </span>
                                        </div>

                                        <div className="agent-order-list-route">
                                            <RouteAddress
                                                label="Pickup"
                                                address={
                                                    order
                                                        .pickup
                                                        ?.address
                                                }
                                                area={
                                                    order
                                                        .pickup
                                                        ?.areaId
                                                        ?.name
                                                }
                                            />

                                            <div className="route-arrow">
                                                <FiArrowRight
                                                    size={
                                                        17
                                                    }
                                                />
                                            </div>

                                            <RouteAddress
                                                label="Delivery"
                                                address={
                                                    order
                                                        .drop
                                                        ?.address
                                                }
                                                area={
                                                    order
                                                        .drop
                                                        ?.areaId
                                                        ?.name
                                                }
                                            />
                                        </div>

                                        <div className="agent-order-list-meta">
                                            <MetaItem
                                                label="Package"
                                                value={
                                                    order
                                                        .package
                                                        ?.billableWeight
                                                        ? `${order.package.billableWeight} kg`
                                                        : "—"
                                                }
                                            />

                                            <MetaItem
                                                label="Payment"
                                                value={
                                                    order.paymentType ===
                                                        "COD"
                                                        ? "COD"
                                                        : "Prepaid"
                                                }
                                            />

                                            <MetaItem
                                                label="Charge"
                                                value={`₹${Number(
                                                    order
                                                        .pricing
                                                        ?.totalCharge ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="agent-order-list-action">
                                        <button
                                            className="ui-button ui-button-secondary ui-button-md"
                                            onClick={() =>
                                                navigate(
                                                    `/agent/orders/${order._id}`
                                                )
                                            }
                                        >
                                            View Details

                                            <FiArrowRight
                                                size={
                                                    15
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

const SummaryCard = ({
    label,
    value,
    icon,
    iconClass,
}) => {
    return (
        <div className="stat-card">
            <div className="stat-card-top">
                <span className="stat-card-label">
                    {label}
                </span>

                <div
                    className={`stat-card-icon ${iconClass}`}
                >
                    {icon}
                </div>
            </div>

            <div className="stat-card-value">
                {value}
            </div>
        </div>
    );
};

const RouteAddress = ({
    label,
    address,
    area,
}) => {
    return (
        <div className="route-address">
            <span>
                {label}
            </span>

            <div>
                <FiMapPin
                    size={15}
                />

                <div>
                    <strong>
                        {area ||
                            "Area unavailable"}
                    </strong>

                    <p>
                        {address ||
                            "Address unavailable"}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MetaItem = ({
    label,
    value,
}) => {
    return (
        <div className="agent-meta-item">
            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>
        </div>
    );
};

export default AgentOrders;