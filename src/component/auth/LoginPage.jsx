import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ApiService from "../../service/ApiService";
import {toast} from "react-toastify"

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    

    const from = location.state?.from?.pathname || '/home';

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        try {
            const response = await ApiService.loginUser({ email, password });
            if (response.statusCode === 200) {
                toast.success("Login Successful!");
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                navigate(from, { replace: true });
            }
        } catch (error) {
            if(error.response && error.response.status === 500){
            toast.error("Invalid email and password!");
            }
            else{
                toast.error("Network Error");
            }
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="max-w-full sm:max-w-md mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <div className="mb-6">
                    <label className="block font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-teal-600 text-white rounded-lg font-bold cursor-pointer hover:bg-teal-700 transition duration-300"
                >
                    Login
                </button>
            </form>
            <p className="text-center mt-4">
                Don't have an account? <Link to="/register" className="text-teal-600 hover:underline">Register</Link>
            </p>
        </div>
    );
}

export default LoginPage;
