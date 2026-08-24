import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiArrowLeft,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiPackage,
    FiRefreshCw,
    FiTruck,
    FiXCircle,
} from "react-icons/fi";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getOrder,
} from "../../api/order.api";

import {
    getTracking,
} from "../../api/tracking.api";

import {
    updateOrderStatus,
} from "../../api/agent.api";

import TrackingTimeline from
    "../../components/orders/TrackingTimeline";

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

const NEXT_ACTIONS = {
    ASSIGNED: "PICKED_UP",
    PICKED_UP: "IN_TRANSIT",
    IN_TRANSIT:
        "OUT_FOR_DELIVERY",
};

const AgentOrderDetails = () => {
    const {
        orderId,
    } = useParams();

    const navigate =
        useNavigate();

    const [order, setOrder] =
        useState(null);

    const [events, setEvents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [updating, setUpdating] =
        useState(false);

    const [error, setError] =
        useState("");

    const [showFailureForm, setShowFailureForm] =
        useState(false);

    const [failureReason, setFailureReason] =
        useState("");

    const loadData =
        async (
            showInitialLoader = false
        ) => {
            try {
                setError("");

                if (
                    showInitialLoader
                ) {
                    setLoading(true);
                }

                const [
                    orderResult,
                    trackingResult,
                ] = await Promise.all([
                    getOrder(orderId),
                    getTracking(orderId),
                ]);

                setOrder(
                    orderResult.data?.order
                );

                setEvents(
                    trackingResult.data
                        ?.events || []
                );
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to load order details."
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

    useEffect(() => {
        loadData(true);
    }, [orderId]);

    const nextStatus =
        useMemo(() => {
            if (!order) {
                return null;
            }

            return (
                NEXT_ACTIONS[
                order.status
                ] || null
            );
        }, [order]);

    const updateStatus =
        async (
            status,
            reason = ""
        ) => {
            setUpdating(true);
            setError("");

            try {
                const result =
                    await updateOrderStatus(
                        orderId,
                        {
                            status,
                            reason,
                        }
                    );

                setOrder(
                    result.data?.order
                );

                await loadData();

                setShowFailureForm(
                    false
                );

                setFailureReason("");
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to update shipment status."
                );
            } finally {
                setUpdating(false);
            }
        };

    const handleNextStatus =
        async () => {
            if (!nextStatus) {
                return;
            }

            await updateStatus(
                nextStatus
            );
        };

    const handleFailure =
        async () => {
            if (
                !failureReason.trim()
            ) {
                setError(
                    "Please provide a reason for the failed delivery."
                );

                return;
            }

            await updateStatus(
                "FAILED",
                failureReason.trim()
            );
        };

    const refresh =
        async () => {
            setRefreshing(true);

            await loadData();
        };

    if (loading) {
        return (
            <div className="page-loading">
                <FiRefreshCw
                    size={18}
                    className="spin"
                />

                Loading shipment...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="empty-state-card">
                <div className="empty-state-icon">
                    <FiPackage
                        size={25}
                    />
                </div>

                <h3>
                    Shipment not found
                </h3>

                <p>
                    We couldn't find this
                    shipment.
                </p>

                <button
                    className="ui-button ui-button-secondary ui-button-md"
                    onClick={() =>
                        navigate(
                            "/agent"
                        )
                    }
                >
                    <FiArrowLeft
                        size={16}
                    />

                    Back to Dashboard
                </button>
            </div>
        );
    }

    const isTerminal =
        [
            "DELIVERED",
            "FAILED",
        ].includes(
            order.status
        );

    return (
        <div className="agent-order-details">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <button
                        className="back-button"
                        onClick={() =>
                            navigate(
                                "/agent"
                            )
                        }
                    >
                        <FiArrowLeft
                            size={16}
                        />

                        Back to Dashboard
                    </button>

                    <div className="page-header-eyebrow">
                        Delivery Assignment
                    </div>

                    <div className="order-details-title-row">
                        <div>
                            <h1 className="page-title">
                                {
                                    order.orderNumber
                                }
                            </h1>

                            <p className="page-description">
                                Manage this
                                shipment and
                                update its
                                delivery
                                progress.
                            </p>
                        </div>

                        <button
                            className="ui-button ui-button-secondary ui-button-md"
                            onClick={
                                refresh
                            }
                            disabled={
                                refreshing ||
                                updating
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
            </div>

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Status */}

            <section className="agent-current-status-card">
                <div>
                    <span className="agent-current-status-label">
                        CURRENT STATUS
                    </span>

                    <div className="agent-current-status">
                        <StatusIcon
                            status={
                                order.status
                            }
                        />

                        <strong>
                            {
                                STATUS_LABELS[
                                order.status
                                ] ||
                                order.status
                            }
                        </strong>
                    </div>
                </div>

                {!isTerminal &&
                    nextStatus && (
                        <div className="status-action">
                            <span>
                                NEXT ACTION
                            </span>

                            <button
                                className="ui-button ui-button-primary ui-button-md"
                                onClick={
                                    handleNextStatus
                                }
                                disabled={
                                    updating
                                }
                            >
                                {updating ? (
                                    <>
                                        <FiRefreshCw
                                            size={
                                                16
                                            }
                                            className="spin"
                                        />

                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        {getActionLabel(
                                            nextStatus
                                        )}

                                        <FiTruck
                                            size={
                                                16
                                            }
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    )}
            </section>

            {/* Main content */}

            <div className="agent-order-layout">
                <div>
                    {/* Route */}

                    <section className="detail-card">
                        <div className="detail-card-header">
                            <div>
                                <h2>
                                    Delivery
                                    Route
                                </h2>

                                <p>
                                    Pickup and
                                    delivery
                                    locations
                                </p>
                            </div>
                        </div>

                        <div className="order-route-large">
                            <div className="order-route-location">
                                <div className="route-marker route-marker-pickup">
                                    <FiMapPin
                                        size={
                                            17
                                        }
                                    />
                                </div>

                                <div>
                                    <span>
                                        PICKUP
                                    </span>

                                    <h3>
                                        {
                                            order
                                                .pickup
                                                ?.areaId
                                                ?.name
                                        }
                                    </h3>

                                    <p>
                                        {
                                            order
                                                .pickup
                                                ?.address
                                        }
                                    </p>

                                    {order
                                        .pickup
                                        ?.zoneId && (
                                            <small>
                                                Zone:{" "}
                                                {
                                                    order
                                                        .pickup
                                                        .zoneId
                                                        .name
                                                }
                                            </small>
                                        )}
                                </div>
                            </div>

                            <div className="route-line" />

                            <div className="order-route-location">
                                <div className="route-marker route-marker-drop">
                                    <FiMapPin
                                        size={
                                            17
                                        }
                                    />
                                </div>

                                <div>
                                    <span>
                                        DELIVERY
                                    </span>

                                    <h3>
                                        {
                                            order
                                                .drop
                                                ?.areaId
                                                ?.name
                                        }
                                    </h3>

                                    <p>
                                        {
                                            order
                                                .drop
                                                ?.address
                                        }
                                    </p>

                                    {order
                                        .drop
                                        ?.zoneId && (
                                            <small>
                                                Zone:{" "}
                                                {
                                                    order
                                                        .drop
                                                        .zoneId
                                                        .name
                                                }
                                            </small>
                                        )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Package */}

                    <section className="detail-card">
                        <div className="detail-card-header">
                            <div>
                                <h2>
                                    Package
                                    Details
                                </h2>

                                <p>
                                    Shipment
                                    specifications
                                </p>
                            </div>
                        </div>

                        <div className="detail-grid">
                            <DetailItem
                                label="Length"
                                value={`${order.package?.length} cm`}
                            />

                            <DetailItem
                                label="Breadth"
                                value={`${order.package?.breadth} cm`}
                            />

                            <DetailItem
                                label="Height"
                                value={`${order.package?.height} cm`}
                            />

                            <DetailItem
                                label="Actual Weight"
                                value={`${order.package?.actualWeight} kg`}
                            />

                            <DetailItem
                                label="Volumetric Weight"
                                value={`${order.package?.volumetricWeight} kg`}
                            />

                            <DetailItem
                                label="Billable Weight"
                                value={`${order.package?.billableWeight} kg`}
                            />
                        </div>
                    </section>

                    {/* Payment */}

                    <section className="detail-card">
                        <div className="detail-card-header">
                            <div>
                                <h2>
                                    Order &
                                    Payment
                                </h2>

                                <p>
                                    Commercial
                                    details
                                </p>
                            </div>
                        </div>

                        <div className="detail-grid">
                            <DetailItem
                                label="Order Type"
                                value={
                                    order.orderType
                                }
                            />

                            <DetailItem
                                label="Payment"
                                value={
                                    order.paymentType ===
                                        "COD"
                                        ? "Cash on Delivery"
                                        : "Prepaid"
                                }
                            />

                            <DetailItem
                                label="Total Charge"
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
                    </section>

                    {/* Failure */}

                    {order.status ===
                        "OUT_FOR_DELIVERY" && (
                            <section className="detail-card failure-action-card">
                                {!showFailureForm ? (
                                    <>
                                        <div>
                                            <h2>
                                                Delivery
                                                issue?
                                            </h2>

                                            <p>
                                                If the
                                                shipment
                                                cannot be
                                                delivered,
                                                record the
                                                reason
                                                before
                                                marking it
                                                as failed.
                                            </p>
                                        </div>

                                        <button
                                            className="ui-button ui-button-secondary ui-button-md"
                                            onClick={() =>
                                                setShowFailureForm(
                                                    true
                                                )
                                            }
                                        >
                                            <FiXCircle
                                                size={
                                                    16
                                                }
                                            />

                                            Mark Failed
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h2>
                                            Mark Delivery
                                            Failed
                                        </h2>

                                        <p>
                                            Please provide
                                            a clear reason
                                            for the failed
                                            delivery.
                                        </p>

                                        <textarea
                                            className="ui-textarea"
                                            value={
                                                failureReason
                                            }
                                            onChange={(
                                                e
                                            ) => {
                                                setFailureReason(
                                                    e
                                                        .target
                                                        .value
                                                );

                                                setError(
                                                    ""
                                                );
                                            }}
                                            placeholder="Example: Customer unavailable at delivery address"
                                            rows={4}
                                        />

                                        <div className="failure-form-actions">
                                            <button
                                                className="ui-button ui-button-secondary ui-button-md"
                                                onClick={() => {
                                                    setShowFailureForm(
                                                        false
                                                    );

                                                    setFailureReason(
                                                        ""
                                                    );
                                                }}
                                                disabled={
                                                    updating
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                className="ui-button ui-button-danger ui-button-md"
                                                onClick={
                                                    handleFailure
                                                }
                                                disabled={
                                                    updating ||
                                                    !failureReason.trim()
                                                }
                                            >
                                                {updating ? (
                                                    <>
                                                        <FiRefreshCw
                                                            size={
                                                                16
                                                            }
                                                            className="spin"
                                                        />

                                                        Updating...
                                                    </>
                                                ) : (
                                                    <>
                                                        Confirm
                                                        Failure

                                                        <FiXCircle
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </section>
                        )}
                </div>

                {/* Tracking */}

                <aside>
                    <section className="detail-card tracking-card">
                        <div className="detail-card-header">
                            <div>
                                <h2>
                                    Tracking
                                </h2>

                                <p>
                                    Shipment
                                    activity
                                </p>
                            </div>
                        </div>

                        <div className="agent-tracking-content">
                            <TrackingTimeline
                                events={events}
                            />
                        </div>
                    </section>
                </aside>
            </div>

            {/* Delivered */}

            {order.status ===
                "DELIVERED" && (
                    <section className="delivery-complete-card">
                        <div className="delivery-complete-icon">
                            <FiCheckCircle
                                size={28}
                            />
                        </div>

                        <div>
                            <h2>
                                Delivery completed
                            </h2>

                            <p>
                                This shipment has
                                been successfully
                                delivered.
                            </p>
                        </div>
                    </section>
                )}

            {/* Failed */}

            {order.status ===
                "FAILED" && (
                    <section className="delivery-failed-card">
                        <div className="delivery-failed-icon">
                            <FiXCircle
                                size={28}
                            />
                        </div>

                        <div>
                            <h2>
                                Delivery failed
                            </h2>

                            <p>
                                This delivery attempt
                                has been marked as
                                failed.
                            </p>
                        </div>
                    </section>
                )}
        </div>
    );
};

const StatusIcon = ({
    status,
}) => {
    if (
        status ===
        "DELIVERED"
    ) {
        return (
            <div className="status-icon success">
                <FiCheckCircle
                    size={21}
                />
            </div>
        );
    }

    if (
        status ===
        "FAILED"
    ) {
        return (
            <div className="status-icon failed">
                <FiXCircle
                    size={21}
                />
            </div>
        );
    }

    if (
        status ===
        "OUT_FOR_DELIVERY"
    ) {
        return (
            <div className="status-icon active">
                <FiTruck
                    size={21}
                />
            </div>
        );
    }

    return (
        <div className="status-icon pending">
            <FiClock
                size={21}
            />
        </div>
    );
};

const DetailItem = ({
    label,
    value,
}) => {
    return (
        <div className="detail-item">
            <span>
                {label}
            </span>

            <strong>
                {value || "—"}
            </strong>
        </div>
    );
};

const getActionLabel =
    (status) => {
        switch (status) {
            case "PICKED_UP":
                return "Mark Picked Up";

            case "IN_TRANSIT":
                return "Mark In Transit";

            case "OUT_FOR_DELIVERY":
                return "Mark Out for Delivery";

            default:
                return `Mark ${STATUS_LABELS[status]}`;
        }
    };

export default AgentOrderDetails;