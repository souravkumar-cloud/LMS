import api from "./api";

const paymentService = {

    createPayment: async (data) => {

        const response = await api.post(

            "/payment/create",

            data

        );

        return response.data;

    },

    paymentHistory: async () => {

        const response = await api.get(

            "/payment/history"

        );

        return response.data;

    },

    totalRevenue: async () => {

        const response = await api.get(

            "/payment/revenue"

        );

        return response.data;

    },

    downloadReceipt: (id) => {

        window.open(

            `http://localhost:5000/api/payment/receipt/${id}`,

            "_blank"

        );

    }

};

export default paymentService;