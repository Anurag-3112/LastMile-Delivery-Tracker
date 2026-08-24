import {
    updateOrderStatus,
} from "../../api/agent.api";

const AgentStatusActions = ({
    order,
    onUpdated,
}) => {
    const updateStatus =
        async (
            status,
            reason
        ) => {
            await updateOrderStatus(
                order._id,
                {
                    status,
                    ...(reason && {
                        reason,
                    }),
                }
            );

            onUpdated();
        };

    if (
        order.status ===
        "ASSIGNED"
    ) {
        return (
            <button
                onClick={() =>
                    updateStatus(
                        "PICKED_UP"
                    )
                }
            >
                Mark Picked Up
            </button>
        );
    }

    if (
        order.status ===
        "PICKED_UP"
    ) {
        return (
            <button
                onClick={() =>
                    updateStatus(
                        "IN_TRANSIT"
                    )
                }
            >
                Mark In Transit
            </button>
        );
    }

    if (
        order.status ===
        "IN_TRANSIT"
    ) {
        return (
            <button
                onClick={() =>
                    updateStatus(
                        "OUT_FOR_DELIVERY"
                    )
                }
            >
                Out for Delivery
            </button>
        );
    }

    if (
        order.status ===
        "OUT_FOR_DELIVERY"
    ) {
        return (
            <div>
                <button
                    onClick={() =>
                        updateStatus(
                            "DELIVERED"
                        )
                    }
                >
                    Delivered
                </button>

                <button
                    onClick={() =>
                        updateStatus(
                            "FAILED",
                            "Customer unavailable"
                        )
                    }
                >
                    Failed
                </button>
            </div>
        );
    }

    return null;
};

export default AgentStatusActions;