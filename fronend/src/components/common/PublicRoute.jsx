import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";

const PublicRoute = ({ children }) => {

    const {

        user,

        loading,

        isAuthenticated

    } = useAuth();

    /*
    ------------------------------------
    Wait until AuthContext loads
    ------------------------------------
    */

    if (loading) {
        return <Loader text="Loading..." />;
    }

    /*
    ------------------------------------
    Already Logged In
    ------------------------------------
    */

    if (isAuthenticated) {

        if (user.role === "admin") {

            return <Navigate to="/admin/dashboard" replace />;

        }

        return <Navigate to="/student/dashboard" replace />;

    }

    /*
    ------------------------------------
    Not Logged In
    ------------------------------------
    */

    return children;

};

export default PublicRoute;