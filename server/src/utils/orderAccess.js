const canViewOrder = ({
    order,
    user,
}) => {
    if (!order || !user) {
        return false;
    }

    if (user.role === "ADMIN") {
        return true;
    }

    if (
        user.role === "CUSTOMER" &&
        order.customerId &&
        String(
            order.customerId._id ||
            order.customerId
        ) === String(user._id)
    ) {
        return true;
    }

    if (
        user.role === "DELIVERY_AGENT" &&
        order.assignment?.agentId &&
        String(
            order.assignment.agentId._id ||
            order.assignment.agentId
        ) === String(user._id)
    ) {
        return true;
    }

    return false;
};

module.exports = {
    canViewOrder,
};