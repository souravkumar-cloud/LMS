import api from "./api";

const seatRequestService = {

    getPendingRequests: async () => {

        const response = await api.get(

            "/seat/pending"

        );

        return response.data;

    },

    approveRequest: async (id) => {

        const response = await api.put(

            `/seat/approve/${id}`

        );

        return response.data;

    },

    rejectRequest: async (id) => {

        const response = await api.put(

            `/seat/reject/${id}`

        );

        return response.data;

    }

};

export default seatRequestService;