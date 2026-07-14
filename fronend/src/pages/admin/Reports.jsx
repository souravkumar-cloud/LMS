import {
    FileSpreadsheet,
    FileText,
    Users,
    CreditCard,
    Armchair,
    Calendar
} from "lucide-react";

import reportService from "../../services/reportService";

const Reports = () => {

    const reports = [

        {
            title: "Student Report",
            description: "Export all registered students.",
            icon: <Users size={40} className="text-blue-600"/>,
            excel: reportService.studentExcel,
            pdf: () => reportService.generatePDF("student")
        },

        {
            title: "Attendance Report",
            description: "Export attendance records.",
            icon: <Calendar size={40} className="text-green-600"/>,
            excel: reportService.attendanceExcel,
            pdf: () => reportService.generatePDF("attendance")
        },

        {
            title: "Payment Report",
            description: "Export payment history.",
            icon: <CreditCard size={40} className="text-yellow-600"/>,
            excel: reportService.paymentExcel,
            pdf: () => reportService.generatePDF("payment")
        },

        {
            title: "Seat Report",
            description: "Export seat allocation.",
            icon: <Armchair size={40} className="text-red-600"/>,
            excel: reportService.seatExcel,
            pdf: () => reportService.generatePDF("seat")
        }

    ];

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold">

                    Reports

                </h1>

                <p className="text-gray-500 mt-2">

                    Download Excel and PDF reports.

                </p>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                {

                    reports.map((report,index)=>(

                        <div

                            key={index}

                            className="bg-white rounded-xl shadow-lg p-6"

                        >

                            {report.icon}

                            <h2 className="text-xl font-bold mt-5">

                                {report.title}

                            </h2>

                            <p className="text-gray-500 mt-3">

                                {report.description}

                            </p>

                            <div className="flex gap-3 mt-8">

                                <button

                                    onClick={report.excel}

                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex justify-center items-center gap-2"

                                >

                                    <FileSpreadsheet size={18}/>

                                    Excel

                                </button>

                                <button

                                    onClick={report.pdf}

                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg flex justify-center items-center gap-2"

                                >

                                    <FileText size={18}/>

                                    PDF

                                </button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

};

export default Reports;