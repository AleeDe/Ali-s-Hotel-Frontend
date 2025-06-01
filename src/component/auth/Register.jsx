import React, { useState } from 'react';
import ApiService from '../../service/ApiService';
import { useNavigate, Link } from 'react-router-dom';
import {toast} from "react-toastify"

function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const { name, email, password, phoneNumber } = formData;
        if (!name || !email || !password || !phoneNumber) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            setErrorMessage('Please fill all the fields.');
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        }
        try {
            // Call the register method from ApiService
            const response = await ApiService.registerUser(formData);

            // Check if the response is successful
            if (response.statusCode === 201) {
                
                // Clear the form fields after successful registration
                setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phoneNumber: ''
                });
                toast.success("User registered successfully");
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/home');
                }, 3000);
            }
        } catch (error) {
            console.log(error)
            if(error.response && error.response.status === 409){
                toast.warn("email already exist");
            }
            else{
                toast.error("Network Error");
            }

            setTimeout(() => setErrorMessage(''), 5000);
        }
    };

    return (
        <div className="max-w-full sm:max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            {errorMessage && <p className="text-red-600 mb-4 text-center">{errorMessage}</p>}
            {successMessage && <p className="text-green-600 mb-4 text-center">{successMessage}</p>}
            <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Phone Number:</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <div className="mb-6">
                    <label className="block font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-teal-600 text-white rounded-lg font-bold cursor-pointer hover:bg-teal-700 transition duration-300"
                >
                    Register
                </button>
            </form>
            <p className="text-center mt-4">
                Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Login</Link>
            </p>
        </div>
    );
}

export default RegisterPage;
