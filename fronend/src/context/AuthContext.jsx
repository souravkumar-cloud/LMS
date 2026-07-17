import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(null);

    const [loading, setLoading] = useState(true);

    /*
    -------------------------------------
    Check Login on Refresh
    -------------------------------------
    */

    useEffect(() => {

        const savedUser = localStorage.getItem("user");

        const savedToken = localStorage.getItem("token");

        if (savedUser && savedToken) {

            setUser(JSON.parse(savedUser));

            setToken(savedToken);

        }

        setLoading(false);

    }, []);

    /*
    -------------------------------------
    Login
    -------------------------------------
    */

    const login = (userData, authToken) => {

        localStorage.setItem(

            "user",

            JSON.stringify(userData)

        );

        localStorage.setItem(

            "token",

            authToken

        );

        setUser(userData);

        setToken(authToken);

    };

    /*
    -------------------------------------
    Logout
    -------------------------------------
    */

    const logout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        setUser(null);

        setToken(null);

    };

    const updateUser = (updatedData) => {
        const newUser = {
            ...user,
            ...updatedData
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    };

    return (

        <AuthContext.Provider

            value={{

                user,

                token,

                loading,

                login,

                logout,

                updateUser,

                isAuthenticated: !!token

            }}

        >

            {children}

        </AuthContext.Provider>

    );

};

/*
-------------------------------------
Custom Hook
-------------------------------------
*/

export const useAuth = () => {

    return useContext(AuthContext);

};