import api from "./api";

const seatService = {

    getAllSeats: async () => {

        const response = await api.get("/seat/all");

        return response.data;

    },

    deleteSeat: async (id) => {

        const response = await api.delete(

            `/seat/delete/${id}`

        );

        return response.data;

    },

    vacateSeat: async (id) => {

        const response = await api.put(

            `/seat/vacate/${id}`

        );

        return response.data;

    },

    addSeat: async(seatDate)=>{
        const response=await api.post(
            "/seat/add",
            seatDate
        );
        return response.data;
    },
    getAvailableSeats: async () => {

    const response = await api.get("/seat/available");

    return response.data;

},

requestSeat: async (seatId) => {

    console.log("Sending Seat Request:", {
        requestedSeatId: seatId,
        remarks: ""
    });

    const response = await api.post(

        "/seat/create",

        {

            requestedSeatId: seatId,
            remarks:""

        }

    );

    return response.data;

},
    getMySeat:async()=>{
        const response=await api.get(
            "/seat/my"
        );
        return response.data;
    },

    getSeatById: async (id) => {

    const response = await api.get(`/seat/${id}`);

    return response.data;

},

updateSeat: async (id, data) => {

    const response = await api.put(

        `/seat/update/${id}`,

        data

    );

    return response.data;

},

getMasterData:async()=>{
    const response=await api.get(
        "/seat/master-data"
    );
    return response.data;
}

};

export default seatService;