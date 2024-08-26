import axios from 'axios';

const API_URL = 'https://be-shadn.onrender.com/api';

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        const { token } = response.data;
        localStorage.setItem('authToken', token); // Store token
        return response.data;
    } catch (error) {
        throw new Error('Sign in failed');
    }
};

export const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { email, password, first_name: firstName, last_name: lastName });
        const { token } = response.data;
        localStorage.setItem('authToken', token); // Store token
        return response.data;
    } catch (error) {
        throw new Error('Sign up failed');
    }
};


export const getCurrentUser = async () => {
    try {
        const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
        if (!token) throw new Error('No authentication token found');

        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw new Error('Failed to fetch user details');
    }
};

export const resetPassword = async (email: string) => {
    try {
        await axios.post(`${API_URL}/reset-password`, { email });
    } catch (error) {
        throw new Error('Password reset failed');
    }
};
