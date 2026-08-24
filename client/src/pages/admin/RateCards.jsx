import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiCheckCircle,
    FiEdit3,
    FiLoader,
    FiPlus,
    FiRefreshCw,
    FiSearch,
    FiSliders,
    FiToggleLeft,
    FiX,
} from "react-icons/fi";

import {
    getRateCards,
    createRateCard,
    updateRateCard,
} from "../../api/admin.api";

const AdminRateCards = () => {
    const [rateCards, setRateCards] =
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

    const [editingRateCard, setEditingRateCard] =
        useState(null);

    const loadData = async (
        showLoader = true
    ) => {
        try {
            setError("");

            if (showLoader) {
                setLoading(true);
            }

            const result =
                await getRateCards();

            const data =
                result.data;

            setRateCards(
                Array.isArray(data)
                    ? data
                    : data?.rateCards || []
            );
        } catch (error) {
            setError(
                error.response?.data
                    ?.message ||
                "Unable to load rate cards"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const filteredRateCards =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return rateCards.filter(
                (card) => {
                    const matchesSearch =
                        !query ||
                        card.orderType
                            ?.toLowerCase()
                            .includes(
                                query
                            ) ||
                        card.zoneType
                            ?.toLowerCase()
                            .includes(
                                query
                            );

                    const matchesStatus =
                        !statusFilter ||
                        (
                            statusFilter ===
                                "ACTIVE"
                                ? card.isActive
                                : !card.isActive
                        );

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );
        },
            [
                rateCards,
                search,
                statusFilter,
            ]
        );

    const activeCards =
        rateCards.filter(
            (card) =>
                card.isActive
        ).length;

    const inactiveCards =
        rateCards.length -
        activeCards;

    const openCreate =
        () => {
            setEditingRateCard(null);
            setShowModal(true);
        };

    const openEdit =
        (rateCard) => {
            setEditingRateCard(
                rateCard
            );

            setShowModal(true);
        };

    const closeModal =
        () => {
            setShowModal(false);
            setEditingRateCard(null);
        };

    const handleRefresh =
        async () => {
            setRefreshing(true);

            await loadData(false);
        };

    const clearFilters =
        () => {
            setSearch("");
            setStatusFilter("");
        };

    const formatMoney =
        (value) => {
            return `₹${Number(
                value || 0
            ).toLocaleString(
                "en-IN"
            )}`;
        };

    return (
        <div className="admin-rate-cards">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-eyebrow">
                        <FiSliders
                            size={14}
                        />

                        Pricing Configuration
                    </div>

                    <h1 className="page-title">
                        Rate Cards
                    </h1>

                    <p className="page-description">
                        Configure pricing by
                        order type, zone type,
                        weight slabs, and COD.
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

                        Add Rate Card
                    </button>
                </div>
            </div>

            {/* Stats */}

            <div className="dashboard-stats">
                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Total Rate Cards
                        </span>

                        <div className="stat-card-icon stat-card-icon-blue">
                            <FiSliders
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {rateCards.length}
                    </div>

                    <div className="stat-card-description">
                        Configured pricing
                        rules
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card-top">
                        <span className="stat-card-label">
                            Active
                        </span>

                        <div className="stat-card-icon stat-card-icon-green">
                            <FiCheckCircle
                                size={18}
                            />
                        </div>
                    </div>

                    <div className="stat-card-value">
                        {activeCards}
                    </div>

                    <div className="stat-card-description">
                        Currently used for
                        pricing
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
                        {inactiveCards}
                    </div>

                    <div className="stat-card-description">
                        Disabled pricing
                        rules
                    </div>
                </div>
            </div>

            {/* Explanation */}

            <section className="pricing-info-card">
                <div className="pricing-info-icon">
                    <FiSliders
                        size={20}
                    />
                </div>

                <div>
                    <h3>
                        How delivery pricing
                        works
                    </h3>

                    <p>
                        Rate cards are selected
                        using the order type and
                        zone type. The applicable
                        weight slab determines
                        the delivery charge.
                    </p>
                </div>
            </section>

            {/* Filters */}

            <section className="orders-filter-panel">
                <div className="orders-filter-header">
                    <div>
                        <div className="orders-filter-title">
                            <FiSearch
                                size={16}
                            />

                            Find Rate Cards
                        </div>

                        <p>
                            Search by order type
                            or zone type.
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
                            placeholder="Search B2B, B2C, INTRA or INTER..."
                            value={
                                search
                            }
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
                            statusFilter
                        }
                        onChange={(e) =>
                            setStatusFilter(
                                e.target
                                    .value
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

            {error && (
                <div className="admin-inline-error">
                    {error}
                </div>
            )}

            {/* Rate Cards */}

            {loading ? (
                <div className="admin-table-card">
                    <div className="admin-table-loading">
                        <FiLoader
                            size={20}
                            className="spin"
                        />

                        <span>
                            Loading rate cards...
                        </span>
                    </div>
                </div>
            ) : filteredRateCards.length ===
                0 ? (
                <section className="admin-table-card">
                    <div className="admin-empty-state">
                        <div className="admin-empty-icon">
                            <FiSliders
                                size={24}
                            />
                        </div>

                        <h3>
                            No rate cards found
                        </h3>

                        <p>
                            Create a rate card
                            to configure
                            delivery pricing.
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

                            Add Rate Card
                        </button>
                    </div>
                </section>
            ) : (
                <div className="rate-card-grid">
                    {filteredRateCards.map(
                        (rateCard) => (
                            <RateCardItem
                                key={
                                    rateCard._id
                                }
                                rateCard={
                                    rateCard
                                }
                                formatMoney={
                                    formatMoney
                                }
                                onEdit={
                                    openEdit
                                }
                            />
                        )
                    )}
                </div>
            )}

            {showModal && (
                <RateCardModal
                    rateCard={
                        editingRateCard
                    }
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

const RateCardItem = ({
    rateCard,
    formatMoney,
    onEdit,
}) => {
    return (
        <article className="rate-card">
            <div className="rate-card-header">
                <div>
                    <div className="rate-card-eyebrow">
                        RATE CARD
                    </div>

                    <h2>
                        {
                            rateCard.orderType
                        }{" "}
                        ·{" "}
                        {
                            rateCard.zoneType
                        }
                    </h2>

                    <span className="rate-card-zone">
                        {
                            rateCard.zoneType ===
                                "INTRA"
                                ? "Same Zone"
                                : "Inter Zone"
                        }
                    </span>
                </div>

                <span
                    className={
                        rateCard.isActive
                            ? "agent-status-badge agent-status-available"
                            : "agent-status-badge agent-status-offline"
                    }
                >
                    <span className="status-dot" />

                    {rateCard.isActive
                        ? "ACTIVE"
                        : "INACTIVE"}
                </span>
            </div>

            <div className="rate-card-pricing">
                <div>
                    <span>
                        COD Surcharge
                    </span>

                    <strong>
                        {formatMoney(
                            rateCard.codSurcharge
                        )}
                    </strong>
                </div>

                <div>
                    <span>
                        Weight Slabs
                    </span>

                    <strong>
                        {
                            rateCard.slabs
                                ?.length || 0
                        }
                    </strong>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection:
                        "column",
                    gap: "8px",
                    marginTop: "16px",
                }}
            >
                {rateCard.slabs?.map(
                    (
                        slab,
                        index
                    ) => (
                        <div
                            key={
                                index
                            }
                            style={{
                                display:
                                    "flex",
                                justifyContent:
                                    "space-between",
                                gap: "12px",
                            }}
                        >
                            <span>
                                {slab.minWeight} kg
                                {" – "}
                                {slab.maxWeight} kg
                            </span>

                            <strong>
                                {formatMoney(
                                    slab.rate
                                )}
                            </strong>
                        </div>
                    )
                )}
            </div>

            <div className="rate-card-footer">
                <span>
                    Updated{" "}
                    {rateCard.updatedAt
                        ? new Date(
                            rateCard.updatedAt
                        ).toLocaleDateString(
                            "en-IN"
                        )
                        : "—"}
                </span>

                <button
                    className="ui-button ui-button-secondary ui-button-sm"
                    onClick={() =>
                        onEdit(
                            rateCard
                        )
                    }
                >
                    <FiEdit3
                        size={14}
                    />

                    Edit
                </button>
            </div>
        </article>
    );
};

const RateCardModal = ({
    rateCard,
    onClose,
    onSuccess,
}) => {
    const isEditing =
        Boolean(rateCard);

    const [form, setForm] =
        useState(() => ({
            orderType:
                rateCard?.orderType ||
                "B2C",

            zoneType:
                rateCard?.zoneType ||
                "INTER",

            slabs:
                rateCard?.slabs?.length
                    ? rateCard.slabs.map(
                        (slab) => ({
                            minWeight:
                                slab.minWeight,
                            maxWeight:
                                slab.maxWeight,
                            rate:
                                slab.rate,
                        })
                    )
                    : [
                        {
                            minWeight: 0,
                            maxWeight: 1,
                            rate: 50,
                        },
                    ],

            codSurcharge:
                rateCard?.codSurcharge ??
                0,

            isActive:
                rateCard?.isActive !==
                false,
        }));

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

    const handleSlabChange =
        (
            index,
            field,
            value
        ) => {
            setForm(
                (current) => {
                    const slabs =
                        [
                            ...current.slabs,
                        ];

                    slabs[index] = {
                        ...slabs[
                        index
                        ],
                        [field]:
                            value,
                    };

                    return {
                        ...current,
                        slabs,
                    };
                }
            );
        };

    const addSlab =
        () => {
            setForm(
                (current) => {
                    const last =
                        current
                            .slabs[
                        current.slabs.length -
                        1
                        ];

                    const minWeight =
                        Number(
                            last?.maxWeight ||
                            0
                        );

                    return {
                        ...current,

                        slabs: [
                            ...current.slabs,

                            {
                                minWeight,
                                maxWeight:
                                    minWeight +
                                    1,
                                rate: 50,
                            },
                        ],
                    };
                }
            );
        };

    const removeSlab =
        (index) => {
            setForm(
                (current) => {
                    if (
                        current.slabs
                            .length <=
                        1
                    ) {
                        return current;
                    }

                    return {
                        ...current,

                        slabs:
                            current.slabs.filter(
                                (
                                    _,
                                    slabIndex
                                ) =>
                                    slabIndex !==
                                    index
                            ),
                    };
                }
            );
        };

    const validateForm =
        () => {
            if (
                ![
                    "B2B",
                    "B2C",
                ].includes(
                    form.orderType
                )
            ) {
                return "Select a valid order type.";
            }

            if (
                ![
                    "INTRA",
                    "INTER",
                ].includes(
                    form.zoneType
                )
            ) {
                return "Select a valid zone type.";
            }

            if (
                !form.slabs.length
            ) {
                return "At least one weight slab is required.";
            }

            const slabs =
                form.slabs.map(
                    (slab) => ({
                        minWeight:
                            Number(
                                slab.minWeight
                            ),

                        maxWeight:
                            Number(
                                slab.maxWeight
                            ),

                        rate:
                            Number(
                                slab.rate
                            ),
                    })
                );

            for (
                let i = 0;
                i < slabs.length;
                i++
            ) {
                const slab =
                    slabs[i];

                if (
                    !Number.isFinite(
                        slab.minWeight
                    ) ||
                    !Number.isFinite(
                        slab.maxWeight
                    ) ||
                    !Number.isFinite(
                        slab.rate
                    )
                ) {
                    return `Invalid values in slab ${i + 1
                        }.`;
                }

                if (
                    slab.minWeight <
                    0
                ) {
                    return `Minimum weight in slab ${i + 1
                        } cannot be negative.`;
                }

                if (
                    slab.maxWeight <=
                    slab.minWeight
                ) {
                    return `Maximum weight must be greater than minimum weight in slab ${i + 1
                        }.`;
                }

                if (
                    slab.rate < 0
                ) {
                    return `Rate in slab ${i + 1
                        } cannot be negative.`;
                }
            }

            const sortedSlabs =
                [...slabs].sort(
                    (
                        a,
                        b
                    ) =>
                        a.minWeight -
                        b.minWeight
                );

            for (
                let i = 1;
                i <
                sortedSlabs.length;
                i++
            ) {
                if (
                    sortedSlabs[
                        i
                    ].minWeight <
                    sortedSlabs[
                        i - 1
                    ].maxWeight
                ) {
                    return "Weight slabs cannot overlap.";
                }
            }

            if (
                Number(
                    form.codSurcharge
                ) < 0
            ) {
                return "COD surcharge cannot be negative.";
            }

            return null;
        };

    const handleSubmit =
        async (e) => {
            e.preventDefault();

            const validationError =
                validateForm();

            if (
                validationError
            ) {
                setError(
                    validationError
                );

                return;
            }

            try {
                setSubmitting(true);
                setError("");

                const payload = {
                    orderType:
                        form.orderType,

                    zoneType:
                        form.zoneType,

                    slabs:
                        form.slabs.map(
                            (
                                slab
                            ) => ({
                                minWeight:
                                    Number(
                                        slab.minWeight
                                    ),

                                maxWeight:
                                    Number(
                                        slab.maxWeight
                                    ),

                                rate:
                                    Number(
                                        slab.rate
                                    ),
                            })
                        ),

                    codSurcharge:
                        Number(
                            form.codSurcharge
                        ),

                    isActive:
                        form.isActive,
                };

                console.log(
                    "Creating/updating rate card:",
                    payload
                );

                if (isEditing) {
                    await updateRateCard(
                        rateCard._id,
                        payload
                    );
                } else {
                    await createRateCard(
                        payload
                    );
                }

                onSuccess();
            } catch (error) {
                console.error(
                    "Rate card error:",
                    error
                );

                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to save rate card"
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
                                ? "Edit Rate Card"
                                : "Create Rate Card"}
                        </h2>

                        <p>
                            Configure order
                            type, zone type,
                            weight slabs and
                            COD surcharge.
                        </p>
                    </div>

                    <button
                        type="button"
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

                        {/* Order Type */}

                        <div className="form-group">
                            <label className="ui-label">
                                Order Type
                            </label>

                            <select
                                className="ui-select ui-select-full"
                                name="orderType"
                                value={
                                    form.orderType
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="B2C">
                                    B2C
                                </option>

                                <option value="B2B">
                                    B2B
                                </option>
                            </select>
                        </div>

                        {/* Zone Type */}

                        <div className="form-group">
                            <label className="ui-label">
                                Zone Type
                            </label>

                            <select
                                className="ui-select ui-select-full"
                                name="zoneType"
                                value={
                                    form.zoneType
                                }
                                onChange={
                                    handleChange
                                }
                            >
                                <option value="INTRA">
                                    INTRA — Same
                                    Zone
                                </option>

                                <option value="INTER">
                                    INTER — Different
                                    Zone
                                </option>
                            </select>
                        </div>

                        {/* COD */}

                        <div className="form-group">
                            <label className="ui-label">
                                COD Surcharge
                            </label>

                            <div className="money-input">
                                <span>
                                    ₹
                                </span>

                                <input
                                    className="ui-input"
                                    name="codSurcharge"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        form.codSurcharge
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />
                            </div>
                        </div>

                        {/* Weight slabs */}

                        <div className="pricing-form-section">
                            <div
                                style={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    marginBottom:
                                        "16px",
                                }}
                            >
                                <div className="pricing-form-section-title">
                                    Weight Slabs
                                </div>

                                <button
                                    type="button"
                                    className="ui-button ui-button-secondary ui-button-sm"
                                    onClick={
                                        addSlab
                                    }
                                >
                                    <FiPlus
                                        size={14}
                                    />

                                    Add Slab
                                </button>
                            </div>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexDirection:
                                        "column",
                                    gap: "12px",
                                }}
                            >
                                {form.slabs.map(
                                    (
                                        slab,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            className="form-grid"
                                        >
                                            <div className="form-group">
                                                <label className="ui-label">
                                                    Min KG
                                                </label>

                                                <input
                                                    className="ui-input"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        slab.minWeight
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleSlabChange(
                                                            index,
                                                            "minWeight",
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="ui-label">
                                                    Max KG
                                                </label>

                                                <input
                                                    className="ui-input"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={
                                                        slab.maxWeight
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleSlabChange(
                                                            index,
                                                            "maxWeight",
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label className="ui-label">
                                                    Rate
                                                </label>

                                                <div className="money-input">
                                                    <span>
                                                        ₹
                                                    </span>

                                                    <input
                                                        className="ui-input"
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={
                                                            slab.rate
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            handleSlabChange(
                                                                index,
                                                                "rate",
                                                                e
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "end",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="icon-button"
                                                    title="Remove slab"
                                                    onClick={() =>
                                                        removeSlab(
                                                            index
                                                        )
                                                    }
                                                    disabled={
                                                        form
                                                            .slabs
                                                            .length <=
                                                        1
                                                    }
                                                >
                                                    <FiX
                                                        size={
                                                            16
                                                        }
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Active */}

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
                                Rate card is active
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
                                    <FiCheckCircle
                                        size={16}
                                    />

                                    {isEditing
                                        ? "Save Changes"
                                        : "Create Rate Card"}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminRateCards;