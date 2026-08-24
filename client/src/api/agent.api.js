import api from "./axios";

export const getAgentProfile =
    async () => {
        const response =
            await api.get(
                "/agent/profile"
            );

        return response.data;
    };

export const updateAvailability =
    async (availability) => {
        const response =
            await api.patch(
                "/agent/availability",
                {
                    availability,
                }
            );

        return response.data;
    };

export const updateLocation =
    async (payload) => {
        const response =
            await api.patch(
                "/agent/location",
                payload
            );

        return response.data;
    };

export const updateOrderStatus =
    async (
        orderId,
        payload
    ) => {
        const response =
            await api.patch(
                `/orders/${orderId}/status`,
                payload
            );

        return response.data;
    };

export const getAssignedOrders =
    async () => {
        const response =
            await api.get(
                "/agent/orders"
            );

        return response.data;
    };  