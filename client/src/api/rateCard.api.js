import api from "./axios";

export const getRateCards =
    async () => {
        const response =
            await api.get(
                "/admin/rate-cards"
            );

        return response.data;
    };

export const getRateCard =
    async (rateCardId) => {
        const response =
            await api.get(
                `/admin/rate-cards/${rateCardId}`
            );

        return response.data;
    };

export const createRateCard =
    async (payload) => {
        const response =
            await api.post(
                "/admin/rate-cards",
                payload
            );

        return response.data;
    };

export const updateRateCard =
    async (
        rateCardId,
        payload
    ) => {
        const response =
            await api.patch(
                `/admin/rate-cards/${rateCardId}`,
                payload
            );

        return response.data;
    };

export const deleteRateCard =
    async (rateCardId) => {
        const response =
            await api.delete(
                `/admin/rate-cards/${rateCardId}`
            );

        return response.data;
    };