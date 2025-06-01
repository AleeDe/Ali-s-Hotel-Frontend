import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditRoomPage = () => {
    const { stringId } = useParams();
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

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const response = await ApiService.getRoomById(stringId);
                setRoomDetails({
                    roomPhotoUrl: response.room.roomPhotoUrl,
                    roomType: response.room.roomType,
                    roomPrice: response.room.roomPrice,
                    roomDescription: response.room.roomDescription,
                });
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchRoomDetails();
    }, [stringId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
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

    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('roomType', roomDetails.roomType);
            formData.append('roomPrice', roomDetails.roomPrice);
            formData.append('roomDescription', roomDetails.roomDescription);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.updateRoom(stringId, formData);
            if (result.statusCode === 200) {
                setSuccess('Room updated successfully.');
                
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-rooms');
                }, 3000);
            }
            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Do you want to delete this room?')) {
            try {
                const result = await ApiService.deleteRoom(stringId);
                if (result.statusCode === 200) {
                    setSuccess('Room Deleted successfully.');
                    
                    setTimeout(() => {
                        setSuccess('');
                        navigate('/admin/manage-rooms');
                    }, 3000);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setTimeout(() => setError(''), 5000);
            }
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-12 p-6 border border-gray-300 rounded-lg bg-white shadow-md sm:max-w-md md:max-w-lg lg:max-w-xl">
            <h2 className="text-center text-2xl font-bold mb-4 text-teal-700">Edit Room</h2>
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}
            {success && <p className="text-center text-green-500 mb-4">{success}</p>}
            <div className="space-y-6">
                <div className="flex flex-col items-center">
                    {preview ? (
                        <img src={preview} alt="Room Preview" className="w-full rounded-lg mb-4" />
                    ) : (
                        roomDetails.roomPhotoUrl && (
                            <img src={roomDetails.roomPhotoUrl} alt="Room" className="w-full rounded-lg mb-4" />
                        )
                    )}
                    <input
                        type="file"
                        name="roomPhoto"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                </div>
                <div className="form-group">
                    <label className="block mb-2 font-bold">Room Type</label>
                    <input
                        type="text"
                        name="roomType"
                        value={roomDetails.roomType}
                        onChange={handleChange}
                        className="block w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="form-group">
                    <label className="block mb-2 font-bold">Room Price</label>
                    <input
                        type="text"
                        name="roomPrice"
                        value={roomDetails.roomPrice}
                        onChange={handleChange}
                        className="block w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="form-group">
                    <label className="block mb-2 font-bold">Room Description</label>
                    <textarea
                        name="roomDescription"
                        value={roomDetails.roomDescription}
                        onChange={handleChange}
                        className="block w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                </div>
                <div className="flex justify-between">
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={handleUpdate}
                    >
                        Update Room
                    </button>
                    <button
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={handleDelete}
                    >
                        Delete Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditRoomPage;
