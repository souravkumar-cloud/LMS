import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";
const ProtectedRoute = ({ children, allowedRole }) => {

    const {

        user,

        loading,

        isAuthenticated

    } = useAuth();

    /*
    -------------------------------------
    Wait Until Auth is Loaded
    -------------------------------------
    */

    if (loading) {
        return <Loader text="Checking Authentication..." />;
    }

    /*
    -------------------------------------
    Not Logged In
    -------------------------------------
    */

    if (!isAuthenticated) {

        return <Navigate to="/" replace />;

    }

    /*
    -------------------------------------
    Role Checking
    -------------------------------------
    */

    if (allowedRole && user.role !== allowedRole) {

        if (user.role === "admin") {

            return <Navigate to="/admin-dashboard" replace />;

        }

        return <Navigate to="/student-dashboard" replace />;

    }

    return children;

};

export default ProtectedRoute;