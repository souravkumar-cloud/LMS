import api from "./api";

const studentService = {

    addStudent: async (data) => {
        const response = await api.post(
            "/student/add",
            data
        );
        return response.data;
    },

    getStudents: async () => {

        const response = await api.get("/student/all");

        return response.data;
    },

    getStudentById: async (id) => {

        const response = await api.get(`/student/${id}`);

        return response.data;
    },

    updateStudent: async (id, data) => {

        const response = await api.put(
            `/student/update/${id}`,
            data
        );

        return response.data;
    },
    searchStudent: async (keyword) => {

    const response = await api.get(

        `/student/search?keyword=${keyword}`

    );

    return response.data;

    },

    toggleStudentStatus: async (id) => {

        const response = await api.patch(

            `/student/status/${id}`

        );

        return response.data;

    },

    deleteStudent: async (id) => {

        const response = await api.delete(

            `/student/delete/${id}`

        );

        return response.data;

    }

};

export default studentService;