import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditProfilePage = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setUser(response.user);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleDeleteProfile = async () => {
        if (!window.confirm('Are you sure you want to delete your account?')) {
            return;
        }
        try {
            await ApiService.deleteUser(user.id);
            navigate('/signup');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="edit-profile-page max-w-2xl mx-auto my-8 p-6 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center text-teal-600 mb-6">Edit Profile</h2>
            {error && <p className="error-message text-red-500 text-center mb-4">{error}</p>}
            {user && (
                <div className="profile-details mb-6">
                    <p className="mb-2"><strong>Name:</strong> {user.name}</p>
                    <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                    <p className="mb-2"><strong>Phone Number:</strong> {user.phoneNumber}</p>
                    <button
                        className="delete-profile-button bg-red-500 text-white py-2 px-4 rounded mt-4 mx-auto block hover:bg-red-600 transition-colors duration-300"
                        onClick={handleDeleteProfile}
                    >
                        Delete Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditProfilePage;
