import {
    useState,
} from "react";

import {
    FiLoader,
    FiZap,
} from "react-icons/fi";

import {
    autoAssignAgent,
} from "../../api/admin.api";

const AutoAssignButton = ({
    orderId,
    disabled,
    onSuccess,
}) => {
    const [loading, setLoading] =
        useState(false);

    const handleAutoAssign =
        async () => {
            const confirmed =
                window.confirm(
                    "Automatically assign the best available delivery agent to this order?"
                );

            if (!confirmed) {
                return;
            }

            try {
                setLoading(true);

                await autoAssignAgent(
                    orderId
                );

                onSuccess();
            } catch (error) {
                window.alert(
                    error.response?.data
                        ?.message ||
                    "Unable to auto-assign agent"
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <button
            className="ui-button ui-button-primary ui-button-md"
            onClick={
                handleAutoAssign
            }
            disabled={
                disabled ||
                loading
            }
        >
            {loading ? (
                <>
                    <FiLoader
                        size={16}
                        className="spin"
                    />

                    Assigning...
                </>
            ) : (
                <>
                    <FiZap
                        size={16}
                    />

                    Auto Assign
                </>
            )}
        </button>
    );
};

export default AutoAssignButton;