import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';

const AdminPage = () => {
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
            } catch (error) {
                console.error('Error fetching admin details:', error.message);
            }
        };

        fetchAdminName();
    }, []);

    return (
        <div className="max-w-3xl mx-auto my-12 p-5 bg-white rounded-lg shadow-lg text-center min-h-screen">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-teal-700 mb-5">
                Welcome, {adminName}
            </h1>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
                <button
                    className="w-full sm:w-auto px-6 py-3 text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors shadow-md"
                    onClick={() => navigate('/admin/manage-rooms')}
                >
                    Manage Rooms
                </button>
                <button
                    className="w-full sm:w-auto px-6 py-3 text-white bg-teal-700 rounded-md hover:bg-teal-800 transition-colors shadow-md"
                    onClick={() => navigate('/admin/manage-bookings')}
                >
                    Manage Bookings
                </button>
            </div>
        </div>
    );
}

export default AdminPage;
