import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiArrowRight,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiPackage,
    FiPlus,
    FiSearch,
    FiTruck,
    FiXCircle,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router-dom";

import {
    getMyOrders,
} from "../../api/order.api";

const MyOrders = () => {
    const navigate =
        useNavigate();

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    useEffect(() => {
        const loadOrders =
            async () => {
                try {
                    setError("");

                    const result =
                        await getMyOrders();

                    setOrders(
                        result.data
                            ?.orders || []
                    );
                } catch (error) {
                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load shipments"
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadOrders();
    }, []);

    const filteredOrders =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return orders.filter(
                (order) => {
                    const matchesSearch =
                        !query ||
                        order.orderNumber
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        order.pickup
                            ?.address
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        order.drop
                            ?.address
                            ?.toLowerCase()
                            .includes(
                                query
                            );

                    const matchesStatus =
                        !statusFilter ||
                        order.status ===
                        statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            orders,
            search,
            statusFilter,
        ]);

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
                Loading shipments...
            </div>
        );
    }

    return (
        <div className="customer-orders">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-eyebrow">
                        Shipment Management
                    </div>

                    <h1 className="page-title">
                        My Shipments
                    </h1>

                    <p className="page-description">
                        View, track, and manage
                        all your shipments.
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="ui-button ui-button-primary ui-button-md"
                        onClick={() =>
                            navigate(
                                "/customer/orders/new"
                            )
                        }
                    >
                        <FiPlus
                            size={16}
                        />

                        Create Shipment
                    </button>
                </div>
            </div>

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Filters */}

            <section className="orders-filter-panel">
                <div className="orders-filter-header">
                    <div>
                        <div className="orders-filter-title">
                            <FiSearch
                                size={16}
                            />

                            Find Shipments
                        </div>

                        <p>
                            Search by order number
                            or delivery address.
                        </p>
                    </div>

                    <button
                        className="text-button"
                        onClick={() => {
                            setSearch("");
                            setStatusFilter(
                                ""
                            );
                        }}
                    >
                        Clear filters
                    </button>
                </div>

                <div className="orders-filter-grid">
                    <div className="search-field">
                        <FiSearch
                            size={16}
                        />

                        <input
                            type="text"
                            placeholder="Search shipment..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target
                                        .value
                                )
                            }
                        />
                    </div>

                    <select
                        className="ui-select"
                        value={
                            statusFilter
                        }
                        onChange={(e) =>
                            setStatusFilter(
                                e.target
                                    .value
                            )
                        }
                    >
                        <option value="">
                            All statuses
                        </option>

                        <option value="CREATED">
                            Created
                        </option>

                        <option value="ASSIGNED">
                            Assigned
                        </option>

                        <option value="PICKED_UP">
                            Picked Up
                        </option>

                        <option value="OUT_FOR_DELIVERY">
                            Out for Delivery
                        </option>

                        <option value="DELIVERED">
                            Delivered
                        </option>

                        <option value="FAILED">
                            Failed
                        </option>
                    </select>
                </div>
            </section>

            {/* Results */}

            <div className="customer-orders-result-header">
                <span>
                    {
                        filteredOrders.length
                    }{" "}
                    shipments
                </span>
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
                            ? "No shipments yet"
                            : "No shipments found"}
                    </h3>

                    <p>
                        {orders.length ===
                            0
                            ? "Create your first shipment to get started."
                            : "Try changing your search or filters."}
                    </p>

                    {orders.length ===
                        0 && (
                            <button
                                className="ui-button ui-button-primary ui-button-md"
                                onClick={() =>
                                    navigate(
                                        "/customer/orders/new"
                                    )
                                }
                            >
                                <FiPlus
                                    size={16}
                                />

                                Create Shipment
                            </button>
                        )}
                </div>
            ) : (
                <div className="customer-order-list">
                    {filteredOrders.map(
                        (
                            order
                        ) => (
                            <article
                                className="customer-order-card"
                                key={
                                    order._id
                                }
                            >
                                <div className="customer-order-card-top">
                                    <div className="customer-order-number">
                                        <div className="customer-order-icon">
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
                                                <FiCalendar
                                                    size={
                                                        13
                                                    }
                                                />

                                                {order.createdAt
                                                    ? new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )
                                                    : "—"}
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

                                <div className="customer-order-route">
                                    <div>
                                        <span className="route-label">
                                            PICKUP
                                        </span>

                                        <div className="route-address">
                                            <FiMapPin
                                                size={
                                                    15
                                                }
                                            />

                                            <span>
                                                {
                                                    order
                                                        .pickup
                                                        ?.address
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <div className="route-line">
                                        <span />
                                    </div>

                                    <div>
                                        <span className="route-label">
                                            DROP
                                        </span>

                                        <div className="route-address">
                                            <FiMapPin
                                                size={
                                                    15
                                                }
                                            />

                                            <span>
                                                {
                                                    order
                                                        .drop
                                                        ?.address
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="customer-order-card-footer">
                                    <div>
                                        <span className="order-price-label">
                                            Delivery
                                            charge
                                        </span>

                                        <strong>
                                            ₹
                                            {Number(
                                                order
                                                    .pricing
                                                    ?.totalCharge ||
                                                0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>
                                    </div>

                                    <button
                                        className="ui-button ui-button-secondary ui-button-sm"
                                        onClick={() =>
                                            navigate(
                                                `/customer/orders/${order._id}`
                                            )
                                        }
                                    >
                                        View Tracking

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
        </div>
    );
};

export default MyOrders;