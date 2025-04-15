import apiClient from "./api";

const requestOTP = async (email) => {
    return await apiClient.post('/users/requestOTP', { email });
}

const verifyOTP = async (email, otp) => {
    return await apiClient.post('/users/verifyOTP', { mail: email, otp });
}

const addFellow = async (name, email, mobile) => {
    return await apiClient.post('/users/addFellow', {
        name,
        email,
        mobile
    });
}

export {
    requestOTP,
    verifyOTP,
    addFellow 
};
