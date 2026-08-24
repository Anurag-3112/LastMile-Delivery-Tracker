import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiEdit3,
    FiGlobe,
    FiLoader,
    FiPlus,
    FiRefreshCw,
    FiSearch,
    FiToggleLeft,
    FiToggleRight,
    FiX,
} from "react-icons/fi";

import {
    createZone,
    getZones,
    updateZone,
} from "../../api/admin.api";

const Zones = () => {
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

    const [statusFilter, setStatusFilter] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingZone, setEditingZone] =
        useState(null);

    const loadZones = useCallback(
        async (showLoader = true) => {
            try {
                setError("");

                if (showLoader) {
                    setLoading(true);
                }

                const result =
                    await getZones();

                const data =
                    result.data;

                setZones(
                    Array.isArray(data)
                        ? data
                        : data?.zones || []
                );
            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load zones"
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadZones();
    }, [loadZones]);

    const filteredZones =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return zones.filter(
                (zone) => {
                    const matchesSearch =
                        !query ||
                        zone.name
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        zone.code
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        zone.description
                            ?.toLowerCase()
                            .includes(
                                query
                            );

                    const matchesStatus =
                        !statusFilter ||
                        (
                            statusFilter ===
                                "ACTIVE"
                                ? zone.isActive
                                : !zone.isActive
                        );

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        }, [
            zones,
            search,
            statusFilter,
        ]);

    const activeZones =
        zones.filter(
            (zone) =>
                zone.isActive
        ).length;

    const inactiveZones =
        zones.length -
        activeZones;

    const openCreate =
        () => {
            setEditingZone(null);
            setShowModal(true);
        };

    const openEdit =
        (zone) => {
            setEditingZone(zone);
            setShowModal(true);
        };

    const closeModal =
        () => {
            setShowModal(false);
            setEditingZone(null);
        };

    const handleRefresh =
        async () => {
            setRefreshing(true);

            await loadZones(false);
        };

    const clearFilters =
        () => {
            setSearch("");
            setStatusFilter("");
        };

    return (
        <div className="admin-zones">

            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">

                    <div className="page-header-eyebrow">
                        <FiGlobe
                            size={14}
                        />

                        Delivery Network
                    </div>

                    <h1 className="page-title">
                        Zones
                    </h1>

                    <p className="page-description">
                        Manage operational
                        delivery zones and their
                        availability.
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
                        <FiPlus
                            size={16}
                        />

                        Add Zone
                    </button>

                </div>
            </div>

            {/* Stats */}

            <div className="dashboard-stats">

                <div className="stat-card">
                    <div className="stat-card-top">

                        <span className="stat-card-label">
                            Total Zones
                        </span>

                        <div className="stat-card-icon stat-card-icon-blue">
                            <FiGlobe
                                size={18}
                            />
                        </div>

                    </div>

                    <div className="stat-card-value">
                        {zones.length}
                    </div>

                    <div className="stat-card-description">
                        Configured delivery
                        zones
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">

                        <span className="stat-card-label">
                            Active
                        </span>

                        <div className="stat-card-icon stat-card-icon-green">
                            <FiToggleRight
                                size={18}
                            />
                        </div>

                    </div>

                    <div className="stat-card-value">
                        {activeZones}
                    </div>

                    <div className="stat-card-description">
                        Currently operational
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">

                        <span className="stat-card-label">
                            Inactive
                        </span>

                        <div className="stat-card-icon stat-card-icon-gray">
                            <FiToggleLeft
                                size={18}
                            />
                        </div>

                    </div>

                    <div className="stat-card-value">
                        {inactiveZones}
                    </div>

                    <div className="stat-card-description">
                        Temporarily disabled
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

                            Find Zones
                        </div>

                        <p>
                            Search zones by
                            name, code, or
                            description.
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
                            placeholder="Search zones..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <select
                        className="ui-select"
                        value={
                            statusFilter
                        }
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="">
                            All statuses
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>
                    </select>

                </div>

            </section>

            {/* Error */}

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Table */}

            <section className="admin-table-card">

                <div className="admin-table-header">

                    <div>
                        <h2>
                            Delivery Zones
                        </h2>

                        <p>
                            {
                                filteredZones.length
                            }{" "}
                            zones shown
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
                            Loading zones...
                        </span>

                    </div>
                ) : filteredZones.length ===
                    0 ? (
                    <div className="admin-empty-state">

                        <div className="admin-empty-icon">
                            <FiGlobe
                                size={24}
                            />
                        </div>

                        <h3>
                            No zones found
                        </h3>

                        <p>
                            Create your first
                            delivery zone to
                            start configuring
                            the network.
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

                            Add Zone
                        </button>

                    </div>
                ) : (
                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>
                                        Zone
                                    </th>

                                    <th>
                                        Code
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Areas
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredZones.map(
                                    (zone) => (
                                        <tr
                                            key={
                                                zone._id
                                            }
                                        >

                                            <td>
                                                <div className="order-customer-cell">

                                                    <strong>
                                                        {
                                                            zone.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        Delivery
                                                        Zone
                                                    </span>

                                                </div>
                                            </td>

                                            <td>
                                                <span className="code-badge">
                                                    {
                                                        zone.code
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <span className="description-cell">
                                                    {
                                                        zone.description ||
                                                        "No description"
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {zone.areaCount ??
                                                        zone.areas
                                                            ?.length ??
                                                        0}
                                                </strong>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        zone.isActive
                                                            ? "agent-status-badge agent-status-available"
                                                            : "agent-status-badge agent-status-offline"
                                                    }
                                                >
                                                    <span className="status-dot" />

                                                    {zone.isActive
                                                        ? "ACTIVE"
                                                        : "INACTIVE"}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    className="icon-button"
                                                    title="Edit zone"
                                                    onClick={() =>
                                                        openEdit(
                                                            zone
                                                        )
                                                    }
                                                >
                                                    <FiEdit3
                                                        size={17}
                                                    />
                                                </button>
                                            </td>

                                        </tr>
                                    )
                                )}
                            </tbody>

                        </table>

                    </div>
                )}

            </section>

            {/* Zone Modal */}

            {showModal && (
                <ZoneModal
                    zone={
                        editingZone
                    }
                    onClose={
                        closeModal
                    }
                    onSuccess={() => {
                        closeModal();
                        loadZones();
                    }}
                />
            )}

        </div>
    );
};

