import {
    useState,
} from "react";

import {
    FiAlertTriangle,
    FiCheck,
    FiLoader,
    FiX,
} from "react-icons/fi";

import {
    overrideOrderStatus,
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

const StatusOverrideModal = ({
    orderId,
    currentStatus,
    onClose,
    onSuccess,
}) => {
    const [status, setStatus] =
        useState(
            currentStatus || ""
        );

    const [reason, setReason] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const formatStatus =
        (value) =>
            value
                .replaceAll(
                    "_",
                    " "
                )
                .replace(
                    /\b\w/g,
                    (char) =>
                        char.toUpperCase()
                );

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            if (
                !status ||
                status ===
                currentStatus
            ) {
                setError(
                    "Select a different status"
                );

                return;
            }

            if (
                reason.trim().length <
                5
            ) {
                setError(
                    "Please provide a reason for the override"
                );

                return;
            }

            try {
                setSubmitting(true);
                setError("");

                await overrideOrderStatus(
                    orderId,
                    {
                        status,
                        reason:
                            reason.trim(),
                    }
                );

                onSuccess();
            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to update order status"
                );
            } finally {
                setSubmitting(false);
            }
        };

    return (
        <div
            className="modal-backdrop"
            onMouseDown={(e) => {
                if (
                    e.target ===
                    e.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="modal-card">
                <div className="modal-header">
                    <div>
                        <h2>
                            Override Order Status
                        </h2>

                        <p>
                            Manually change the
                            current delivery
                            status.
                        </p>
                    </div>

                    <button
                        className="modal-close-button"
                        onClick={
                            onClose
                        }
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >
                    <div className="modal-body">
                        <div className="modal-warning">
                            <FiAlertTriangle
                                size={18}
                            />

                            <span>
                                This action will be
                                recorded in the
                                tracking history as
                                an Admin override.
                            </span>
                        </div>

                        {error && (
                            <div className="modal-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="ui-label">
                                New Status
                            </label>

                            <select
                                className="ui-select ui-select-full"
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <option value="">
                                    Select status
                                </option>

                                {STATUS_OPTIONS.map(
                                    (
                                        option
                                    ) => (
                                        <option
                                            key={
                                                option
                                            }
                                            value={
                                                option
                                            }
                                        >
                                            {formatStatus(
                                                option
                                            )}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="ui-label">
                                Reason
                            </label>

                            <textarea
                                className="ui-textarea"
                                rows="4"
                                placeholder="Explain why the status is being overridden..."
                                value={
                                    reason
                                }
                                onChange={(e) =>
                                    setReason(
                                        e.target
                                            .value
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="ui-button ui-button-secondary ui-button-md"
                            onClick={
                                onClose
                            }
                            disabled={
                                submitting
                            }
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="ui-button ui-button-danger ui-button-md"
                            disabled={
                                submitting
                            }
                        >
                            {submitting ? (
                                <>
                                    <FiLoader
                                        size={16}
                                        className="spin"
                                    />

                                    Updating...
                                </>
                            ) : (
                                <>
                                    <FiCheck
                                        size={16}
                                    />

                                    Override Status
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StatusOverrideModal;