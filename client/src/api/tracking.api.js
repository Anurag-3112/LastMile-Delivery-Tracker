import api from "./axios";

export const getTracking =
    async (orderId) => {
        const response =
            await api.get(
                `/orders/${orderId}/tracking`
            );

        return response.data;
    };