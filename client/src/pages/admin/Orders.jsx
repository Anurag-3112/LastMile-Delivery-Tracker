import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiChevronLeft,
    FiChevronRight,
    FiEye,
    FiFilter,
    FiPackage,
    FiRefreshCw,
    FiSearch,
    FiTruck,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router-dom";

import {
    getAdminOrders,
} from "../../api/admin.api";

const STATUS_OPTIONS = [
    "CREATED",
    "ASSIGNED",
    "PICKED_UP",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "FAILED",
];

const Orders = () => {
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

    const [status, setStatus] =
        useState("");

    const [zoneId, setZoneId] =
        useState("");

    const [agentId, setAgentId] =
        useState("");

    const [customerId, setCustomerId] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [limit] =
        useState(10);

    const [pagination, setPagination] =
        useState({
            total: 0,
            totalPages: 1,
        });

    const [refreshing, setRefreshing] =
        useState(false);

    const loadOrders =
        async () => {
            try {
                setError("");

                if (!refreshing) {
                    setLoading(true);
                }

                const result =
                    await getAdminOrders({
                        status:
                            status || undefined,

                        zoneId:
                            zoneId || undefined,

                        agentId:
                            agentId || undefined,

                        customerId:
                            customerId || undefined,

                        page,

                        limit,
                    });

                const data =
                    result.data || {};

                setOrders(
                    data.orders || []
                );

                setPagination(
                    data.pagination || {
                        total: 0,
                        totalPages: 1,
                    }
                );
            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load orders"
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

    useEffect(() => {
        loadOrders();
    }, [
        status,
        zoneId,
        agentId,
        customerId,
        page,
    ]);

    const filteredOrders =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return orders;
            }

            return orders.filter(
                (order) => {
                    const orderNumber =
                        order.orderNumber ||
                        "";

                    const customerName =
                        order.customerId
                            ?.name || "";

                    const customerEmail =
                        order.customerId
                            ?.email || "";

                    const agentName =
                        order.assignment
                            ?.agentId
                            ?.name || "";

                    return (
                        orderNumber
                            .toLowerCase()
                            .includes(query) ||
                        customerName
                            .toLowerCase()
                            .includes(query) ||
                        customerEmail
                            .toLowerCase()
                            .includes(query) ||
                        agentName
                            .toLowerCase()
                            .includes(query)
                    );
                }
            );
        }, [
            orders,
            search,
        ]);

    const clearFilters =
        () => {
            setSearch("");
            setStatus("");
            setZoneId("");
            setAgentId("");
            setCustomerId("");
            setPage(1);
        };

    const refresh =
        async () => {
            setRefreshing(true);

            await loadOrders();
        };

    const getStatusClass =
        (orderStatus) => {
            return (
                `order-status-badge order-status-${String(
                    orderStatus || ""
                ).toLowerCase()}`
            );
        };

    const formatStatus =
        (orderStatus) => {
            return String(
                orderStatus || ""
            )
                .replaceAll(
                    "_",
                    " "
                )
                .replace(
                    /\b\w/g,
                    (char) =>
                        char.toUpperCase()
                );
        };

    const formatDate =
        (date) => {
            if (!date) {
                return "—";
            }

            return new Date(
                date
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }
            );
        };

    return (
        <div className="admin-orders">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-eyebrow">
                        <FiPackage
                            size={14}
                        />

                        Operations
                    </div>

                    <h1 className="page-title">
                        Orders
                    </h1>

                    <p className="page-description">
                        View, monitor, assign,
                        and manage all delivery
                        orders.
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="ui-button ui-button-secondary ui-button-md"
                        onClick={
                            refresh
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

            {/* Filters */}

            <section className="orders-filter-panel">
                <div className="orders-filter-header">
                    <div>
                        <div className="orders-filter-title">
                            <FiFilter
                                size={16}
                            />

                            Filters
                        </div>

                        <p>
                            Narrow down orders
                            by status or
                            assignment.
                        </p>
                    </div>

                    <button
                        className="text-button"
                        onClick={
                            clearFilters
                        }
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
                            placeholder="Search order, customer or agent..."
                            value={search}
                            onChange={(e) => {
                                setSearch(
                                    e.target
                                        .value
                                );
                                setPage(1);
                            }}
                        />
                    </div>

                    <select
                        className="ui-select"
                        value={status}
                        onChange={(e) => {
                            setStatus(
                                e.target.value
                            );
                            setPage(1);
                        }}
                    >
                        <option value="">
                            All statuses
                        </option>

                        {STATUS_OPTIONS.map(
                            (
                                item
                            ) => (
                                <option
                                    key={
                                        item
                                    }
                                    value={
                                        item
                                    }
                                >
                                    {formatStatus(
                                        item
                                    )}
                                </option>
                            )
                        )}
                    </select>

                    <input
                        className="ui-input"
                        type="text"
                        placeholder="Zone ID"
                        value={zoneId}
                        onChange={(e) => {
                            setZoneId(
                                e.target
                                    .value
                            );
                            setPage(1);
                        }}
                    />

                    <input
                        className="ui-input"
                        type="text"
                        placeholder="Agent ID"
                        value={agentId}
                        onChange={(e) => {
                            setAgentId(
                                e.target
                                    .value
                            );
                            setPage(1);
                        }}
                    />
                </div>
            </section>

            {/* Error */}

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Orders */}

            <section className="admin-table-card">
                <div className="admin-table-header">
                    <div>
                        <h2>
                            All Orders
                        </h2>

                        <p>
                            {pagination.total ||
                                0}{" "}
                            total orders
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-table-loading">
                        <FiRefreshCw
                            size={20}
                            className="spin"
                        />

                        <span>
                            Loading orders...
                        </span>
                    </div>
                ) : filteredOrders.length ===
                    0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">
                            <FiPackage
                                size={24}
                            />
                        </div>

                        <h3>
                            No orders found
                        </h3>

                        <p>
                            There are no orders
                            matching your
                            current filters.
                        </p>

                        <button
                            className="ui-button ui-button-secondary ui-button-md"
                            onClick={
                                clearFilters
                            }
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Order
                                        </th>

                                        <th>
                                            Customer
                                        </th>

                                        <th>
                                            Route
                                        </th>

                                        <th>
                                            Agent
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Created
                                        </th>

                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredOrders.map(
                                        (
                                            order
                                        ) => {
                                            const agent =
                                                order
                                                    .assignment
                                                    ?.agentId;

                                            const pickup =
                                                order
                                                    .pickup
                                                    ?.zoneId;

                                            const drop =
                                                order
                                                    .drop
                                                    ?.zoneId;

                                            return (
                                                <tr
                                                    key={
                                                        order._id
                                                    }
                                                >
                                                    <td>
                                                        <div className="order-number-cell">
                                                            <strong>
                                                                {
                                                                    order.orderNumber ||
                                                                    "—"
                                                                }
                                                            </strong>

                                                            <span>
                                                                {order.orderType ||
                                                                    "—"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="order-customer-cell">
                                                            <strong>
                                                                {
                                                                    order
                                                                        .customerId
                                                                        ?.name ||
                                                                    "Unknown"
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    order
                                                                        .customerId
                                                                        ?.email ||
                                                                    "—"
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        <div className="route-cell">
                                                            <span>
                                                                {
                                                                    pickup ||
                                                                    "—"
                                                                }
                                                            </span>

                                                            <span className="route-arrow">
                                                                →
                                                            </span>

                                                            <span>
                                                                {
                                                                    drop ||
                                                                    "—"
                                                                }
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {agent ? (
                                                            <div className="order-customer-cell">
                                                                <strong>
                                                                    {
                                                                        agent.name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    Assigned
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="unassigned-text">
                                                                Unassigned
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={getStatusClass(
                                                                order.status
                                                            )}
                                                        >
                                                            {
                                                                formatStatus(
                                                                    order.status
                                                                )
                                                            }
                                                        </span>
                                                    </td>

                                                    <td>
                                                        {formatDate(
                                                            order.createdAt
                                                        )}
                                                    </td>

                                                    <td>
                                                        <button
                                                            className="icon-button"
                                                            title="View order"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/orders/${order._id}`
                                                                )
                                                            }
                                                        >
                                                            <FiEye
                                                                size={17}
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}

                        <div className="admin-pagination">
                            <span>
                                Page{" "}
                                <strong>
                                    {page}
                                </strong>{" "}
                                of{" "}
                                <strong>
                                    {pagination.totalPages ||
                                        1}
                                </strong>
                            </span>

                            <div className="pagination-actions">
                                <button
                                    className="icon-button"
                                    disabled={
                                        page <=
                                        1
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                Math.max(
                                                    current -
                                                    1,
                                                    1
                                                )
                                        )
                                    }
                                >
                                    <FiChevronLeft
                                        size={17}
                                    />
                                </button>

                                <button
                                    className="icon-button"
                                    disabled={
                                        page >=
                                        (pagination.totalPages ||
                                            1)
                                    }
                                    onClick={() =>
                                        setPage(
                                            (current) =>
                                                current +
                                                1
                                        )
                                    }
                                >
                                    <FiChevronRight
                                        size={17}
                                    />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default Orders;