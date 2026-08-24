import api from "./axios";

export const getAreas =
    async () => {
        const response =
            await api.get(
                "/areas"
            );

        return response.data;
    };