import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                // Fetch user bookings using the fetched user ID
                const userPlusBookings = await ApiService.getUserBookings(response.user.stringId);
                console.log(userPlusBookings)
                setUser(userPlusBookings.user)
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        ApiService.logout();
        navigate('/home');
    };

    const handleEditProfile = () => {
        navigate('/edit-profile');
    };

    return (
        <div className="profile-page max-w-2xl mx-auto my-8 p-6 bg-gray-100 rounded-lg shadow-lg">
            {user && <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">Welcome, {user.name}</h2>}
            <div className="profile-actions flex justify-center mb-6 gap-4">
                <button
                    className="edit-profile-button bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors duration-300"
                    onClick={handleEditProfile}
                >
                    Edit Profile
                </button>
                <button
                    className="logout-button bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors duration-300"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
            {error && <p className="error-message text-red-500 text-center mb-4">{error}</p>}
            {user && (
                <div className="profile-details mb-6">
                    <h3 className="text-xl font-bold text-teal-600 mb-4">My Profile Details</h3>
                    <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                    <p className="mb-2"><strong>Phone Number:</strong> {user.phoneNumber}</p>
                </div>
            )}
            <div className="bookings-section">
                <h3 className="text-xl font-bold text-teal-600 mb-4">My Booking History</h3>
                <div className="booking-list flex flex-col gap-4">
                    {user && user.bookings.length > 0 ? (
                        user.bookings.map((booking) => (
                            <div key={booking.id} className="booking-item p-4 bg-white rounded-lg shadow-md">
                                <p className="mb-2"><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p>
                                <p className="mb-2"><strong>Check-in Date:</strong> {booking.checkInDate}</p>
                                <p className="mb-2"><strong>Check-out Date:</strong> {booking.checkOutDate}</p>
                                <p className="mb-2"><strong>Total Guests:</strong> {booking.totalNumOfGuest}</p>
                                <p className="mb-2"><strong>Room Type:</strong> {booking.room.roomType}</p>
                                <p className="mb-2"><strong>Room Price:</strong> ${booking.room.roomPrice}</p>
                                <img
                                    src={booking.room.roomPhotoUrl}
                                    alt="Room"
                                    className="room-photo max-w-full rounded-lg"
                                />
                            </div>
                        ))
                    ) : (
                        <p>No bookings found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
