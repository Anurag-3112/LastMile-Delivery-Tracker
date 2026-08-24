import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiEdit3,
    FiGlobe,
    FiHome,
    FiLoader,
    FiMapPin,
    FiPlus,
    FiRefreshCw,
    FiSearch,
    FiX,
} from "react-icons/fi";

import {
    createArea,
    getAreas,
    getZones,
    updateArea,
} from "../../api/admin.api";

const Areas = () => {
    const [areas, setAreas] =
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

    const [zoneFilter, setZoneFilter] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    const [showModal, setShowModal] =
        useState(false);

    const [editingArea, setEditingArea] =
        useState(null);

    const loadData = useCallback(
        async (showLoader = true) => {
            try {
                setError("");

                if (showLoader) {
                    setLoading(true);
                }

                const [
                    areasResult,
                    zonesResult,
                ] = await Promise.all([
                    getAreas(),
                    getZones(),
                ]);

                const areasData =
                    areasResult.data;

                const zonesData =
                    zonesResult.data;

                setAreas(
                    Array.isArray(
                        areasData
                    )
                        ? areasData
                        : areasData?.areas ||
                        []
                );

                setZones(
                    Array.isArray(
                        zonesData
                    )
                        ? zonesData
                        : zonesData?.zones ||
                        []
                );
            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load areas"
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredAreas =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return areas.filter(
                (area) => {
                    const zone =
                        area.zoneId ||
                        {};

                    const matchesSearch =
                        !query ||
                        area.name
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        area.code
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        area.pincode
                            ?.toString()
                            .includes(
                                query
                            );

                    const matchesZone =
                        !zoneFilter ||
                        zone._id ===
                        zoneFilter ||
                        area.zoneId ===
                        zoneFilter;

                    const matchesStatus =
                        !statusFilter ||
                        (
                            statusFilter ===
                                "ACTIVE"
                                ? area.isActive
                                : !area.isActive
                        );

                    return (
                        matchesSearch &&
                        matchesZone &&
                        matchesStatus
                    );
                }
            );
        }, [
            areas,
            search,
            zoneFilter,
            statusFilter,
        ]);

    const activeAreas =
        areas.filter(
            (area) =>
                area.isActive
        ).length;

    const inactiveAreas =
        areas.length -
        activeAreas;

    const openCreate =
        () => {
            setEditingArea(null);
            setShowModal(true);
        };

    const openEdit =
        (area) => {
            setEditingArea(area);
            setShowModal(true);
        };

    const closeModal =
        () => {
            setShowModal(false);
            setEditingArea(null);
        };

    const clearFilters =
        () => {
            setSearch("");
            setZoneFilter("");
            setStatusFilter("");
        };

    const handleRefresh =
        async () => {
            setRefreshing(true);

            await loadData(false);
        };

    const getZoneName =
        (area) => {
            if (
                area.zoneId &&
                typeof area.zoneId ===
                "object"
            ) {
                return (
                    area.zoneId.name ||
                    "Unknown Zone"
                );
            }

            const zone =
                zones.find(
                    (item) =>
                        item._id ===
                        area.zoneId
                );

            return (
                zone?.name ||
                "Unassigned"
            );
        };

    return (
        <div className="admin-areas">

            {/* Header */}

            <div className="page-header">

                <div className="page-header-content">

                    <div className="page-header-eyebrow">
                        <FiMapPin
                            size={14}
                        />

                        Service Network
                    </div>

                    <h1 className="page-title">
                        Areas
                    </h1>

                    <p className="page-description">
                        Manage serviceable areas
                        within your delivery
                        zones.
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

                        Add Area
                    </button>

                </div>

            </div>

            {/* Stats */}

            <div className="dashboard-stats">

                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-card-label">
                            Total Areas
                        </span>

                        <div className="stat-card-icon stat-card-icon-blue">
                            <FiMapPin
                                size={18}
                            />
                        </div>

                    </div>

                    <div className="stat-card-value">
                        {areas.length}
                    </div>

                    <div className="stat-card-description">
                        Configured service
                        areas
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-card-label">
                            Active
                        </span>

                        <div className="stat-card-icon stat-card-icon-green">
                            <FiHome
                                size={18}
                            />
                        </div>

                    </div>

                    <div className="stat-card-value">
                        {activeAreas}
                    </div>

                    <div className="stat-card-description">
                        Currently serviceable
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-card-top">

                        <span className="stat-card-label">
                            Inactive
                        </span>

                        <div className="stat-card-icon stat-card-icon-gray">
                            <FiGlobe
                                size={18}
                            />
                        </div>

                    </div>

                    <div className="stat-card-value">
                        {inactiveAreas}
                    </div>

                    <div className="stat-card-description">
                        Currently disabled
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

                            Find Areas
                        </div>

                        <p>
                            Search by area,
                            pincode, zone, or
                            status.
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
                            placeholder="Search area, code or pincode..."
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
                        value={zoneFilter}
                        onChange={(e) =>
                            setZoneFilter(
                                e.target.value
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
                            Service Areas
                        </h2>

                        <p>
                            {
                                filteredAreas.length
                            }{" "}
                            areas shown
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
                            Loading areas...
                        </span>

                    </div>
                ) : filteredAreas.length ===
                    0 ? (
                    <div className="admin-empty-state">

                        <div className="admin-empty-icon">
                            <FiMapPin
                                size={24}
                            />
                        </div>

                        <h3>
                            No areas found
                        </h3>

                        <p>
                            Add a serviceable
                            area to one of
                            your delivery
                            zones.
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

                            Add Area
                        </button>

                    </div>
                ) : (
                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>
                                <tr>
                                    <th>
                                        Area
                                    </th>

                                    <th>
                                        Code
                                    </th>

                                    <th>
                                        Pincode
                                    </th>

                                    <th>
                                        Zone
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
                                {filteredAreas.map(
                                    (
                                        area
                                    ) => (
                                        <tr
                                            key={
                                                area._id
                                            }
                                        >

                                            <td>
                                                <div className="order-customer-cell">

                                                    <strong>
                                                        {
                                                            area.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        Service
                                                        Area
                                                    </span>

                                                </div>
                                            </td>

                                            <td>
                                                <span className="code-badge">
                                                    {
                                                        area.code
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        area.pincode
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                <div className="zone-cell">

                                                    <FiGlobe
                                                        size={14}
                                                    />

                                                    <span>
                                                        {getZoneName(
                                                            area
                                                        )}
                                                    </span>

                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        area.isActive
                                                            ? "agent-status-badge agent-status-available"
                                                            : "agent-status-badge agent-status-offline"
                                                    }
                                                >
                                                    <span className="status-dot" />

                                                    {area.isActive
                                                        ? "ACTIVE"
                                                        : "INACTIVE"}
                                                </span>
                                            </td>

                                            <td>
                                                <button
                                                    className="icon-button"
                                                    title="Edit area"
                                                    onClick={() =>
                                                        openEdit(
                                                            area
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

            {/* Modal */}

            {showModal && (
                <AreaModal
                    area={
                        editingArea
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

const AreaModal = ({
    area,
    zones,
    onClose,
    onSuccess,
}) => {
    const isEditing =
        Boolean(area);

    const zoneId =
        area?.zoneId &&
            typeof area.zoneId ===
            "object"
            ? area.zoneId._id
            : area?.zoneId || "";

    const [form, setForm] =
        useState({
            name:
                area?.name || "",

            code:
                area?.code || "",

            pincode:
                area?.pincode ||
                "",

            zoneId,

            isActive:
                area?.isActive !==
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

            if (!form.zoneId) {
                setError(
                    "Please select a zone"
                );

                return;
            }

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

                    pincode:
                        String(
                            form.pincode
                        ).trim(),

                    zoneId:
                        form.zoneId,

                    isActive:
                        form.isActive,
                };

                if (isEditing) {
                    await updateArea(
                        area._id,
                        payload
                    );
                } else {
                    await createArea(
                        payload
                    );
                }

                onSuccess();
            } catch (error) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to save area"
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
                                ? "Edit Area"
                                : "Create Area"}
                        </h2>

                        <p>
                            {isEditing
                                ? "Update the service area configuration."
                                : "Add a serviceable area to a delivery zone."}
                        </p>

                    </div>

                    <button
                        type="button"
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
                                Area Name
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
                                placeholder="e.g. MP Nagar"
                                required
                            />

                        </div>

                        <div className="form-grid">

                            <div className="form-group">

                                <label className="ui-label">
                                    Area Code
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
                                    placeholder="e.g. MPN"
                                    maxLength={
                                        10
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label className="ui-label">
                                    Pincode
                                </label>

                                <input
                                    className="ui-input"
                                    name="pincode"
                                    value={
                                        form.pincode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. 462011"
                                    inputMode="numeric"
                                    maxLength={
                                        6
                                    }
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label className="ui-label">
                                Delivery Zone
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
                                required
                            >

                                <option value="">
                                    Select a zone
                                </option>

                                {zones
                                    .filter(
                                        (
                                            zone
                                        ) =>
                                            zone.isActive
                                    )
                                    .map(
                                        (
                                            zone
                                        ) => (
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
                                                }{" "}
                                                (
                                                {
                                                    zone.code
                                                }
                                                )
                                            </option>
                                        )
                                    )}

                            </select>

                            <p className="ui-help-text">
                                Only active zones
                                can receive new
                                service areas.
                            </p>

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
                                Area is active
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
                                    <FiMapPin
                                        size={16}
                                    />

                                    {isEditing
                                        ? "Save Changes"
                                        : "Create Area"}
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default Areas;