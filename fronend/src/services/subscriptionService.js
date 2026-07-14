import api from "./api";

const subscriptionService = {

    getPlans: async () => {

        const response = await api.get("/subscription-plan/all");

        return response.data;

    },

    createPlan: async (planData) => {

        const response = await api.post(

            "/subscription-plan/create",

            planData

        );

        return response.data;

    },

    updatePlan: async (id, planData) => {

        const response = await api.put(

            `/subscription-plan/update/${id}`,

            planData

        );

        return response.data;

    },

    deletePlan: async (id) => {

        const response = await api.delete(

            `/subscription-plan/delete/${id}`

        );

        return response.data;

    }

};

export default subscriptionService;