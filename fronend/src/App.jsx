import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import AddStudent from "./pages/admin/AddStudent";
import ChangePassword from "./pages/student/ChangePassword";
import AdminLayout from "./layouts/AdminLayout";
import AddSeat from "./pages/admin/AddSeat";
import StudentLayout from "./layouts/StudentLayout";
import Attendance from "./pages/student/Attendance";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import ManageSeats from "./pages/admin/ManageSeats";
import AvailableSeats from "./pages/student/AvailableSeats";
import MySeat from "./pages/student/MySeat";
import NotFound from "./components/common/NotFound";
import StudentList from "./pages/admin/StudentList"
import PaymentManagement from "./pages/admin/PaymentManagement";
import SubscriptionManagement from "./pages/admin/SubscriptionManagement";
import Requests from "./pages/admin/Requests";
import Analytics from "./pages/admin/Analytics";
import LibrarySettings from "./pages/admin/LibrarySettings";
import Notifications from "./pages/student/Notifications";
import StudentDetails from "./pages/admin/StudentDetails";
import EditStudent from "./pages/admin/EditStudent"
import EditSeat from "./pages/admin/EditSeat"
import AttendanceReport from "./pages/admin/AttendanceReport";
import Reports from "./pages/admin/Reports";
import Recipts from "./pages/student/Recipts";
import Profile from "./pages/student/Profile";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<PublicRoute><Login /></PublicRoute> } />

        <Route element={<AdminLayout/>}>
          <Route
            path="/admin/dashboard"
            element={<ProtectedRoute allowedRole="admin"> <AdminDashboard/> </ProtectedRoute> }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute allowedRole="admin">
                <SubscriptionManagement/>
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/edit-seat/:id"
            element={
              <ProtectedRoute allowedRole="admin">
                <EditSeat/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/Requests"
            element={
              <ProtectedRoute allowedRole="admin">
                <Requests/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/student/:id"
            element={
                <ProtectedRoute allowedRole="admin">
                    <StudentDetails />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/attendance-report"
            element={
                <ProtectedRoute allowedRole="admin">
                    <AttendanceReport />
                </ProtectedRoute>
            }
        />

         <Route
            path="/admin/reports"
            element={
                <ProtectedRoute allowedRole="admin">
                    <Reports />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/library-settings"
            element={
                <ProtectedRoute allowedRole="admin">
                    <LibrarySettings />
                </ProtectedRoute>
            }
        />

        <Route
            path="/admin/student/edit/:id"
            element={
                <ProtectedRoute allowedRole="admin">
                    <EditStudent />
                </ProtectedRoute>
            }
        />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRole="admin">
                <Analytics/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRole='admin'>
                <LibrarySettings/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payment"
            element={
              <ProtectedRoute allowedRole="admin">
                <PaymentManagement/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-student"
            element={<ProtectedRoute allowedRole="admin"> <AddStudent/> </ProtectedRoute>}
          />
          <Route
            path="/admin/add-seat"
            element={<ProtectedRoute allowedRole="admin"> <AddSeat/> </ProtectedRoute>}
          />
          <Route
            path="/admin/manage-seats"
            element={<ProtectedRoute allowedRole="admin"> <ManageSeats/> </ProtectedRoute>}
          />
          <Route
            path="/admin/students"
            element={<ProtectedRoute allowedRole="admin"> <StudentList/> </ProtectedRoute>}
          />
        </Route>


        <Route element={<StudentLayout/>}>
          <Route
            path="/student/dashboard"
           element={

                  <ProtectedRoute
                      allowedRole="student"
                  >

                      <StudentDashboard />

                  </ProtectedRoute>

              }
           />
           <Route
            path="/student/profile"
            element={
              <ProtectedRoute allowedRole="student">
                <Profile/>
              </ProtectedRoute>
            }
           />
          <Route
            path="/student/recipts"
            element={<ProtectedRoute allowedRole="student"><Recipts/></ProtectedRoute> }
          />
          <Route
            path="/student/change-password"
            element={<ProtectedRoute allowedRole="student"><ChangePassword/></ProtectedRoute>}
          />
          <Route 
            path="/student/available-seats"
            element={<ProtectedRoute allowedRole="student"> <AvailableSeats/> </ProtectedRoute>}
          />
          <Route
            path="/student/my-seat"
            element={<ProtectedRoute allowedRole="student"><MySeat/></ProtectedRoute>}
          />
        </Route>
        <Route
    path="*"
    element={<NotFound />}
 />
      </Routes>

    </BrowserRouter>
  );
}

export default App;