const ZoneModal = ({
    zone,
    onClose,
    onSuccess,
}) => {
    const isEditing =
        Boolean(zone);

    const [form, setForm] =
        useState({
            name:
                zone?.name || "",

            code:
                zone?.code || "",

            description:
                zone?.description ||
                "",

            isActive:
                zone?.isActive !==
                false,
        });

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange =
        (e) => {
            const {
                name,
                value,
                type,
                checked,
            } = e.target;

            setForm(
                (current) => ({
                    ...current,
                    [name]:
                        type ===
                            "checkbox"
                            ? checked
                            : value,
                })
            );
        };

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            try {
                setSubmitting(true);
                setError("");

                const payload = {
                    name:
                        form.name.trim(),

                    code:
                        form.code
                            .trim()
                            .toUpperCase(),

                    description:
                        form.description.trim(),

                    isActive:
                        form.isActive,
                };

                if (isEditing) {
                    await updateZone(
                        zone._id,
                        payload
                    );
                } else {
                    await createZone(
                        payload
                    );
                }

                onSuccess();
            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to save zone"
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
                            {isEditing
                                ? "Edit Zone"
                                : "Create Zone"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update the operational zone configuration."
                                : "Add a new operational delivery zone."}
                        </p>

                    </div>

                    <button
                        className="modal-close-button"
                        onClick={
                            onClose
                        }
                    >
                        <FiX
                            size={18}
                        />
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

                        <div className="form-group">

                            <label className="ui-label">
                                Zone Name
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
                                placeholder="e.g. Bhopal"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label className="ui-label">
                                Zone Code
                            </label>

                            <input
                                className="ui-input"
                                name="code"
                                value={
                                    form.code
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. BHO"
                                maxLength={
                                    10
                                }
                                required
                            />

                            <p className="ui-help-text">
                                Use a short unique
                                code for the zone.
                            </p>

                        </div>

                        <div className="form-group">

                            <label className="ui-label">
                                Description
                            </label>

                            <textarea
                                className="ui-textarea"
                                name="description"
                                rows="3"
                                value={
                                    form.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Brief description of this delivery zone..."
                            />

                        </div>

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
                                Zone is active
                            </span>

                        </label>

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
                                    <FiGlobe
                                        size={16}
                                    />

                                    {isEditing
                                        ? "Save Changes"
                                        : "Create Zone"}
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default Zones;