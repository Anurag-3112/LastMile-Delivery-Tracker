import api from "./axios";

/* Dashboard */

export const getAdminDashboard =
    async () => {
        const response =
            await api.get(
                "/admin/dashboard"
            );

        return response.data;
    };

/* Orders */

export const getAdminOrders =
    async (params = {}) => {
        const response =
            await api.get(
                "/admin/orders",
                {
                    params,
                }
            );

        return response.data;
    };

export const overrideOrderStatus =
    async (
        orderId,
        payload
    ) => {
        const response =
            await api.patch(
                `/admin/orders/${orderId}/status`,
                payload
            );

        return response.data;
    };

export const assignAgent =
    async (
        orderId,
        agentId
    ) => {
        const response =
            await api.patch(
                `/admin/orders/${orderId}/assign`,
                {
                    agentId,
                }
            );

        return response.data;
    };

export const autoAssignAgent =
    async (orderId) => {
        const response =
            await api.post(
                `/admin/orders/${orderId}/auto-assign`
            );

        return response.data;
    };

/* Agents */

export const getAgents =
    async () => {
        const response =
            await api.get(
                "/admin/agents"
            );

        return response.data;
    };

export const createAgent =
    async (payload) => {
        const response =
            await api.post(
                "/admin/agents",
                payload
            );

        return response.data;
    };

export const updateAgent =
    async (
        agentId,
        payload
    ) => {
        const response =
            await api.patch(
                `/admin/agents/${agentId}`,
                payload
            );

        return response.data;
    };

/* Zones */

export const getZones =
    async () => {
        const response =
            await api.get(
                "/admin/zones"
            );

        return response.data;
    };

export const createZone =
    async (payload) => {
        const response =
            await api.post(
                "/admin/zones",
                payload
            );

        return response.data;
    };

export const updateZone =
    async (
        zoneId,
        payload
    ) => {
        const response =
            await api.patch(
                `/admin/zones/${zoneId}`,
                payload
            );

        return response.data;
    };

/* Areas */

export const getAreas =
    async () => {
        const response =
            await api.get(
                "/admin/areas"
            );

        return response.data;
    };

export const createArea =
    async (payload) => {
        const response =
            await api.post(
                "/admin/areas",
                payload
            );

        return response.data;
    };

export const updateArea =
    async (
        areaId,
        payload
    ) => {
        const response =
            await api.patch(
                `/admin/areas/${areaId}`,
                payload
            );

        return response.data;
    };

/* Rate Cards */

export const getRateCards =
    async () => {
        const response =
            await api.get(
                "/admin/rate-cards"
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