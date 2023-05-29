import axios from 'axios';
import { baseURL } from '../../environnements/environnement';

export const login = async (email: any, password: any) => {
    try {
        const response = await axios.post(`${baseURL}/auth/login`, {
            email,
            password,
        });
        saveToken(response.data.token);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};
function saveToken(userToken: String) {
    localStorage.setItem(
        'auth',
        JSON.stringify({ token: userToken, status: true })
    );
}
export const signup = async (data: any) => {
    try {
        const response = await axios.post(`${baseURL}/auth/signup`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const getLobby = async (id: any) => {
    try {
        const response = await axios.get(`${baseURL}/lobby/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const researchUser = async (userId, name: any) => {
    try {
        const response = await axios.get(`${baseURL}/user/${userId}/name/${name}`);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const AddFriend = async (userId, data: any) => {
    try {
        const response = await axios.post(`${baseURL}/friend/${userId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const AddFriendInLobby = async (id, userId, data: any) => {
    try {
        const response = await axios.patch(`${baseURL}/lobby/${id}/user/${userId}`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListInvitationSend = async (userId) => {
    try {
        const response = await axios.get(`${baseURL}/friend/sent/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListInvitationReceived = async (userId) => {
    try {
        const response = await axios.get(
            `${baseURL}/friend/received/${userId}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const AnswerInvitation = async (userId, data: any) => {
    try {
        const response = await axios.put(
            `${baseURL}/friend/${userId}/answer`,
            data
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListMyFriends = async (userId) => {
    try {
        const response = await axios.get(
            `${baseURL}/friend/${userId}`
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const CreateLobby = async (data: any) => {
    try {
        const response = await axios.post(`${baseURL}/lobby`, data);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListLobby = async (userId) => {
    try {
        const response = await axios.get(`${baseURL}/user/${userId}/lobbies`);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListGames = async () => {
    try {
        const response = await axios.get(`${baseURL}/game`);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};
