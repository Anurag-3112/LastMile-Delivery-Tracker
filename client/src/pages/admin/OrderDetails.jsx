import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import {
    FiActivity,
    FiArrowLeft,
    FiCreditCard,
    FiEdit3,
    FiMapPin,
    FiPackage,
    FiSettings,
    FiTruck,
    FiUser,
} from "react-icons/fi";

import {
    getOrder,
} from "../../api/order.api";

import {
    getTracking,
} from "../../api/tracking.api";

import TrackingTimeline from
    "../../components/orders/TrackingTimeline";

import AssignAgentModal from
    "./AssignAgentModal";

import StatusOverrideModal from
    "./StatusOverrideModal";

import AutoAssignButton from
    "./AutoAssignButton";


const OrderDetails = () => {
    const {
        orderId,
    } = useParams();

    const navigate =
        useNavigate();


    /* =========================================
       STATE
    ========================================= */

    const [order, setOrder] =
        useState(null);

    const [events, setEvents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [
        showAssignModal,
        setShowAssignModal,
    ] = useState(false);

    const [
        showStatusModal,
        setShowStatusModal,
    ] = useState(false);


    /* =========================================
       LOAD DATA
    ========================================= */

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                orderResult,
                trackingResult,
            ] =
                await Promise.all([
                    getOrder(
                        orderId
                    ),
                    getTracking(
                        orderId
                    ),
                ]);

            setOrder(
                orderResult.data
                    ?.order
            );

            setEvents(
                trackingResult.data
                    ?.events || []
            );
        } catch (error) {
            setError(
                error.response?.data
                    ?.message ||
                "Unable to load order"
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        loadData();
    }, [orderId]);


    /* =========================================
       HELPERS
    ========================================= */

    const formatStatus =
        (status) =>
            String(
                status || ""
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


    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="admin-order-details">

                <div className="dashboard-loading-state">

                    <div className="dashboard-loading-spinner">
                        <FiActivity
                            size={20}
                        />
                    </div>

                    <span>
                        Loading order...
                    </span>

                </div>

            </div>
        );
    }


    /* =========================================
       ERROR / NOT FOUND
    ========================================= */

    if (error || !order) {
        return (
            <div className="admin-order-details">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate(
                            "/admin/orders"
                        )
                    }
                >
                    <FiArrowLeft
                        size={16}
                    />

                    Back to Orders
                </button>

                <div className="admin-inline-error">
                    {error ||
                        "Order not found"}
                </div>

            </div>
        );
    }


    /* =========================================
       TERMINAL ORDER
    ========================================= */

    const isTerminalOrder =
        order.status ===
        "DELIVERED" ||
        order.status ===
        "FAILED";


    return (
        <div className="admin-order-details">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="page-header">

                <div className="page-header-content">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(
                                "/admin/orders"
                            )
                        }
                    >
                        <FiArrowLeft
                            size={16}
                        />

                        Back to Orders
                    </button>

                    <div className="page-header-eyebrow">
                        <FiPackage
                            size={14}
                        />

                        Order Management
                    </div>

                    <h1 className="page-title">
                        {
                            order.orderNumber
                        }
                    </h1>

                    <p className="page-description">
                        Review order details,
                        assignment, pricing,
                        and tracking history.
                    </p>

                </div>

            </div>


            {/* =========================================
                ORDER DETAILS
            ========================================= */}

            <div className="order-details-grid">

                {/* =====================================
                    ORDER STATUS
                ===================================== */}

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Order Status
                            </h2>

                            <p>
                                Current delivery
                                state
                            </p>
                        </div>

                        <span
                            className={`order-status-badge order-status-${String(
                                order.status
                            ).toLowerCase()}`}
                        >
                            {formatStatus(
                                order.status
                            )}
                        </span>

                    </div>

                    <div className="order-detail-list">

                        <div>
                            <span>
                                Order Type
                            </span>

                            <strong>
                                {
                                    order.orderType ||
                                    "—"
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Payment
                            </span>

                            <strong>
                                {
                                    order.payment
                                        ?.mode ||
                                    "—"
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Created
                            </span>

                            <strong>
                                {order.createdAt
                                    ? new Date(
                                        order.createdAt
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                    : "—"}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* =====================================
                    ADMIN CONTROLS
                ===================================== */}

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Admin Controls
                            </h2>

                            <p>
                                Operational override
                                controls
                            </p>
                        </div>

                        <FiSettings
                            size={19}
                        />

                    </div>

                    <div className="admin-control-warning">

                        <FiActivity
                            size={17}
                        />

                        <span>
                            Administrative changes
                            are recorded in the
                            order tracking history.
                        </span>

                    </div>

                    <button
                        className="ui-button ui-button-danger ui-button-md"
                        onClick={() =>
                            setShowStatusModal(
                                true
                            )
                        }
                        disabled={
                            isTerminalOrder
                        }
                    >
                        <FiSettings
                            size={16}
                        />

                        Override Status
                    </button>

                </section>


                {/* =====================================
                    CUSTOMER
                ===================================== */}

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Customer
                            </h2>

                            <p>
                                Customer
                                information
                            </p>
                        </div>

                        <FiUser
                            size={19}
                        />

                    </div>

                    <div className="customer-detail">

                        <strong>
                            {
                                order
                                    .customerId
                                    ?.name ||
                                "—"
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

                        <span>
                            {
                                order
                                    .customerId
                                    ?.phone ||
                                "—"
                            }
                        </span>

                    </div>

                </section>


                {/* =====================================
                    SHIPMENT
                ===================================== */}

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Shipment
                            </h2>

                            <p>
                                Pickup and
                                delivery
                            </p>
                        </div>

                        <FiMapPin
                            size={19}
                        />

                    </div>

                    <div className="shipment-route">

                        <div>
                            <span>
                                Pickup
                            </span>

                            <strong>
                                {
                                    order
                                        .pickup
                                        ?.address ||
                                    "—"
                                }
                            </strong>
                        </div>

                        <div className="shipment-route-line" />

                        <div>
                            <span>
                                Drop
                            </span>

                            <strong>
                                {
                                    order
                                        .drop
                                        ?.address ||
                                    "—"
                                }
                            </strong>
                        </div>

                    </div>

                </section>


                {/* =====================================
                    ASSIGNMENT
                ===================================== */}

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Assignment
                            </h2>

                            <p>
                                Delivery agent
                            </p>
                        </div>

                        <FiTruck
                            size={19}
                        />

                    </div>


                    <div className="customer-detail">

                        <strong>
                            {
                                order
                                    .assignment
                                    ?.agentId
                                    ?.name ||
                                "Unassigned"
                            }
                        </strong>

                        <span>
                            {
                                order
                                    .assignment
                                    ?.agentId
                                    ?.email ||
                                "No agent assigned"
                            }
                        </span>

                        {order.assignment
                            ?.method && (
                                <span>
                                    Assignment method:{" "}
                                    {
                                        order
                                            .assignment
                                            .method
                                    }
                                </span>
                            )}

                    </div>


                    <div className="order-control-actions">

                        <button
                            className="ui-button ui-button-secondary ui-button-md"
                            onClick={() =>
                                setShowAssignModal(
                                    true
                                )
                            }
                            disabled={
                                isTerminalOrder
                            }
                        >
                            <FiEdit3
                                size={16}
                            />

                            Assign Agent
                        </button>


                        <AutoAssignButton
                            orderId={
                                order._id
                            }
                            disabled={
                                isTerminalOrder
                            }
                            onSuccess={
                                loadData
                            }
                        />

                    </div>

                </section>


                {/* =====================================
                    PACKAGE + PRICING
                ===================================== */}

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Package &
                                Pricing
                            </h2>

                            <p>
                                Shipment
                                calculation
                            </p>
                        </div>

                        <FiCreditCard
                            size={19}
                        />

                    </div>


                    <div className="order-detail-list">

                        <div>
                            <span>
                                Actual Weight
                            </span>

                            <strong>
                                {
                                    order
                                        .package
                                        ?.actualWeight ??
                                    "—"
                                }{" "}
                                kg
                            </strong>
                        </div>


                        <div>
                            <span>
                                Volumetric Weight
                            </span>

                            <strong>
                                {
                                    order
                                        .package
                                        ?.volumetricWeight ??
                                    "—"
                                }{" "}
                                kg
                            </strong>
                        </div>


                        <div>
                            <span>
                                Billable Weight
                            </span>

                            <strong>
                                {
                                    order
                                        .package
                                        ?.billableWeight ??
                                    "—"
                                }{" "}
                                kg
                            </strong>
                        </div>


                        <div>
                            <span>
                                Total Charge
                            </span>

                            <strong>
                                ₹
                                {
                                    order
                                        .pricing
                                        ?.totalCharge ??
                                    0
                                }
                            </strong>
                        </div>

                    </div>

                </section>


                {/* =====================================
                    TRACKING
                ===================================== */}

                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Tracking
                            </h2>

                            <p>
                                Immutable delivery
                                history
                            </p>
                        </div>

                        <FiActivity
                            size={19}
                        />

                    </div>

                    <TrackingTimeline
                        events={events}
                    />

                </section>

            </div>


            {/* =========================================
                ASSIGN AGENT MODAL
            ========================================= */}

            {showAssignModal && (
                <AssignAgentModal
                    orderId={
                        order._id
                    }
                    currentAgentId={
                        order.assignment
                            ?.agentId?._id
                    }
                    onClose={() =>
                        setShowAssignModal(
                            false
                        )
                    }
                    onSuccess={() => {
                        setShowAssignModal(
                            false
                        );

                        loadData();
                    }}
                />
            )}


            {/* =========================================
                STATUS OVERRIDE MODAL
            ========================================= */}

            {showStatusModal && (
                <StatusOverrideModal
                    orderId={
                        order._id
                    }
                    currentStatus={
                        order.status
                    }
                    onClose={() =>
                        setShowStatusModal(
                            false
                        )
                    }
                    onSuccess={() => {
                        setShowStatusModal(
                            false
                        );

                        loadData();
                    }}
                />
            )}

        </div>
    );
};

export default OrderDetails;