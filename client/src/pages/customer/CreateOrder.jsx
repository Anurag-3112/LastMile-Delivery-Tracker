import {
    useEffect,
    useState,
} from "react";

import {
    FiArrowLeft,
    FiArrowRight,
    FiCheckCircle,
    FiClock,
    FiMapPin,
    FiPackage,
    FiRefreshCw,
} from "react-icons/fi";

import {
    useNavigate,
} from "react-router-dom";

import {
    getQuote,
    createOrder,
} from "../../api/order.api";

import {
    getAreas,
} from "../../api/area.api";

import PriceBreakdown from
    "../../components/orders/PriceBreakdown";

const CreateOrder = () => {
    const navigate =
        useNavigate();

    const [form, setForm] =
        useState({
            pickupAreaId: "",
            pickupAddress: "",

            dropAreaId: "",
            dropAddress: "",

            length: "",
            breadth: "",
            height: "",
            actualWeight: "",

            orderType: "B2C",
            paymentType: "PREPAID",
        });

    const [areas, setAreas] =
        useState([]);

    const [quote, setQuote] =
        useState(null);

    const [createdOrder, setCreatedOrder] =
        useState(null);

    const [loadingAreas, setLoadingAreas] =
        useState(true);

    const [loadingQuote, setLoadingQuote] =
        useState(false);

    const [creating, setCreating] =
        useState(false);

    const [error, setError] =
        useState("");

    const [step, setStep] =
        useState(1);

    useEffect(() => {
        const loadAreas =
            async () => {
                try {
                    setLoadingAreas(true);
                    setError("");

                    const result =
                        await getAreas();

                    setAreas(
                        result.data
                            ?.areas || []
                    );
                } catch (error) {
                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load service areas"
                    );
                } finally {
                    setLoadingAreas(false);
                }
            };

        loadAreas();
    }, []);

    const pickupArea =
        areas.find(
            (area) =>
                area._id ===
                form.pickupAreaId
        );

    const dropArea =
        areas.find(
            (area) =>
                area._id ===
                form.dropAreaId
        );

    const handleChange =
        (e) => {
            const {
                name,
                value,
            } = e.target;

            setForm(
                (current) => ({
                    ...current,
                    [name]: value,
                })
            );

            setError("");

            if (
                [
                    "pickupAreaId",
                    "dropAreaId",
                    "pickupAddress",
                    "dropAddress",
                    "length",
                    "breadth",
                    "height",
                    "actualWeight",
                    "orderType",
                    "paymentType",
                ].includes(name)
            ) {
                setQuote(null);
            }
        };

    const validateStepOne =
        () => {
            if (
                !form.pickupAreaId
            ) {
                setError(
                    "Please select a pickup area."
                );

                return false;
            }

            if (
                !form.pickupAddress.trim()
            ) {
                setError(
                    "Please enter the pickup address."
                );

                return false;
            }

            if (
                !form.dropAreaId
            ) {
                setError(
                    "Please select a drop area."
                );

                return false;
            }

            if (
                !form.dropAddress.trim()
            ) {
                setError(
                    "Please enter the delivery address."
                );

                return false;
            }

            if (
                form.pickupAreaId ===
                form.dropAreaId
            ) {
                /*
                 * Same-area delivery is valid
                 * because the backend can classify
                 * it as INTRA based on zones.
                 *
                 * We therefore do NOT block it.
                 */
            }

            return true;
        };

    const validateStepTwo =
        () => {
            const values = [
                form.length,
                form.breadth,
                form.height,
                form.actualWeight,
            ];

            const invalid =
                values.some(
                    (value) =>
                        !value ||
                        Number(
                            value
                        ) <= 0
                );

            if (invalid) {
                setError(
                    "Please enter valid package dimensions and weight."
                );

                return false;
            }

            return true;
        };

    const goToPackage =
        () => {
            setError("");

            if (
                validateStepOne()
            ) {
                setStep(2);
            }
        };

    const calculateQuote =
        async () => {
            setError("");

            if (
                !validateStepOne() ||
                !validateStepTwo()
            ) {
                return;
            }

            setLoadingQuote(true);
            setQuote(null);

            try {
                const payload = {
                    pickupAreaId:
                        form.pickupAreaId,

                    dropAreaId:
                        form.dropAreaId,

                    length:
                        Number(
                            form.length
                        ),

                    breadth:
                        Number(
                            form.breadth
                        ),

                    height:
                        Number(
                            form.height
                        ),

                    actualWeight:
                        Number(
                            form.actualWeight
                        ),

                    orderType:
                        form.orderType,

                    paymentType:
                        form.paymentType,
                };

                const result =
                    await getQuote(
                        payload
                    );

                setQuote(
                    result.data?.quote
                );

                setStep(3);
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to calculate delivery quote."
                );
            } finally {
                setLoadingQuote(false);
            }
        };

    const handleCreateOrder =
        async () => {
            if (!quote) {
                setError(
                    "Please calculate the delivery quote first."
                );

                return;
            }

            setCreating(true);
            setError("");

            try {
                /*
                 * IMPORTANT:
                 *
                 * We send only the information
                 * required by order.service.js.
                 *
                 * Pricing is NOT trusted from
                 * the frontend.
                 *
                 * The backend recalculates the
                 * quote when creating the order.
                 */

                const payload = {
                    pickup: {
                        address:
                            form.pickupAddress.trim(),

                        areaId:
                            form.pickupAreaId,
                    },

                    drop: {
                        address:
                            form.dropAddress.trim(),

                        areaId:
                            form.dropAreaId,
                    },

                    package: {
                        length:
                            Number(
                                form.length
                            ),

                        breadth:
                            Number(
                                form.breadth
                            ),

                        height:
                            Number(
                                form.height
                            ),

                        actualWeight:
                            Number(
                                form.actualWeight
                            ),
                    },

                    orderType:
                        form.orderType,

                    paymentType:
                        form.paymentType,
                };

                const result =
                    await createOrder(
                        payload
                    );

                setCreatedOrder(
                    result.data?.order
                );

                setStep(4);
            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to create shipment."
                );
            } finally {
                setCreating(false);
            }
        };

    const resetForm =
        () => {
            setForm({
                pickupAreaId: "",
                pickupAddress: "",

                dropAreaId: "",
                dropAddress: "",

                length: "",
                breadth: "",
                height: "",
                actualWeight: "",

                orderType: "B2C",
                paymentType: "PREPAID",
            });

            setQuote(null);
            setCreatedOrder(null);
            setError("");
            setStep(1);
        };

    return (
        <div className="create-order-page">
            {/* Header */}

            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-header-eyebrow">
                        Shipment Management
                    </div>

                    <h1 className="page-title">
                        Create Shipment
                    </h1>

                    <p className="page-description">
                        Enter your shipment
                        details, review the
                        delivery quote, and
                        confirm your order.
                    </p>
                </div>
            </div>

            {/* Stepper */}

            <div className="shipment-stepper">
                <Step
                    number={1}
                    label="Locations"
                    active={step === 1}
                    completed={step > 1}
                />

                <div
                    className={
                        step > 1
                            ? "stepper-line completed"
                            : "stepper-line"
                    }
                />

                <Step
                    number={2}
                    label="Package"
                    active={step === 2}
                    completed={step > 2}
                />

                <div
                    className={
                        step > 2
                            ? "stepper-line completed"
                            : "stepper-line"
                    }
                />

                <Step
                    number={3}
                    label="Quote"
                    active={step === 3}
                    completed={step > 3}
                />

                <div
                    className={
                        step > 3
                            ? "stepper-line completed"
                            : "stepper-line"
                    }
                />

                <Step
                    number={4}
                    label="Confirmation"
                    active={step === 4}
                    completed={false}
                />
            </div>

            {/* Error */}

            {error && (
                <div className="form-error-banner">
                    {error}
                </div>
            )}

            {/* STEP 1 */}

            {step === 1 && (
                <div className="shipment-form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <FiMapPin
                                size={20}
                            />
                        </div>

                        <div>
                            <h2>
                                Pickup & Delivery
                            </h2>

                            <p>
                                Tell us where the
                                shipment is coming
                                from and where it
                                needs to go.
                            </p>
                        </div>
                    </div>

                    {loadingAreas ? (
                        <div className="form-loading">
                            <FiRefreshCw
                                size={18}
                                className="spin"
                            />

                            Loading service
                            areas...
                        </div>
                    ) : (
                        <>
                            <div className="location-grid">
                                {/* Pickup */}

                                <div className="location-panel">
                                    <div className="location-panel-header">
                                        <span className="location-marker pickup-marker">
                                            1
                                        </span>

                                        <div>
                                            <h3>
                                                Pickup
                                            </h3>

                                            <p>
                                                Where
                                                should we
                                                collect
                                                the
                                                shipment?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="ui-label">
                                            Pickup Area
                                        </label>

                                        <select
                                            className="ui-select ui-select-full"
                                            name="pickupAreaId"
                                            value={
                                                form.pickupAreaId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >
                                            <option value="">
                                                Select pickup
                                                area
                                            </option>

                                            {areas.map(
                                                (
                                                    area
                                                ) => (
                                                    <option
                                                        key={
                                                            area._id
                                                        }
                                                        value={
                                                            area._id
                                                        }
                                                    >
                                                        {
                                                            area.name
                                                        }{" "}
                                                        —{" "}
                                                        {
                                                            area
                                                                .zoneId
                                                                ?.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="ui-label">
                                            Pickup Address
                                        </label>

                                        <textarea
                                            className="ui-textarea"
                                            name="pickupAddress"
                                            value={
                                                form.pickupAddress
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter complete pickup address"
                                            rows={4}
                                        />
                                    </div>

                                    {pickupArea && (
                                        <div className="location-zone-info">
                                            Zone:{" "}
                                            <strong>
                                                {
                                                    pickupArea
                                                        .zoneId
                                                        ?.name
                                                }
                                            </strong>
                                        </div>
                                    )}
                                </div>

                                {/* Drop */}

                                <div className="location-panel">
                                    <div className="location-panel-header">
                                        <span className="location-marker drop-marker">
                                            2
                                        </span>

                                        <div>
                                            <h3>
                                                Delivery
                                            </h3>

                                            <p>
                                                Where
                                                should we
                                                deliver
                                                the
                                                shipment?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="ui-label">
                                            Delivery Area
                                        </label>

                                        <select
                                            className="ui-select ui-select-full"
                                            name="dropAreaId"
                                            value={
                                                form.dropAreaId
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >
                                            <option value="">
                                                Select delivery
                                                area
                                            </option>

                                            {areas.map(
                                                (
                                                    area
                                                ) => (
                                                    <option
                                                        key={
                                                            area._id
                                                        }
                                                        value={
                                                            area._id
                                                        }
                                                    >
                                                        {
                                                            area.name
                                                        }{" "}
                                                        —{" "}
                                                        {
                                                            area
                                                                .zoneId
                                                                ?.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="ui-label">
                                            Delivery Address
                                        </label>

                                        <textarea
                                            className="ui-textarea"
                                            name="dropAddress"
                                            value={
                                                form.dropAddress
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Enter complete delivery address"
                                            rows={4}
                                        />
                                    </div>

                                    {dropArea && (
                                        <div className="location-zone-info">
                                            Zone:{" "}
                                            <strong>
                                                {
                                                    dropArea
                                                        .zoneId
                                                        ?.name
                                                }
                                            </strong>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-card-footer">
                                <button
                                    type="button"
                                    className="ui-button ui-button-primary ui-button-md"
                                    onClick={
                                        goToPackage
                                    }
                                >
                                    Continue

                                    <FiArrowRight
                                        size={16}
                                    />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* STEP 2 */}

            {step === 2 && (
                <div className="shipment-form-card">
                    <div className="form-card-header">
                        <div className="form-card-icon">
                            <FiPackage
                                size={20}
                            />
                        </div>

                        <div>
                            <h2>
                                Package Details
                            </h2>

                            <p>
                                Enter accurate
                                dimensions and
                                weight so we can
                                calculate the
                                correct delivery
                                charge.
                            </p>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>
                            Package Dimensions
                        </h3>

                        <p>
                            Enter dimensions in
                            centimeters.
                        </p>

                        <div className="form-grid-3">
                            <NumberField
                                label="Length"
                                name="length"
                                value={
                                    form.length
                                }
                                onChange={
                                    handleChange
                                }
                                suffix="cm"
                            />

                            <NumberField
                                label="Breadth"
                                name="breadth"
                                value={
                                    form.breadth
                                }
                                onChange={
                                    handleChange
                                }
                                suffix="cm"
                            />

                            <NumberField
                                label="Height"
                                name="height"
                                value={
                                    form.height
                                }
                                onChange={
                                    handleChange
                                }
                                suffix="cm"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>
                            Weight
                        </h3>

                        <div className="form-grid-2">
                            <NumberField
                                label="Actual Weight"
                                name="actualWeight"
                                value={
                                    form.actualWeight
                                }
                                onChange={
                                    handleChange
                                }
                                suffix="kg"
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>
                            Order Preferences
                        </h3>

                        <div className="form-grid-2">
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

                            <div className="form-group">
                                <label className="ui-label">
                                    Payment Type
                                </label>

                                <select
                                    className="ui-select ui-select-full"
                                    name="paymentType"
                                    value={
                                        form.paymentType
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >
                                    <option value="PREPAID">
                                        Prepaid
                                    </option>

                                    <option value="COD">
                                        Cash on Delivery
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-card-footer form-card-footer-between">
                        <button
                            type="button"
                            className="ui-button ui-button-secondary ui-button-md"
                            onClick={() => {
                                setError("");
                                setStep(1);
                            }}
                        >
                            <FiArrowLeft
                                size={16}
                            />

                            Back
                        </button>

                        <button
                            type="button"
                            className="ui-button ui-button-primary ui-button-md"
                            onClick={
                                calculateQuote
                            }
                            disabled={
                                loadingQuote
                            }
                        >
                            {loadingQuote ? (
                                <>
                                    <FiRefreshCw
                                        size={16}
                                        className="spin"
                                    />

                                    Calculating...
                                </>
                            ) : (
                                <>
                                    Get Quote

                                    <FiArrowRight
                                        size={16}
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* STEP 3 */}

            {step === 3 && quote && (
                <div className="shipment-review-layout">
                    <div className="shipment-form-card">
                        <div className="form-card-header">
                            <div className="form-card-icon">
                                <FiCheckCircle
                                    size={20}
                                />
                            </div>

                            <div>
                                <h2>
                                    Review Shipment
                                </h2>

                                <p>
                                    Check your
                                    shipment
                                    details before
                                    confirming.
                                </p>
                            </div>
                        </div>

                        <div className="review-section">
                            <div className="review-section-header">
                                <h3>
                                    Delivery
                                    Route
                                </h3>

                                <button
                                    className="text-button"
                                    onClick={() =>
                                        setStep(
                                            1
                                        )
                                    }
                                    disabled={
                                        creating
                                    }
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="review-route">
                                <div>
                                    <span>
                                        PICKUP
                                    </span>

                                    <strong>
                                        {
                                            pickupArea
                                                ?.name
                                        }
                                    </strong>

                                    <p>
                                        {
                                            form.pickupAddress
                                        }
                                    </p>
                                </div>

                                <div>
                                    <span>
                                        DELIVERY
                                    </span>

                                    <strong>
                                        {
                                            dropArea
                                                ?.name
                                        }
                                    </strong>

                                    <p>
                                        {
                                            form.dropAddress
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="review-section">
                            <div className="review-section-header">
                                <h3>
                                    Package
                                </h3>

                                <button
                                    className="text-button"
                                    onClick={() =>
                                        setStep(
                                            2
                                        )
                                    }
                                    disabled={
                                        creating
                                    }
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="review-grid">
                                <ReviewItem
                                    label="Dimensions"
                                    value={`${form.length} × ${form.breadth} × ${form.height} cm`}
                                />

                                <ReviewItem
                                    label="Actual Weight"
                                    value={`${form.actualWeight} kg`}
                                />

                                <ReviewItem
                                    label="Billable Weight"
                                    value={`${quote.billableWeight} kg`}
                                />

                                <ReviewItem
                                    label="Order Type"
                                    value={
                                        form.orderType
                                    }
                                />

                                <ReviewItem
                                    label="Payment"
                                    value={
                                        form.paymentType ===
                                            "COD"
                                            ? "Cash on Delivery"
                                            : "Prepaid"
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-card-footer form-card-footer-between">
                            <button
                                type="button"
                                className="ui-button ui-button-secondary ui-button-md"
                                onClick={() =>
                                    setStep(
                                        2
                                    )
                                }
                                disabled={
                                    creating
                                }
                            >
                                <FiArrowLeft
                                    size={16}
                                />

                                Back
                            </button>

                            <button
                                type="button"
                                className="ui-button ui-button-primary ui-button-md"
                                onClick={
                                    handleCreateOrder
                                }
                                disabled={
                                    creating
                                }
                            >
                                {creating ? (
                                    <>
                                        <FiRefreshCw
                                            size={16}
                                            className="spin"
                                        />

                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        Confirm
                                        Shipment

                                        <FiCheckCircle
                                            size={
                                                16
                                            }
                                        />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="quote-card">
                        <div className="quote-card-header">
                            <div>
                                <span>
                                    DELIVERY QUOTE
                                </span>

                                <h2>
                                    ₹
                                    {Number(
                                        quote.totalCharge ||
                                        0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </h2>
                            </div>
                        </div>

                        <PriceBreakdown
                            quote={quote}
                        />

                        <div className="quote-meta">
                            <div>
                                <span>
                                    Zone
                                </span>

                                <strong>
                                    {
                                        quote.zoneType
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Rate
                                </span>

                                <strong>
                                    ₹
                                    {
                                        quote.ratePerKg
                                    }
                                    /kg
                                </strong>
                            </div>
                        </div>

                        <div className="quote-note">
                            <FiClock
                                size={15}
                            />

                            Final pricing is
                            calculated and
                            validated by the
                            server.
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4 */}

            {step === 4 && (
                <div className="shipment-success-card">
                    <div className="success-icon">
                        <FiCheckCircle
                            size={34}
                        />
                    </div>

                    <div className="success-eyebrow">
                        SHIPMENT CREATED
                    </div>

                    <h1>
                        Your shipment is
                        confirmed
                    </h1>

                    <p>
                        Your shipment has been
                        created successfully
                        and is now waiting for
                        assignment.
                    </p>

                    {createdOrder && (
                        <div className="success-order-number">
                            <span>
                                ORDER NUMBER
                            </span>

                            <strong>
                                {
                                    createdOrder.orderNumber
                                }
                            </strong>
                        </div>
                    )}

                    <div className="success-status">
                        <span className="status-dot" />

                        CREATED
                    </div>

                    <div className="success-actions">
                        <button
                            className="ui-button ui-button-primary ui-button-md"
                            onClick={() =>
                                navigate(
                                    `/customer/orders/${createdOrder?._id}`
                                )
                            }
                        >
                            Track Shipment

                            <FiArrowRight
                                size={16}
                            />
                        </button>

                        <button
                            className="ui-button ui-button-secondary ui-button-md"
                            onClick={() =>
                                navigate(
                                    "/customer/orders"
                                )
                            }
                        >
                            View My Shipments
                        </button>

                        <button
                            className="text-button"
                            onClick={
                                resetForm
                            }
                        >
                            Create another
                            shipment
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const Step = ({
    number,
    label,
    active,
    completed,
}) => {
    return (
        <div
            className={`shipment-step ${active
                ? "active"
                : ""
                } ${completed
                    ? "completed"
                    : ""
                }`}
        >
            <div className="shipment-step-number">
                {completed ? (
                    <FiCheckCircle
                        size={16}
                    />
                ) : (
                    number
                )}
            </div>

            <span>
                {label}
            </span>
        </div>
    );
};

const NumberField = ({
    label,
    name,
    value,
    onChange,
    suffix,
}) => {
    return (
        <div className="form-group">
            <label className="ui-label">
                {label}
            </label>

            <div className="input-with-suffix">
                <input
                    className="ui-input"
                    name={name}
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={value}
                    onChange={onChange}
                    placeholder="0.00"
                    required
                />

                <span>
                    {suffix}
                </span>
            </div>
        </div>
    );
};

const ReviewItem = ({
    label,
    value,
}) => {
    return (
        <div className="review-item">
            <span>
                {label}
            </span>

            <strong>
                {value}
            </strong>
        </div>
    );
};

export default CreateOrder;