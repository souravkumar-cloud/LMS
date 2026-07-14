const BASE_URL = "http://localhost:5000/api/report";

const reportService = {

    studentExcel: () => {

        window.open(

            `${BASE_URL}/student/excel`,

            "_blank"

        );

    },

    attendanceExcel: () => {

        window.open(

            `${BASE_URL}/attendance/excel`,

            "_blank"

        );

    },

    paymentExcel: () => {

        window.open(

            `${BASE_URL}/payment/excel`,

            "_blank"

        );

    },

    seatExcel: () => {

        window.open(

            `${BASE_URL}/seat/excel`,

            "_blank"

        );

    },

    generatePDF: (type) => {

        window.open(

            `${BASE_URL}?type=${type}`,

            "_blank"

        );

    }

};

export default reportService;