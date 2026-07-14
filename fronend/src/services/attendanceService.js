import api from "./api";

const attendanceService = {

    markEntry: async (data) => {

        const response = await api.post(

            "/attendance/entry",

            data

        );

        return response.data;

    },

    markExit: async (data) => {

        const response = await api.post(

            "/attendance/exit",

            data

        );

        return response.data;

    },

    getMyAttendance: async () => {

        const response = await api.get(

            "/attendance/my-history"

        );

        return response.data;

    },
    getTodayAttendance:async()=>{
        const response=await api.get(
            "/attendance/today"
        );
        return response.data;
    },
    exportAttendanceExcel:async()=>{
        return window.open(
            "http://localhost:5000/api/report/attendance/excel"
        );
    }

};

export default attendanceService;