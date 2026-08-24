import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import {
    getOrder,
    rescheduleOrder,
} from "../../api/order.api";

import {
    getTracking,
} from "../../api/tracking.api";

import TrackingTimeline from
    "../../components/orders/TrackingTimeline";

const OrderDetails = () => {
    const { orderId } =
        useParams();

    const navigate =
        useNavigate();

    const [order, setOrder] =
        useState(null);

    const [events, setEvents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [rescheduleDate, setRescheduleDate] =
        useState("");

    const [rescheduling, setRescheduling] =
        useState(false);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            if (!orderId) {
                throw new Error(
                    "Order ID is missing"
                );
            }

            /*
             * Load order first.
             *
             * This lets us distinguish an
             * order API problem from a
             * tracking API problem.
             */

            let orderResult;

            try {
                orderResult =
                    await getOrder(orderId);
            } catch (error) {
                console.error(
                    "GET ORDER ERROR:",
                    error
                );

                throw new Error(
                    error.response?.data
                        ?.message ||
                    "Unable to load order"
                );
            }

            const loadedOrder =
                orderResult.data?.order;

            if (!loadedOrder) {
                throw new Error(
                    "Order was not returned by the server"
                );
            }

            setOrder(
                loadedOrder
            );

            /*
             * Load tracking separately.
             */

            try {
                const trackingResult =
                    await getTracking(
                        orderId
                    );

                setEvents(
                    trackingResult.data
                        ?.events || []
                );
            } catch (error) {
                console.error(
                    "GET TRACKING ERROR:",
                    error
                );

                /*
                 * Don't destroy the entire
                 * order details page if
                 * tracking fails.
                 */

                setEvents([]);

                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load tracking events"
                );
            }
        } catch (error) {
            console.error(
                "ORDER DETAILS ERROR:",
                error
            );

            setError(
                error.message ||
                "Unable to load order"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [orderId]);

    const handleReschedule =
        async () => {
            if (!rescheduleDate) {
                return;
            }

            try {
                setRescheduling(true);
                setError("");

                await rescheduleOrder(
                    orderId,
                    {
                        newDeliveryDate:
                            new Date(
                                rescheduleDate
                            ).toISOString(),

                        reason:
                            "Customer requested reschedule",
                    }
                );

                setRescheduleDate("");

                await loadData();
            } catch (error) {
                console.error(
                    "RESCHEDULE ERROR:",
                    error
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Rescheduling failed"
                );
            } finally {
                setRescheduling(false);
            }
        };

    if (loading) {
        return (
            <div className="page-loading">
                Loading order...
            </div>
        );
    }

    if (!order) {
        return (
            <div className="empty-state-card">
                <h2>
                    Unable to load order
                </h2>

                <p>
                    {error ||
                        "Order not found"}
                </p>

                <button
                    className="ui-button ui-button-secondary ui-button-md"
                    onClick={() =>
                        navigate(
                            "/customer/orders"
                        )
                    }
                >
                    Back to Shipments
                </button>
            </div>
        );
    }

    return (
        <div className="customer-order-details">

            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">

                    <button
                        className="text-button"
                        onClick={() =>
                            navigate(
                                "/customer/orders"
                            )
                        }
                    >
                        ← Back to Shipments
                    </button>

                    <h1 className="page-title">
                        {order.orderNumber}
                    </h1>

                    <p className="page-description">
                        Track your shipment
                        and view delivery
                        updates.
                    </p>
                </div>
            </div>

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Status */}

            <section className="admin-table-card">

                <h2>
                    Current Status
                </h2>

                <p>
                    {order.status}
                </p>

            </section>

            {/* Shipment */}

            <section className="admin-table-card">

                <h2>
                    Shipment
                </h2>

                <p>
                    <strong>
                        Pickup:
                    </strong>{" "}
                    {order.pickup?.address ||
                        "—"}
                </p>

                <p>
                    <strong>
                        Drop:
                    </strong>{" "}
                    {order.drop?.address ||
                        "—"}
                </p>

            </section>

            {/* Price */}

            <section className="admin-table-card">

                <h2>
                    Price
                </h2>

                <p>
                    ₹
                    {Number(
                        order.pricing
                            ?.totalCharge ||
                        0
                    ).toLocaleString(
                        "en-IN"
                    )}
                </p>

            </section>

            {/* Tracking */}

            <section className="admin-table-card customer-tracking-card">

                <h2>
                    Tracking
                </h2>

                {events.length === 0 ? (
                    <p>
                        No tracking events available yet.
                    </p>
                ) : (
                    <TrackingTimeline
                        events={events}
                    />
                )}

            </section>

            {/* Reschedule */}

            {order.status ===
                "FAILED" && (
                    <section className="admin-table-card">

                        <h2>
                            Reschedule Delivery
                        </h2>

                        <input
                            className="ui-input"
                            type="datetime-local"
                            value={
                                rescheduleDate
                            }
                            onChange={(e) =>
                                setRescheduleDate(
                                    e.target
                                        .value
                                )
                            }
                        />

                        <button
                            className="ui-button ui-button-primary ui-button-md"
                            onClick={
                                handleReschedule
                            }
                            disabled={
                                rescheduling ||
                                !rescheduleDate
                            }
                        >
                            {rescheduling
                                ? "Rescheduling..."
                                : "Reschedule Delivery"}
                        </button>

                    </section>
                )}
        </div>
    );
};

export default OrderDetails;