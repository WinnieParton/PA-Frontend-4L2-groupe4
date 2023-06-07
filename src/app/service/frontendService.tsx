import axios from 'axios';
import { baseURL } from '../../environnements/environnement';

export const login = async (email: any, password: any) => {
    try {
        const response = await axios.post(`${baseURL}/auth/login`, {
            email,
            password,
        });
        saveToken(response.data);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};
function saveToken(userToken: any) {
    const user = JSON.parse(atob(userToken.token));
    localStorage.setItem(
        'auth',
        JSON.stringify({
            token: userToken.token,
            status: true,
            userid: user.id,
        })
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

export const redirectOnLobby = async (id: any) => {
    try {
        const response = await axios.patch(`${baseURL}/lobby/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const researchUser = async (userId, name: any) => {
    try {
        const response = await axios.get(
            `${baseURL}/user/${userId}/name/${name}`
        );
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
        const response = await axios.patch(
            `${baseURL}/lobby/${id}/user/${userId}`,
            data
        );
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
        const response = await axios.get(`${baseURL}/friend/${userId}`);
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
        const response = await axios.get(`${baseURL}/lobby/user/${userId}`);
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

export const PlayGame = async (idGame, idLobby, data: any) => {
    console.log('data', data);

    try {
        const response = await axios.patch(
            `${baseURL}/game/${idGame}/lobby/${idLobby}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('errrrrrrrrrrrrr ', error.message);
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        } else {
            throw new Error(error.message);
        }
    }
};

export function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
}
