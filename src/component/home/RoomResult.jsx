"use client"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import ApiService from "../../service/ApiService"

const RoomResult = ({ roomSearchResults }) => {
  const navigate = useNavigate()
  const isAdmin = ApiService.isAdmin()

  return (
    <section className="mt-8">
      {roomSearchResults && roomSearchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {roomSearchResults.map((room) => (
            <motion.div
              key={room.stringId}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                className="w-full h-48 object-cover"
                src={room.roomPhotoUrl || "/placeholder.svg"}
                alt={room.roomType}
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-teal-600 mb-2">{room.roomType}</h3>
                <p className="text-gray-600 mb-2">Price: ${room.roomPrice} / night</p>
                <p className="text-gray-700 mb-4">{room.roomDescription}</p>
                {isAdmin ? (
                  <button
                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-700 transition duration-300"
                    onClick={() => navigate(`/admin/edit-room/${room.stringId}`)}
                  >
                    Edit Room
                  </button>
                ) : (
                  <button
                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-700 transition duration-300"
                    onClick={() => navigate(`/rooms/${room.stringId}`)}
                  >
                    View/Book Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  )
}

export default RoomResult

