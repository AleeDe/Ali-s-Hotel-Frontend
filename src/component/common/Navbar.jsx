'use client';

import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Bed, Search, User, Settings, LogIn, UserPlus, LogOut, Menu, X } from 'lucide-react'
import ApiService from "../../service/ApiService"
// import Logo from '/assets/images/logo.png'


const Navbar = () => {
  const isAuthenticated = ApiService.isAuthenticated()
  const isAdmin = ApiService.isAdmin()
  const isUser = ApiService.isUser()
  const [isOpen, setIsOpen] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = () => {
    ApiService.logout()
    setShowLogoutModal(false)
    navigate("/home")
  }

  const NavItem = ({ to, icon: Icon, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200 ${
          isActive
            ? "text-teal-500 bg-teal-50 hover:bg-teal-100"
            : "text-gray-600 hover:text-teal-500 hover:bg-gray-100"
        }`
      }
    >
      <Icon size={20} />
      <span>{children}</span>
    </NavLink>
  )

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="sticky top-0 z-40 w-full bg-white shadow-lg"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <NavLink to="/home" className="text-2xl font-bold text-teal-600 hover:text-teal-700 transition-colors duration-200">
                <img src="/assets/images/logo.png" alt="" className="w-[6rem]"/>
              </NavLink>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <NavItem to="/home" icon={Home}>Home</NavItem>
              <NavItem to="/rooms" icon={Bed}>Rooms</NavItem>
              <NavItem to="/find-booking" icon={Search}>Find My Bookings</NavItem>
              {isUser && <NavItem to="/profile" icon={User}>Profile</NavItem>}
              {isAdmin && <NavItem to="/admin" icon={Settings}>Admin</NavItem>}

              {!isAuthenticated && (
                <>
                  <NavItem to="/login" icon={LogIn}>Login</NavItem>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <NavLink
                      to="/register"
                      className="flex items-center space-x-2 text-white bg-teal-500 hover:bg-teal-600 rounded-md px-4 py-2 transition-colors duration-200"
                    >
                      <UserPlus size={20} />
                      <span>Register</span>
                    </NavLink>
                  </motion.div>
                </>
              )}

              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-teal-500 px-3 py-2 rounded-md transition-colors duration-200"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 transition-colors duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavItem to="/home" icon={Home}>Home</NavItem>
                <NavItem to="/rooms" icon={Bed}>Rooms</NavItem>
                <NavItem to="/find-booking" icon={Search}>Find My Bookings</NavItem>
                {isUser && <NavItem to="/profile" icon={User}>Profile</NavItem>}
                {isAdmin && <NavItem to="/admin" icon={Settings}>Admin</NavItem>}

                {!isAuthenticated && (
                  <>
                    <NavItem to="/login" icon={LogIn}>Login</NavItem>
                    <NavItem to="/register" icon={UserPlus}>Register</NavItem>
                  </>
                )}

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-gray-600 hover:text-teal-500 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 shadow-xl"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Confirm Logout</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to log out? We'll miss you!</p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Logout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
