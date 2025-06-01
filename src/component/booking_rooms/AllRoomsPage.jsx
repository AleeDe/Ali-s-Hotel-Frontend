'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Loader, Filter, Search } from 'lucide-react';
import ApiService from '../../service/ApiService';
import Pagination from '../common/Pagination';
import RoomResult from '../home/RoomResult';
import RoomSearch from '../home/RoomSearch';

const AllRoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResult = (results) => {
    setRooms(results);
    setFilteredRooms(results);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [roomsResponse, typesResponse] = await Promise.all([
          ApiService.getAllRooms(),
          ApiService.getRoomTypes()
        ]);
        setRooms(roomsResponse.roomList);
        setFilteredRooms(roomsResponse.roomList);
        setRoomTypes(typesResponse);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const handleRoomTypeChange = (e) => {
    const type = e.target.value;
    setSelectedRoomType(type);
    setFilteredRooms(type === '' ? rooms : rooms.filter(room => room.roomType === type));
    setCurrentPage(1);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className='my-12 px-4 md:px-8 lg:px-16'
    >
      <h2 className="text-center mb-8 text-4xl font-bold text-teal-600">Discover Our Rooms</h2>
      
      <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
        <div className='w-full md:w-1/3 mb-4 md:mb-0'>
          <label className="block font-bold text-teal-600 mb-2">Filter by Room Type:</label>
          <div className="relative">
            <select 
              value={selectedRoomType} 
              onChange={handleRoomTypeChange} 
              className="w-full p-3 border border-gray-300 rounded-md text-lg appearance-none"
            >
              <option value="">All Types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <div className='w-full md:w-2/3'>
          <RoomSearch handleSearchResult={handleSearchResult} />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-teal-600" size={48} />
        </div>
      ) : (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RoomResult roomSearchResults={currentRooms} />
        </motion.div>
      )}

      <Pagination
        roomsPerPage={roomsPerPage}
        totalRooms={filteredRooms.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </motion.div>
  );
};

export default AllRoomsPage;
