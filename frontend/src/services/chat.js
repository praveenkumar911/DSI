import apiClient from "./api";


const getSuggestedActivities = async (token, lesson) => {
    return await apiClient.post('/chat/getChat', {
        token,
        lesson
    });
}

export {
    getSuggestedActivities
}
 