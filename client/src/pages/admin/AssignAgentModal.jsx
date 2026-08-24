import {
    useEffect,
    useState,
} from "react";

import {
    FiCheck,
    FiLoader,
    FiX,
} from "react-icons/fi";

import {
    assignAgent,
    getAgents,
} from "../../api/admin.api";

const AssignAgentModal = ({
    orderId,
    currentAgentId,
    onClose,
    onSuccess,
}) => {
    const [agents, setAgents] =
        useState([]);

    const [selectedAgent, setSelectedAgent] =
        useState(
            currentAgentId || ""
        );

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadAgents =
            async () => {
                try {
                    const result =
                        await getAgents();

                    const agentList =
                        result.data || [];

                    setAgents(
                        agentList.filter(
                            (agent) =>
                                agent.userId
                                    ?.isActive !==
                                false
                        )
                    );
                } catch (error) {
                    setError(
                        error.response?.data
                            ?.message ||
                        "Unable to load agents"
                    );
                } finally {
                    setLoading(false);
                }
            };

        loadAgents();
    }, []);

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            if (!selectedAgent) {
                setError(
                    "Please select an agent"
                );

                return;
            }

            try {
                setSubmitting(true);
                setError("");

                await assignAgent(
                    orderId,
                    selectedAgent
                );

                onSuccess();
            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to assign agent"
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
                            Assign Delivery Agent
                        </h2>

                        <p>
                            Select an available
                            agent for this order.
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
                        {error && (
                            <div className="modal-error">
                                {error}
                            </div>
                        )}

                        <label className="ui-label">
                            Delivery Agent
                        </label>

                        {loading ? (
                            <div className="modal-loading">
                                <FiLoader
                                    size={17}
                                    className="spin"
                                />

                                Loading agents...
                            </div>
                        ) : (
                            <select
                                className="ui-select ui-select-full"
                                value={
                                    selectedAgent
                                }
                                onChange={(e) =>
                                    setSelectedAgent(
                                        e.target
                                            .value
                                    )
                                }
                            >
                                <option value="">
                                    Select an agent
                                </option>

                                {agents.map(
                                    (
                                        agent
                                    ) => {
                                        const user =
                                            agent.userId;

                                        return (
                                            <option
                                                key={
                                                    user?._id
                                                }
                                                value={
                                                    user?._id
                                                }
                                            >
                                                {user?.name ||
                                                    "Unknown"}{" "}
                                                —{" "}
                                                {agent.availability ||
                                                    "OFFLINE"}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        )}

                        <p className="ui-help-text">
                            Manual assignment will
                            be recorded in the
                            order tracking history.
                        </p>
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
                            className="ui-button ui-button-primary ui-button-md"
                            disabled={
                                submitting ||
                                loading
                            }
                        >
                            {submitting ? (
                                <>
                                    <FiLoader
                                        size={16}
                                        className="spin"
                                    />

                                    Assigning...
                                </>
                            ) : (
                                <>
                                    <FiCheck
                                        size={16}
                                    />

                                    Assign Agent
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignAgentModal;