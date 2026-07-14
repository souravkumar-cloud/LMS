import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

    headers: {

        "Content-Type": "application/json"

    },

    withCredentials: false

});

/*
=========================================
Request Interceptor
=========================================
*/

api.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        if (token) {

            config.headers.Authorization = `Bearer ${token}`;

        }

        return config;

    },

    (error) => Promise.reject(error)

);

/*
=========================================
Response Interceptor
=========================================
*/

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response) {

            switch (error.response.status) {

                case 400:

                    toast.error(

                        error.response.data.message ||

                        "Bad Request"

                    );

                    break;

                case 401:

                    toast.error(

                        "Session Expired"

                    );

                    localStorage.removeItem("token");

                    localStorage.removeItem("user");

                    window.location.href = "/";

                    break;

                case 403:

                    toast.error(

                        "Access Denied"

                    );

                    break;

                case 404:

                    toast.error(

                        error.response.data.message ||

                        "Not Found"

                    );

                    break;

                case 500:

                    toast.error(

                        "Server Error"

                    );

                    break;

                default:

                    toast.error(

                        error.response.data.message ||

                        "Something went wrong"

                    );

            }

        }

        else {

            toast.error(

                "Network Error"

            );

        }

        return Promise.reject(error);

    }

);

export default api;