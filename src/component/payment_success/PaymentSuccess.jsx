"use client"

import { useState, useRef, useEffect } from "react"
import { CheckCircle, Calendar, MapPin, Users, CreditCard, Download, Loader2, User, Clock } from "lucide-react"
import html2canvas from "html2canvas"
import ApiService from "../../service/ApiService"

export default function PaymentSuccess() {
  const [bookingDetails, setBookingDetails] = useState(null)
  const [user, setUser] = useState(null)
  const [room, setRoom] = useState(null)
  const receiptRef = useRef(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [confirmationCode, setConfirmationCode] = useState("")
  const [details, setDetails] = useState(null)
  const [totalDays, setTotalDays] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Retrieve confirmation code from localStorage
  useEffect(() => {
    const storedCode = localStorage.getItem("bookingConfirmationCode")
    if (storedCode) {
      setConfirmationCode(storedCode)
      console.log("Confirmation code retrieved:", storedCode)
    }
  }, [])

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (confirmationCode) {
        try {
          const response = await ApiService.getBookingByConfirmationCode(confirmationCode)
          setDetails(response)
          console.log("Booking details retrieved:", response)
          setBookingDetails(response.booking)
          setRoom(response.room)
          console.log("Room details retrieved:", response.room)
          setUser(response.user)
          console.log("User details retrieved:", response.user)

          if (response.booking) {
            const checkInDate = new Date(response.booking.checkInDate)
            const checkOutDate = new Date(response.booking.checkOutDate)
            const totalDays = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
            setTotalDays(totalDays)
            setTotalPrice(room.roomPrice * totalDays)
          }
        } catch (error) {
          console.error("Error fetching booking details:", error)
        }
      }
    }

    fetchBookingDetails()
  }, [confirmationCode])

  // Function to download receipt as image
  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return

    try {
      setIsDownloading(true)

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `booking-receipt-${confirmationCode}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setNotification({
        type: "success",
        message: "Your receipt has been downloaded successfully.",
      })
      setTimeout(() => setNotification(null), 3000)
    } catch (error) {
      console.error("Failed to download receipt:", error)
      setNotification({
        type: "error",
        message: "There was a problem downloading your receipt. Please try again.",
      })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setIsDownloading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Format transaction time
  const formatTransactionTime = () => {
    if (!bookingDetails?.bookingConfirmationCode) return "N/A"
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
  }

  if (!bookingDetails || !user || !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg max-w-sm z-50 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-200"
              : "bg-red-100 text-red-800 border border-red-200"
          }`}
        >
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      <div className="max-w-2xl mx-auto pt-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 text-lg">Your room booking has been confirmed</p>
        </div>

        {/* Booking Details Card - This will be captured as an image */}
        <div ref={receiptRef}>
          <div className="bg-white rounded-lg shadow-lg border-0 mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-6">
              <h2 className="text-xl font-semibold">Booking Confirmation</h2>
              <p className="text-green-100">Confirmation #: {confirmationCode}</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {/* Guest Details */}
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Guest Details</h3>
                    <p className="text-gray-600">{user.name}</p>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.phoneNumber}</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Hotel Info */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Grand Plaza Hotel</h3>
                    <p className="text-gray-600">123 Ocean Drive, Miami Beach, FL 33139</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Room Details */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Check-in</p>
                      <p className="text-gray-600">{formatDate(bookingDetails.checkInDate)}</p>
                      <p className="text-sm text-gray-500">3:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Check-out</p>
                      <p className="text-gray-600">{formatDate(bookingDetails.checkOutDate)}</p>
                      <p className="text-sm text-gray-500">11:00 AM</p>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Guest Info */}
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{room.roomType}</p>
                    <p className="text-gray-600">
                      {bookingDetails.numOfAdults} Adults • {bookingDetails.numOfChildren} Children • {totalDays} Nights
                    </p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Transaction Details */}
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Transaction Time</p>
                    <p className="text-gray-600">{formatTransactionTime()}</p>
                    <p className="text-sm text-gray-500">Transaction ID: {bookingDetails.bookingConfirmationCode}</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Payment Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Payment Method</p>
                      <p className="text-gray-600">Credit Card</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-2xl text-gray-900">${totalPrice}</p>
                    <p className="text-sm text-gray-500">Total Amount</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <button
            className="bg-green-600 hover:bg-green-700 text-white h-12 px-4 py-2 rounded-md font-medium flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-md mx-auto"
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isDownloading ? "Downloading..." : "Download Receipt"}
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg">
          <div className="p-6">
            <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>A confirmation email
                has been sent to your registered email address
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Present your confirmation number at check-in
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Contact the hotel directly for any special requests
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="text-center mt-8 pb-8">
          <button className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium transition-colors">
            Return to Home
          </button>
          <span className="mx-4 text-gray-400">•</span>
          <button className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium transition-colors">
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  )
}
