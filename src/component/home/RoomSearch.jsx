import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';

const RoomSearch = ({ handleSearchResult }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [roomType, setRoomType] = useState('');
  const [roomTypes, setRoomTypes] = useState([]);
  const [error, setError] = useState('');

  
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const types = await ApiService.getRoomTypes();
        setRoomTypes(types);
      } catch (error) {
        console.error('Error fetching room types:', error.message);
      }
    };
    fetchRoomTypes();
  }, []);

  const showError = (message, timeout = 5000) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, timeout);
  };

  const handleInternalSearch = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !roomType) {
      showError('Please select all fields.');
      return false;
    }
    try {
      const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : null;
      const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : null;

      const response = await ApiService.getAvailableRoomsByDateAndType(formattedStartDate, formattedEndDate, roomType);

      if (response.statusCode === 200) {
        if (response.roomList.length === 0) {
          showError('Room not currently available for this date range on the selected room type.');
          return;
        }
        handleSearchResult(response.roomList);
        setError('');
      }
    } catch (error) {
      showError('Unknown error occurred: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleInternalSearch} className=" p-6 rounded-lg  bg-transparent">
      <div className="flex flex-wrap justify-center items-center mb-5 p-6 md:p-5 ml-3 md:ml-12 bg-transparent">
        <div className="flex-none w-full md:w-1/4 m-2.5 p-3.5 border border-gray-300 rounded-md bg-gray-50 shadow-sm bg-transparent">
          <label className="block mb-2 font-bold text-gray-600">Check-in Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Check-in Date"
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex-none w-full md:w-1/4 m-2.5 p-3.5 border border-gray-300 rounded-md bg-gray-50 shadow-sm">
          <label className="block mb-2 font-bold text-gray-600">Check-out Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Check-out Date"
            className="block w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex-none w-full md:w-1/4 m-2.5 p-3.5 border border-gray-300 rounded-md bg-gray-50 shadow-sm">
          <label className="block mb-2 font-bold text-gray-600">Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="block w-full p-2 border rounded"
            required
          >
            <option disabled value="">
              Select Room Type
            </option>
            {roomTypes.map((roomType) => (
              <option key={roomType} value={roomType}>
                {roomType}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-center items-center w-full md:w-auto m-2.5">
          <button type="submit" className="w-full md:w-auto bg-teal-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-teal-700 transition duration-300">
            Search Rooms
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
};

export default RoomSearch;
