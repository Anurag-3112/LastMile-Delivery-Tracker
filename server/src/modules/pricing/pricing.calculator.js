const calculateVolumetricWeight = ({
    length,
    breadth,
    height,
}) => {
    return (
        (length * breadth * height) /
        5000
    );
};

const calculateBillableWeight = ({
    actualWeight,
    volumetricWeight,
}) => {
    return Math.max(
        actualWeight,
        volumetricWeight
    );
};

module.exports = {
    calculateVolumetricWeight,
    calculateBillableWeight,
};