import api from "./axios";

export const getZones = async () => {
    const response = await api.get(
        "/zones"
    );

    return response.data;
};

export const getZone = async (
    zoneId
) => {
    const response = await api.get(
        `/zones/${zoneId}`
    );

    return response.data;
};