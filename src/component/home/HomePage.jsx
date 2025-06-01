"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaConciergeBell,
  FaSnowflake,
  FaGlassMartiniAlt,
  FaSpa,
} from "react-icons/fa"
import RoomSearch from "./RoomSearch"
import RoomResult from "./RoomResult"
import SkeletonLoader from "../common/SkeletonLoader"
import {toast} from "react-toastify"

const HomePage = () => {
  const [roomSearchResults, setRoomSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate loading time
    toast.success("Welcome to HomePage!");
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSearchResult = (results) => {
    setRoomSearchResults(results)
  }

  const handleBookNow = () => {
    navigate("/rooms")
  }

  const services = [
    { title: "WiFi", icon: FaWifi, description: "High-speed internet throughout the hotel" },
    { title: "Parking", icon: FaParking, description: "Secure on-site parking available" },
    { title: "Swimming Pool", icon: FaSwimmingPool, description: "Luxurious indoor and outdoor pools" },
    { title: "Fitness Center", icon: FaDumbbell, description: "24/7 access to state-of-the-art gym" },
    { title: "Room Service", icon: FaConciergeBell, description: "Available 24 hours a day" },
    { title: "Air Conditioning", icon: FaSnowflake, description: "Climate control in all rooms" },
    { title: "Mini Bar", icon: FaGlassMartiniAlt, description: "Fully stocked in-room refreshments" },
    { title: "Spa & Wellness", icon: FaSpa, description: "Rejuvenating treatments and massages" },
  ]

  return (
    <AnimatePresence>
      {isLoading ? (
        
          <SkeletonLoader/>
        
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gray-100"
        >
          {/* Hero Section */}
          <header className="relative h-screen">
            <img src="/assets/images/background.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-white"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
                Welcome to <span className="text-yellow-400">BR|OQ Hotel</span>
              </h1>
              <h3 className="text-xl md:text-2xl mb-8 text-center">Experience luxury and comfort like never before</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookNow}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-yellow-300 transition duration-300"
              >
                Book Your Stay
              </motion.button>
            </motion.div>
          </header>

          {/* Search Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Find Your Perfect Room</h2>
            <RoomSearch handleSearchResult={handleSearchResult} />
            <RoomResult roomSearchResults={roomSearchResults} />
            {roomSearchResults.length === 0 && (
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookNow}
                  className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
                >
                  View All Rooms
                </motion.button>
              </div>
            )}
          </section>

          {/* Services Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-100">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our <span className="text-yellow-400">Services</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300"
                >
                  <div className="p-6">
                    <service.icon className="text-4xl text-yellow-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Our Guests Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "John Doe",
                  review:
                    "Absolutely loved my stay at Phegon Hotel! The staff was incredibly friendly, and the rooms were spotless.",
                  image: "/assets/images/user1.jpg",
                },
                {
                  name: "Jane Smith",
                  review:
                    "The spa treatments were heavenly, and the pool was the perfect place to relax after a long day.",
                  image: "/assets/images/user2.jpg",
                },
                {
                  name: "Michael Johnson",
                  review:
                    "The mini bar was a nice touch, and the Wi-Fi was super fast. Will definitely stay here again!",
                  image: "/assets/images/user3.jpg",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-100 rounded-lg shadow-md p-6 hover:shadow-xl transition duration-300"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                  </div>
                  <p className="text-gray-600 italic">&ldquo;{testimonial.review}&rdquo;</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 px-4 md:px-8 lg:px-16 bg-yellow-400">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Ready for an Unforgettable Stay?</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookNow}
                className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition duration-300"
              >
                Book Your Experience Now
              </motion.button>
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default HomePage

