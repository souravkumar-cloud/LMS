import api from "./api";

const notificationService = {

    createNotification: async (data) => {

        const response = await api.post(
            "/notification/create",
            data
        );

        return response.data;

    },

    broadcastNotification: async (data) => {

        const response = await api.post(
            "/notification/broadcast",
            data
        );

        return response.data;

    },

    getMyNotifications: async () => {

        const response = await api.get(
            "/notification/my"
        );

        return response.data;

    },

    unreadCount: async () => {

        const response = await api.get(
            "/notification/unread-count"
        );

        return response.data;

    },

    markAsRead: async (id) => {

        const response = await api.put(
            `/notification/read/${id}`
        );

        return response.data;

    },

    deleteNotification: async (id) => {

        const response = await api.delete(
            `/notification/${id}`
        );

        return response.data;

    }

};

export default notificationService;