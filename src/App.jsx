import { BrowserRouter, Routes, Route, Navigate ,useLocation } from "react-router-dom"
import Navbar from './component/common/Navbar';
import Footer from './component/common/Footer';
import HomePage from './component/home/HomePage'
import AllRoomsPage from './component/booking_rooms/AllRoomsPage'
import FindBookingPage from './component/booking_rooms/FindBookingPage'
import RoomDetailsPage from './component/booking_rooms/RoomDetailsPage'
import LoginPage from './component/auth/LoginPage'
import Register from './component/auth/Register'
import AddRoomPage from './component/admin/AddRoomPage';
import AdminPage from './component/admin/AdminPage';
import EditBookingPage from './component/admin/EditBookingPage';
import EditRoomPage from './component/admin/EditRoomPage';
import ManageBookingsPage from './component/admin/ManageBookingsPage';
import ManageRoomPage from './component/admin/ManageRoomPage';
import EditProfilePage from './component/profile/EditProfilePage';
import ProfilePage from './component/profile/ProfilePage';
import ApiService from './service/ApiService';
import WhatsAppLink from './service/WhatsAppLink'
import { ToastContainer, toast } from 'react-toastify';

// import { ProtectedRoute, AdminRoute } from './service/gaurd';

export const ProtectedRoute = ({ element: Component }) => {
  const location = useLocation();

  return ApiService.isAuthenticated() ? (
      <Component />
  ) : (
      
      <Navigate to="/login" replace state={{ from: location.pathname }} /> // Store pathname
      
  );
};

export const AdminRoute = ({ element: Component }) => {
  const location = useLocation();

  return ApiService.isAdmin() ? (
      <Component />
  ) : (
      <Navigate to="/login" replace state={{ from: location.pathname }} /> // Store pathname
  );
};


// Function to remove session token and role
const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

// Custom component that clears session and then navigates
const ClearSessionAndNavigate = () => {
  clearSession();
  return <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>

     <div className="App">
      <Navbar/>

    <div className="content">
      <Routes>
      <Route exact path="/login" element={<LoginPage />} />
      <Route exact path="/register" element={<Register />} />
      <Route exact path='/home' element={<HomePage/>}/> 
      <Route exact path='/rooms' element={<AllRoomsPage/>}/> 
      <Route exact path='/find-booking' element={<FindBookingPage/>}/> 

    

      {/* Protected Routes */}
           <Route path="/rooms/:roomId" element={<ProtectedRoute element={() => <RoomDetailsPage />} />} />
           <Route path="/profile" element={<ProtectedRoute element={() => <ProfilePage />} />} />
           <Route path="/edit-profile" element={<ProtectedRoute element={() => <EditProfilePage />} />} />





      
           <Route path="/admin" element={<AdminRoute element={() => <AdminPage />} />} />
           <Route path="/admin/add-room" element={<AdminRoute element={() => <AddRoomPage />} />} />
           <Route path="/admin/edit-booking/:bookingCode" element={<AdminRoute element={() => <EditBookingPage />} />} />
           <Route path="/admin/edit-room/:stringId" element={<AdminRoute element={() => <EditRoomPage />} />} />
           <Route path="/admin/manage-bookings" element={<AdminRoute element={() => <ManageBookingsPage />} />} />
           <Route path="/admin/manage-rooms" element={<AdminRoute element={() => <ManageRoomPage />} />} />


          <Route path="/rooms/:roomId" element={<AdminRoute element={() => <RoomDetailsPage />} />} />
      
      {/* Fallback Route */}
      <Route path="*" element={<ClearSessionAndNavigate />} />
      </Routes>
    </div>
    <WhatsAppLink />
      <Footer/>
      <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                    />
     </div>
    </BrowserRouter>
  )
}