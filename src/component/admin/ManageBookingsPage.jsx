import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';

const ManageBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [bookingsPerPage] = useState(6);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await ApiService.getAllBookings();
                const allBookings = response.bookingList;
                setBookings(allBookings);
                setFilteredBookings(allBookings);
            } catch (error) {
                console.error('Error fetching bookings:', error.message);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings(searchTerm);
    }, [searchTerm, bookings]);

    const filterBookings = (term) => {
        if (term === '') {
            setFilteredBookings(bookings);
        } else {
            const filtered = bookings.filter((booking) =>
                booking.bookingConfirmationCode && booking.bookingConfirmationCode.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredBookings(filtered);
        }
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="max-w-5xl mx-auto mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-center text-2xl font-bold text-teal-700 mb-4">All Bookings</h2>
            <div className="flex justify-center items-center mb-6">
                <label className="mr-4 font-bold text-gray-600">Filter by Booking Number:</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Enter booking number"
                    className="p-2 border border-gray-300 rounded-md w-64"
                />
            </div>

            <div className="space-y-4">
                {currentBookings.map((booking) => (
                    <div key={booking.stringId} className="p-4 bg-white rounded-lg shadow-sm">
                        <p><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p>
                        <p><strong>Check In Date:</strong> {booking.checkInDate}</p>
                        <p><strong>Check out Date:</strong> {booking.checkOutDate}</p>
                        <p><strong>Total Guests:</strong> {booking.totalNumOfGuest}</p>
                        <button
                            className="mt-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
                            onClick={() => navigate(`/admin/edit-booking/${booking.bookingConfirmationCode}`)}
                        >
                            Manage Booking
                        </button>
                        
                    </div>
                ))}
            </div>

            <Pagination
                roomsPerPage={bookingsPerPage}
                totalRooms={filteredBookings.length}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
};

export default ManageBookingsPage;
