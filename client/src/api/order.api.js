import api from "./axios";

export const getQuote = async (
    payload
) => {
    const response =
        await api.post(
            "/pricing/quote",
            payload
        );

    return response.data;
};

export const createOrder = async (
    payload
) => {
    const response =
        await api.post(
            "/orders",
            payload
        );

    return response.data;
};

export const getMyOrders =
    async () => {
        const response =
            await api.get(
                "/orders/my"
            );

        return response.data;
    };

export const getOrder =
    async (orderId) => {
        const response =
            await api.get(
                `/orders/${orderId}`
            );

        return response.data;
    };

export const rescheduleOrder =
    async (
        orderId,
        payload
    ) => {
        const response =
            await api.post(
                `/orders/${orderId}/reschedule`,
                payload
            );

        return response.data;
    };