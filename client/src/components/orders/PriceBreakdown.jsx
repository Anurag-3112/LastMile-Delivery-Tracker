const PriceBreakdown = ({
    quote,
}) => {
    if (!quote) {
        return null;
    }

    return (
        <div className="price-breakdown">
            <h2>
                Price Breakdown
            </h2>

            <div className="price-breakdown-row">
                <span>
                    Zone
                </span>

                <strong>
                    {quote.zoneType}
                </strong>
            </div>

            <div className="price-breakdown-row">
                <span>
                    Actual Weight
                </span>

                <strong>
                    {quote.actualWeight} kg
                </strong>
            </div>

            <div className="price-breakdown-row">
                <span>
                    Volumetric Weight
                </span>

                <strong>
                    {quote.volumetricWeight} kg
                </strong>
            </div>

            <div className="price-breakdown-row">
                <span>
                    Billable Weight
                </span>

                <strong>
                    {quote.billableWeight} kg
                </strong>
            </div>

            <div className="price-breakdown-row">
                <span>
                    Rate
                </span>

                <strong>
                    ₹{quote.ratePerKg}/kg
                </strong>
            </div>

            <div className="price-breakdown-row">
                <span>
                    Base Charge
                </span>

                <strong>
                    ₹{quote.baseCharge}
                </strong>
            </div>

            <div className="price-breakdown-row">
                <span>
                    COD Surcharge
                </span>

                <strong>
                    ₹{quote.codSurcharge}
                </strong>
            </div>

            <hr />

            <div className="price-breakdown-total">
                <span>
                    Total
                </span>

                <strong>
                    ₹{quote.totalCharge}
                </strong>
            </div>
        </div>
    );
};

export default PriceBreakdown;