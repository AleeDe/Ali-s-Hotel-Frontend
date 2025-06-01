"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Loader, Calendar, Users, Phone, Mail, Home } from "lucide-react"
import ApiService from "../../service/ApiService"

const FindBookingPage = () => {
  const [confirmationCode, setConfirmationCode] = useState("")
  const [bookingDetails, setBookingDetails] = useState(null)
  const [user,setUser]= useState(null);
  const [room,setRoom]= useState(null);
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async () => {
    if (!confirmationCode.trim()) {
      setError("Please enter a booking confirmation code")
      setTimeout(() => setError(""), 5000)
      return
    }
    setIsLoading(true)
    try {
      const response = await ApiService.getBookingByConfirmationCode(confirmationCode)
    
      setBookingDetails(response.booking)
      setRoom(response.room);
      setUser(response.user);
        // console.log(setUser)
      setError(null)
    } catch (error) {
      setError(error.response?.data?.message || error.message)
      setTimeout(() => setError(""), 5000)
    }
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-full md:max-w-3xl mx-auto my-10 p-6 bg-white shadow-2xl rounded-2xl"
    >
      <h2 className="text-center text-4xl font-bold mb-8 text-teal-600">Find Your Booking</h2>

      {/* Search Section */}
      <div className="flex flex-col md:flex-row items-center bg-gray-100 p-6 rounded-xl gap-4">
        <input
          required
          type="text"
          placeholder="Enter your booking confirmation code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
          className="p-4 text-lg border-2 border-teal-300 rounded-lg w-full focus:ring-2 focus:ring-teal-500 focus:outline-none transition duration-300"
        />
        <motion.button
          onClick={handleSearch}
          className="p-4 text-lg bg-teal-600 text-white rounded-lg cursor-pointer hover:bg-teal-700 transition duration-300 w-full md:w-auto flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? <Loader className="animate-spin mr-2" /> : <Search className="mr-2" />}
          {isLoading ? "Searching..." : "Find Booking"}
        </motion.button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      {/* Booking Details */}
      {bookingDetails && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 border-2 border-teal-200 rounded-xl p-6 bg-gray-50"
        >
          <h3 className="text-3xl font-bold mb-6 text-teal-700">Booking Details</h3>

          {/* Booking Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check-in/Check-out and Guests */}
            <div className="space-y-4">
              <p className="flex items-center text-lg">
                <Calendar className="mr-2 text-teal-600" /> Check-in: {bookingDetails.checkInDate}
              </p>
              <p className="flex items-center text-lg">
                <Calendar className="mr-2 text-teal-600" /> Check-out: {bookingDetails.checkOutDate}
              </p>
              <p className="flex items-center text-lg">
                <Users className="mr-2 text-teal-600" /> Guests: {bookingDetails.numOfAdults} adults,{" "}
                {bookingDetails.numOfChildren} children
              </p>
            </div>

            {/* Booker Details */}
            <div className="space-y-4">
              <h4 className="text-xl font-semibold text-teal-700">Booker Details</h4>
              <p className="flex items-center">
                <Mail className="mr-2 text-teal-600" /> {user.email}
              </p>
              <p className="flex items-center">
                <Phone className="mr-2 text-teal-600" /> {user.phoneNumber}
              </p>
            </div>
          </div>

          {/* Room Details */}
          <div className="mt-8">
            <h4 className="text-2xl font-bold mb-4 text-teal-700">Room Details</h4>
            <p className="flex items-center text-lg">
              <Home className="mr-2 text-teal-600" /> {room.roomType}
            </p>
            <motion.img
              src={room.roomPhotoUrl}
              alt="Room"
              className="w-full rounded-xl mt-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FindBookingPage