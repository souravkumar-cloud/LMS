import api from "./api";
import toast from "react-hot-toast";

const downloadFile = async (url, defaultFileName) => {
    try {
        toast.loading("Preparing download...", { id: "download" });
        const response = await api.get(url, { responseType: 'blob' });
        
        // Create blob link to download
        const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = blobUrl;
        
        // Extract filename from header if possible
        const contentDisposition = response.headers['content-disposition'];
        let fileName = defaultFileName;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename=(.+)/);
            if (fileNameMatch && fileNameMatch[1]) {
                fileName = fileNameMatch[1].replace(/["']/g, '');
            }
        }
        
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
        
        toast.success("Download complete!", { id: "download" });
    } catch (error) {
        console.error("Download Error:", error);
        
        // If error response is a blob, we must convert it back to text to read the JSON error message
        if (error.response && error.response.data instanceof Blob) {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const errJson = JSON.parse(reader.result);
                    toast.error(errJson.message || "Failed to download report.", { id: "download" });
                } catch {
                    toast.error("Failed to download report.", { id: "download" });
                }
            };
            reader.readAsText(error.response.data);
        } else {
            toast.error(error.response?.data?.message || "Failed to download report.", { id: "download" });
        }
    }
};

const reportService = {

    studentExcel: (role = "student") => {
        downloadFile(`/report/student/excel?role=${role}`, `${role === 'admin' ? 'admins' : 'students'}.xlsx`);
    },

    attendanceExcel: () => {
        downloadFile("/report/attendance/excel", "attendance.xlsx");
    },

    todayAttendanceExcel: () => {
        downloadFile("/report/attendance/excel?today=true", "today_attendance.xlsx");
    },

    paymentExcel: () => {
        downloadFile("/report/payment/excel", "payments.xlsx");
    },

    seatExcel: () => {
        downloadFile("/report/seat/excel", "seats.xlsx");
    },

    generatePDF: (type, role = "student") => {
        let url = `/report?type=${type}`;
        if (type === "student") {
            url += `&role=${role}`;
        }
        downloadFile(url, `${type}_report.pdf`);
    }

};

export default reportService;