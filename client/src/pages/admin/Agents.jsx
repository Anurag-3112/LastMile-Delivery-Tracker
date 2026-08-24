import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiEdit3,
    FiLoader,
    FiMapPin,
    FiPlus,
    FiRefreshCw,
    FiSearch,
    FiTruck,
    FiUserCheck,
    FiUserX,
    FiUsers,
    FiX,
} from "react-icons/fi";

import {
    createAgent,
    getAgents,
    getZones,
    updateAgent,
} from "../../api/admin.api";

const AdminAgents = () => {
    const [agents, setAgents] =
        useState([]);

    const [zones, setZones] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [availabilityFilter, setAvailabilityFilter] =
        useState("");

    const [zoneFilter, setZoneFilter] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingAgent, setEditingAgent] =
        useState(null);

    const loadData = async (
        showLoader = true
    ) => {
        try {
            setError("");

            if (showLoader) {
                setLoading(true);
            }

            const [
                agentsResult,
                zonesResult,
            ] = await Promise.all([
                getAgents(),
                getZones(),
            ]);

            const agentData =
                agentsResult.data;

            const zoneData =
                zonesResult.data;

            setAgents(
                Array.isArray(agentData)
                    ? agentData
                    : agentData?.agents ||
                    []
            );

            setZones(
                Array.isArray(zoneData)
                    ? zoneData
                    : zoneData?.zones ||
                    []
            );
        } catch (error) {
            setError(
                error.response?.data
                    ?.message ||
                "Unable to load agents"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredAgents =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return agents.filter(
                (agent) => {
                    const user =
                        agent.userId ||
                        {};

                    const zone =
                        agent.currentZoneId ||
                        {};

                    const matchesSearch =
                        !query ||
                        user.name
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        user.email
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        user.phone
                            ?.toLowerCase()
                            .includes(
                                query
                            );

                    const matchesAvailability =
                        !availabilityFilter ||
                        agent.availability ===
                        availabilityFilter;

                    const matchesZone =
                        !zoneFilter ||
                        zone._id ===
                        zoneFilter;

                    return (
                        matchesSearch &&
                        matchesAvailability &&
                        matchesZone
                    );
                }
            );
        }, [
            agents,
            search,
            availabilityFilter,
            zoneFilter,
        ]);

    const getAvailabilityClass =
        (availability) => {
            return `agent-status-badge agent-status-${String(
                availability || ""
            ).toLowerCase()}`;
        };

    const clearFilters =
        () => {
            setSearch("");
            setAvailabilityFilter("");
            setZoneFilter("");
        };

    const handleRefresh =
        async () => {
            setRefreshing(true);

            await loadData(false);
        };

    const openCreate =
        () => {
            setEditingAgent(null);
            setShowModal(true);
        };

    const openEdit =
        (agent) => {
            setEditingAgent(agent);
            setShowModal(true);
        };

    const closeModal =
        () => {
            setShowModal(false);
            setEditingAgent(null);
        };

    return (
        <div className="admin-agents">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-eyebrow">
                        <FiUsers size={14} />

                        Workforce
                    </div>

                    <h1 className="page-title">
                        Delivery Agents
                    </h1>

                    <p className="page-description">
                        Manage delivery agents,
                        availability, zones, and
                        active workloads.
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="ui-button ui-button-secondary ui-button-md"
                        onClick={
                            handleRefresh
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

                    <button
                        className="ui-button ui-button-primary ui-button-md"
                        onClick={
                            openCreate
                        }
                    >
                        <FiPlus size={16} />

                        Add Agent
                    </button>
                </div>
            </div>

            {/* Summary */}

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Total Agents
                        </span>

                        <div className="stat-card-icon stat-card-icon-blue">
                            <FiUsers
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {agents.length}
                    </div>

                    <div className="stat-card-description">
                        Registered delivery
                        agents
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Available
                        </span>

                        <div className="stat-card-icon stat-card-icon-green">
                            <FiUserCheck
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {
                            agents.filter(
                                (agent) =>
                                    agent.availability ===
                                    "AVAILABLE"
                            ).length
                        }
                    </div>

                    <div className="stat-card-description">
                        Ready for assignment
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Busy
                        </span>

                        <div className="stat-card-icon stat-card-icon-orange">
                            <FiTruck
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {
                            agents.filter(
                                (agent) =>
                                    agent.availability ===
                                    "BUSY"
                            ).length
                        }
                    </div>

                    <div className="stat-card-description">
                        Currently handling
                        orders
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Offline
                        </span>

                        <div className="stat-card-icon stat-card-icon-gray">
                            <FiUserX
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {
                            agents.filter(
                                (agent) =>
                                    agent.availability ===
                                    "OFFLINE"
                            ).length
                        }
                    </div>

                    <div className="stat-card-description">
                        Not accepting
                        assignments
                    </div>
                </div>
            </div>

            {/* Filters */}

            <section className="orders-filter-panel">
                <div className="orders-filter-header">
                    <div>
                        <div className="orders-filter-title">
                            <FiSearch
                                size={16}
                            />

                            Find Agents
                        </div>

                        <p>
                            Search and filter
                            your delivery
                            workforce.
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
                            placeholder="Search name, email or phone..."
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
                            availabilityFilter
                        }
                        onChange={(e) =>
                            setAvailabilityFilter(
                                e.target
                                    .value
                            )
                        }
                    >
                        <option value="">
                            All availability
                        </option>

                        <option value="AVAILABLE">
                            Available
                        </option>

                        <option value="BUSY">
                            Busy
                        </option>

                        <option value="OFFLINE">
                            Offline
                        </option>
                    </select>

                    <select
                        className="ui-select"
                        value={zoneFilter}
                        onChange={(e) =>
                            setZoneFilter(
                                e.target
                                    .value
                            )
                        }
                    >
                        <option value="">
                            All zones
                        </option>

                        {zones.map(
                            (zone) => (
                                <option
                                    key={
                                        zone._id
                                    }
                                    value={
                                        zone._id
                                    }
                                >
                                    {
                                        zone.name
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>
            </section>

            {/* Error */}

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Agents Table */}

            <section className="admin-table-card">
                <div className="admin-table-header">
                    <div>
                        <h2>
                            Delivery Agents
                        </h2>

                        <p>
                            {
                                filteredAgents.length
                            }{" "}
                            agents shown
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="admin-table-loading">
                        <FiLoader
                            size={20}
                            className="spin"
                        />

                        <span>
                            Loading agents...
                        </span>
                    </div>
                ) : filteredAgents.length ===
                    0 ? (
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">
                            <FiUsers
                                size={24}
                            />
                        </div>

                        <h3>
                            No agents found
                        </h3>

                        <p>
                            No delivery agents
                            match your current
                            filters.
                        </p>

                        <button
                            className="ui-button ui-button-primary ui-button-md"
                            onClick={
                                openCreate
                            }
                        >
                            <FiPlus
                                size={16}
                            />

                            Add Agent
                        </button>
                    </div>
                ) : (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>
                                        Agent
                                    </th>

                                    <th>
                                        Contact
                                    </th>

                                    <th>
                                        Zone
                                    </th>

                                    <th>
                                        Availability
                                    </th>

                                    <th>
                                        Active Orders
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAgents.map(
                                    (
                                        agent
                                    ) => {
                                        const user =
                                            agent.userId ||
                                            {};

                                        const zone =
                                            agent.currentZoneId ||
                                            {};

                                        const location =
                                            agent.currentLocation;

                                        return (
                                            <tr
                                                key={
                                                    user._id ||
                                                    agent._id
                                                }
                                            >
                                                <td>
                                                    <div className="order-customer-cell">
                                                        <strong>
                                                            {
                                                                user.name ||
                                                                "Unknown Agent"
                                                            }
                                                        </strong>

                                                        <span>
                                                            DELIVERY
                                                            AGENT
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="order-customer-cell">
                                                        <span>
                                                            {
                                                                user.email ||
                                                                "—"
                                                            }
                                                        </span>

                                                        <span>
                                                            {
                                                                user.phone ||
                                                                "—"
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <div className="zone-cell">
                                                        <FiMapPin
                                                            size={14}
                                                        />

                                                        <span>
                                                            {
                                                                zone.name ||
                                                                "Unassigned"
                                                            }
                                                        </span>
                                                    </div>
                                                </td>

                                                <td>
                                                    <span
                                                        className={getAvailabilityClass(
                                                            agent.availability
                                                        )}
                                                    >
                                                        <span className="status-dot" />

                                                        {
                                                            agent.availability ||
                                                            "OFFLINE"
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <strong>
                                                        {
                                                            agent.activeOrderCount ??
                                                            0
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {location?.latitude !==
                                                        undefined &&
                                                        location?.longitude !==
                                                        undefined ? (
                                                        <span className="location-cell">
                                                            <FiMapPin
                                                                size={14}
                                                            />

                                                            {Number(
                                                                location.latitude
                                                            ).toFixed(
                                                                4
                                                            )}

                                                            ,

                                                            {Number(
                                                                location.longitude
                                                            ).toFixed(
                                                                4
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="muted-cell">
                                                            Not
                                                            available
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        className="icon-button"
                                                        title="Edit agent"
                                                        onClick={() =>
                                                            openEdit(
                                                                agent
                                                            )
                                                        }
                                                    >
                                                        <FiEdit3
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
                )}
            </section>

            {showModal && (
                <AgentModal
                    agent={
                        editingAgent
                    }
                    zones={zones}
                    onClose={
                        closeModal
                    }
                    onSuccess={() => {
                        closeModal();
                        loadData();
                    }}
                />
            )}
        </div>
    );
};

const AgentModal = ({
    agent,
    zones,
    onClose,
    onSuccess,
}) => {
    const isEditing = Boolean(agent);

    const existingUser =
        agent?.userId || {};

    const [form, setForm] = useState({
        name:
            existingUser.name || "",

        email:
            existingUser.email || "",

        phone:
            existingUser.phone || "",

        password: "",

        zoneId:
            agent?.currentZoneId?._id || "",

        availability:
            agent?.availability || "OFFLINE",

        isActive:
            existingUser.isActive !== false,
    });

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setForm((current) => ({
            ...current,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

        // Clear previous API error when
        // the user changes the field.
        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (submitting) {
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            if (isEditing) {
                await updateAgent(
                    existingUser._id,
                    {
                        name:
                            form.name.trim(),

                        phone:
                            form.phone.trim(),

                        zoneId:
                            form.zoneId ||
                            undefined,

                        availability:
                            form.availability,

                        isActive:
                            form.isActive,
                    }
                );
            } else {
                await createAgent({
                    name:
                        form.name.trim(),

                    email:
                        form.email
                            .trim()
                            .toLowerCase(),

                    phone:
                        form.phone.trim(),

                    password:
                        form.password,

                    zoneId:
                        form.zoneId ||
                        undefined,

                    availability:
                        form.availability,
                });
            }

            onSuccess();
        } catch (error) {
            const status =
                error.response?.status;

            const message =
                error.response?.data
                    ?.message;

            if (status === 409) {
                setError(
                    message ||
                    "A user with this email or phone already exists."
                );
            } else if (status === 400) {
                setError(
                    message ||
                    "Please check the entered information."
                );
            } else if (status === 401) {
                setError(
                    "Your session has expired. Please sign in again."
                );
            } else if (status === 403) {
                setError(
                    "You do not have permission to manage agents."
                );
            } else {
                setError(
                    message ||
                    "Unable to save agent. Please try again."
                );
            }
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
                    e.currentTarget &&
                    !submitting
                ) {
                    onClose();
                }
            }}
        >
            <div className="modal-card">
                <div className="modal-header">
                    <div>
                        <h2>
                            {isEditing
                                ? "Edit Delivery Agent"
                                : "Add Delivery Agent"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update agent information and availability."
                                : "Create a new delivery agent account."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close-button"
                        onClick={onClose}
                        disabled={submitting}
                    >
                        <FiX size={18} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                >
                    <div className="modal-body">
                        {error && (
                            <div
                                className="modal-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="ui-label">
                                    Full Name
                                </label>

                                <input
                                    className="ui-input"
                                    name="name"
                                    value={
                                        form.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Agent name"
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="ui-label">
                                    Phone
                                </label>

                                <input
                                    className="ui-input"
                                    name="phone"
                                    type="tel"
                                    value={
                                        form.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="10 digit phone"
                                    autoComplete="tel"
                                    required
                                />
                            </div>
                        </div>

                        {!isEditing && (
                            <>
                                <div className="form-group">
                                    <label className="ui-label">
                                        Email
                                    </label>

                                    <input
                                        className="ui-input"
                                        name="email"
                                        type="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="agent@example.com"
                                        autoComplete="email"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="ui-label">
                                        Temporary
                                        Password
                                    </label>

                                    <input
                                        className="ui-input"
                                        name="password"
                                        type="password"
                                        value={
                                            form.password
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Minimum 8 characters"
                                        minLength={8}
                                        autoComplete="new-password"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="ui-label">
                                    Zone
                                </label>

                                <select
                                    className="ui-select ui-select-full"
                                    name="zoneId"
                                    value={
                                        form.zoneId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="">
                                        No zone
                                    </option>

                                    {zones.map(
                                        (zone) => (
                                            <option
                                                key={
                                                    zone._id
                                                }
                                                value={
                                                    zone._id
                                                }
                                            >
                                                {
                                                    zone.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="ui-label">
                                    Availability
                                </label>

                                <select
                                    className="ui-select ui-select-full"
                                    name="availability"
                                    value={
                                        form.availability
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="AVAILABLE">
                                        Available
                                    </option>

                                    <option value="BUSY">
                                        Busy
                                    </option>

                                    <option value="OFFLINE">
                                        Offline
                                    </option>
                                </select>
                            </div>
                        </div>

                        {isEditing && (
                            <label className="checkbox-row">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={
                                        form.isActive
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                <span>
                                    Agent account is
                                    active
                                </span>
                            </label>
                        )}
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="ui-button ui-button-secondary ui-button-md"
                            onClick={onClose}
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
                                submitting
                            }
                        >
                            {submitting ? (
                                <>
                                    <FiLoader
                                        size={16}
                                        className="spin"
                                    />

                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FiUserCheck
                                        size={16}
                                    />

                                    {isEditing
                                        ? "Save Changes"
                                        : "Create Agent"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAgents;