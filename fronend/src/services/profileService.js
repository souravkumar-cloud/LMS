import api from "./api";

const profileService = {

    getProfile: async () => {

        const response = await api.get("/profile");

        return response.data;

    },

    updateProfile: async (data) => {

        const response = await api.put(
            "/profile/update",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;

    },

    getSummary: async () => {

        const response = await api.get("/profile/summary");

        return response.data;

    },

    uploadPhoto: async (data) => {

        const response = await api.post(
            "/profile/photo",
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;

    }

};

export default profileService;