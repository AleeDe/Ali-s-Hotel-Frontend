import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import DatePicker from 'react-datepicker';
import {toast} from "react-toastify"

const RoomDetailsPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        

        setIsLoading(true);
        const response = await ApiService.getRoomById(roomId);
        setRoomDetails(response.room);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.stringId);
        // console.log(userId);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [roomId]);

  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select check-in and check-out dates.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (isNaN(numAdults) || numAdults < 1 || isNaN(numChildren) || numChildren < 0) {
      setErrorMessage('Please enter valid numbers for adults and children.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const totalDays = Math.round(Math.abs((endDate - startDate) / oneDay)) + 1;

    const totalGuests = numAdults + numChildren;
    const totalPrice = roomDetails.roomPrice * totalDays;

    setTotalPrice(totalPrice);
    setTotalGuests(totalGuests);
  };

  const acceptBooking = async () => {
    try {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);

      const formattedCheckInDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const formattedCheckOutDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const booking = {
        checkInDate: formattedCheckInDate,
        checkOutDate: formattedCheckOutDate,
        numOfAdults: numAdults,
        numOfChildren: numChildren,
      };

      const response = await ApiService.bookRoom(roomId, userId, booking);
      
      toast.success("Room Book Suuessful!");
      if (response.statusCode === 201) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/rooms');
        }, 2000);
      }
    } catch (error) {
      if(error.response && error.response.status === 404){
                  toast.error("Room Already Book Selected Date!");
                  }
                  else if (error.response && error.response.status === 500){
                    toast.error("check-in-Date smaller than check-out-date!");
                  }
                  else{
                      toast.error("Network Error");
                  }
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Loading room details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!roomDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Room not found.</p>
      </div>
    );
  }

  const { roomType, roomPrice, roomPhotoUrl, description, bookings } = roomDetails;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-gray-50 min-h-screen">
      {showMessage && (
        <div className="p-4 mb-6 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in">
          Booking successful! Confirmation code: {confirmationCode}. An SMS and email of your booking details have been sent to you.
        </div>
      )}

      {errorMessage && (
        <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fade-in">
          {errorMessage}
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Room Details</h1>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <img src={roomPhotoUrl} alt={roomType} className="w-full h-64 object-cover" />
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">{roomType}</h2>
          <p className="text-lg text-emerald-600 font-medium">${roomPrice} / night</p>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>

      {bookings?.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Existing Bookings</h3>
          <div className="space-y-3">
            {bookings.map((booking, index) => (
              <div key={booking.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <span className="font-medium text-gray-700">Booking #{index + 1}</span>
                <div className="space-x-4">
                  <span className="text-sm text-gray-500">Check-in: {booking.checkInDate}</span>
                  <span className="text-sm text-gray-500">Check-out: {booking.checkOutDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setShowDatePicker(true)}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Book Now
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
          >
            Go Back
          </button>
        </div>

        {showDatePicker && (
          <div className="space-y-6 animate-slide-down">
            <div className="grid md:grid-cols-2 gap-4">
              <DatePicker
                selected={checkInDate}
                onChange={setCheckInDate}
                selectsStart
                startDate={checkInDate}
                endDate={checkOutDate}
                placeholderText="Check-in Date"
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <DatePicker
                selected={checkOutDate}
                onChange={setCheckOutDate}
                selectsEnd
                startDate={checkInDate}
                endDate={checkOutDate}
                minDate={checkInDate}
                placeholderText="Check-out Date"
                dateFormat="dd/MM/yyyy"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Adults</label>
                <input
                  type="number"
                  min="1"
                  value={numAdults}
                  onChange={(e) => setNumAdults(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Children</label>
                <input
                  type="number"
                  min="0"
                  value={numChildren}
                  onChange={(e) => setNumChildren(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
            >
              Calculate Price
            </button>
          </div>
        )}

        {totalPrice > 0 && (
          <div className="animate-pop-in bg-emerald-50 p-6 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-700">Total Price</p>
                <p className="text-2xl font-bold text-emerald-600">${totalPrice}</p>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">Total Guests</p>
                <p className="text-2xl font-bold text-emerald-600">{totalGuests}</p>
              </div>
            </div>
            <button
              onClick={acceptBooking}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg animate-pulse"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetailsPage;