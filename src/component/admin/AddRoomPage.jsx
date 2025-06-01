import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const AddRoomPage = () => {
    const navigate = useNavigate();
    const [roomDetails, setRoomDetails] = useState({
        roomPhotoUrl: '',
        roomType: '',
        roomPrice: '',
        roomDescription: '',
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [roomTypes, setRoomTypes] = useState([]);
    const [newRoomType, setNewRoomType] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleRoomTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewRoomType(true);
            setRoomDetails(prevState => ({ ...prevState, roomType: '' }));
        } else {
            setNewRoomType(false);
            setRoomDetails(prevState => ({ ...prevState, roomType: e.target.value }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    const addRoom = async () => {
        if (!roomDetails.roomType || !roomDetails.roomPrice || !roomDetails.roomDescription) {
            setError('All room details must be provided.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (!window.confirm('Do you want to add this room?')) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.addRoom(formData);
            if (result.statusCode === 201) {
                setSuccess('Room added successfully.');
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-emerald-600 mb-8">Add New Room</h2>

            {error && (
                <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg animate-fade-in">
                    {error}
                </div>
            )}

            {success && (
                <div className="p-4 mb-6 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-fade-in">
                    {success}
                </div>
            )}

            <div className="space-y-6">
                <div className="form-group">
                    {preview && (
                        <img
                            src={preview}
                            alt="Room Preview"
                            className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
                        />
                    )}
                    <input
                        type="file"
                        name="roomPhoto"
                        onChange={handleFileChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                    <select
                        value={roomDetails.roomType}
                        onChange={handleRoomTypeChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="">Select a room type</option>
                        {roomTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                        <option value="new">Other (please specify)</option>
                    </select>
                    {newRoomType && (
                        <input
                            type="text"
                            name="roomType"
                            placeholder="Enter new room type"
                            value={roomDetails.roomType}
                            onChange={handleChange}
                            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                    )}
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Price</label>
                    <input
                        type="text"
                        name="roomPrice"
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Description</label>
                    <textarea
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        rows="4"
                    ></textarea>
                </div>

                <button
                    onClick={addRoom}
                    className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
                >
                    Add Room
                </button>
            </div>
        </div>
    );
};

export default AddRoomPage;