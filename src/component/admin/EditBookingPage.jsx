import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [roomDetails, setRoomDetails] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            console.log("Fetching booking details...");
            setLoading(true);
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                console.log("API Response:", response);

                if (response.booking && response.user && response.room) {
                    setBookingDetails(response.booking);
                    setUserDetails(response.user);
                    setRoomDetails(response.room);
                } else {
                    console.error("Response missing expected data.");
                    setError("Failed to load booking details.");
                }
            } catch (error) {
                console.error("Error fetching booking details:", error);
                setError(error.message || "Error fetching booking details.");
            } finally {
                setLoading(false);
            }
        };

        if (bookingCode) {
            console.log("Booking Code from URL:", bookingCode);
            fetchBookingDetails();
        } else {
            console.error("No booking code provided in URL.");
        }
    }, [bookingCode]);

    const archiveBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to archive this booking?')) {
            return;
        }

        try {
            const response = await ApiService.cancelBooking(bookingDetails.stringId);
            if (response.statusCode === 200) {
                setSuccessMessage("Booking archived successfully");
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 3000);
            }
        } catch (error) {
            console.error("Error archiving booking:", error);
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="max-w-3xl mx-auto my-8 p-5 bg-white rounded-lg shadow-lg text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-700 mb-5">Booking Detail</h2>
            {loading && <p>Loading...</p>}
            {error && <p className='text-red-500'>{error}</p>}
            {success && <p className='text-green-500'>{success}</p>}
            {bookingDetails && userDetails && roomDetails && (
                <div className="text-left">
                    <h3 className="text-lg font-semibold text-teal-700 mb-3">Booking Details</h3>
                    <p>Confirmation Code: {bookingDetails.bookingConfirmationCode}</p>
                    <p>Check-in Date: {new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
                    <p>Check-out Date: {new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
                    <p>Num Of Adults: {bookingDetails.numOfAdults}</p>
                    <p>Num Of Children: {bookingDetails.numOfChildren}</p>
                    <p>Guest Email: {bookingDetails.guestEmail}</p>

                    <br />
                    <hr className="my-3" />
                    <h3 className="text-lg font-semibold text-teal-700 mb-3">Booker Details</h3>
                    <div>
                        <p>Name: {userDetails.name}</p>
                        <p>Email: {userDetails.email}</p>
                        <p>Phone Number: {userDetails.phoneNumber}</p>
                    </div>

                    <br />
                    <hr className="my-3" />
                    <h3 className="text-lg font-semibold text-teal-700 mb-3">Room Details</h3>
                    <div>
                        <p>Room Type: {roomDetails.roomType}</p>
                        <p>Room Price: ${roomDetails.roomPrice}</p>
                        <p>Room Description: {roomDetails.roomDescription}</p>
                        {roomDetails.roomPhotoUrl && (
                            <img src={roomDetails.roomPhotoUrl} alt="Room" className="max-w-full rounded-lg" />
                        )}
                    </div>
                    <button
                        className="mt-4 bg-red-600 text-white text-lg font-bold py-2 px-4 rounded hover:bg-red-700"
                        onClick={() => archiveBooking(bookingDetails.stringId)}
                    >
                        Archive Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;
