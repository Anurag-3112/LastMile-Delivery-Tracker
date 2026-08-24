const Input = ({
    label,
    error,
    hint,
    id,
    ...props
}) => {
    return (
        <div className="form-field">
            {label && (
                <label
                    htmlFor={id}
                    className="form-label"
                >
                    {label}
                </label>
            )}

            <input
                id={id}
                className={`form-input ${error
                        ? "form-input-error"
                        : ""
                    }`}
                {...props}
            />

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            {!error && hint && (
                <p className="form-hint">
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Input;