const STATUS_CONFIG = {
    CREATED: {
        label: "Created",
        className: "status-created",
    },

    ASSIGNED: {
        label: "Assigned",
        className: "status-assigned",
    },

    PICKED_UP: {
        label: "Picked Up",
        className: "status-picked-up",
    },

    IN_TRANSIT: {
        label: "In Transit",
        className: "status-in-transit",
    },

    OUT_FOR_DELIVERY: {
        label: "Out for Delivery",
        className: "status-out-for-delivery",
    },

    DELIVERED: {
        label: "Delivered",
        className: "status-delivered",
    },

    FAILED: {
        label: "Failed",
        className: "status-failed",
    },
};

const StatusBadge = ({
    status,
}) => {
    const config =
        STATUS_CONFIG[status] || {
            label: status,
            className: "status-created",
        };

    return (
        <span
            className={`status-badge ${config.className}`}
        >
            <span className="status-dot" />

            {config.label}
        </span>
    );
};

export default StatusBadge;