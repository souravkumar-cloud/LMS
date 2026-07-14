import api from "./api";

/*
=========================================
Login User
=========================================
*/

export const loginUser = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
};

/*
=========================================
Change Password
=========================================
*/

export const changePassword = async (passwordData) => {
    const response = await api.put(
        "/auth/change-password",
        passwordData
    );

    return response.data;
};

/*
=========================================
Create Admin
=========================================
*/

export const createAdmin = async (adminData) => {
    const response = await api.post(
        "/auth/create-admin",
        adminData
    );

    return response.data;
};