import axios from 'axios';
import * as jose from 'jose';
import {baseURL} from '../../environnements/environnement';

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
    const decoded = jose.decodeJwt(userToken.token);
    localStorage.setItem(
        'auth',
        JSON.stringify({
            token: decoded,
            status: true,
            userid: decoded.id,
            userName: decoded.name,
            userToken: userToken.token,
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
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.get(`${baseURL}/lobby/${id}`, {
            headers: { Authorization: `Bearer ${userToken.userToken}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const redirectOnLobby = async (id: any) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.patch(
            `${baseURL}/lobby/${id}`,
            {},
            {
                headers: { Authorization: `Bearer ${userToken.userToken}` },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const researchUser = async (userId, name: any) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.get(
            `${baseURL}/user/${userId}/name/${name}`,
            {
                headers: { Authorization: `Bearer ${userToken.userToken}` },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const AddFriend = async (userId, data: any) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.post(`${baseURL}/friend/${userId}`, data, {
            headers: { Authorization: `Bearer ${userToken.userToken}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const AddFriendInLobby = async (id, data: any) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.post(
            `${baseURL}/invitation/lobby/${id}`,
            data,
            {
                headers: {Authorization: `Bearer ${userToken.userToken}`},
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const GetAllUserInvitations = async (id) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.get(
            `${baseURL}/invitation/${id}`,
            {
                headers: {Authorization: `Bearer ${userToken.userToken}`}
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
}

export const AnswerLobbyInvitation = async (id, data) => {
    try {
        const userToken = JSON.parse(localStorage.getItem('auth'));
        const response = await axios.patch(
            `${baseURL}/invitation/${id}`,
            data,
            {headers: {Authorization: `Bearer ${userToken.userToken}`}});
    } catch (error) {
        throw error.response?.data as Error;
    }
}

export const ListInvitationSend = async (userId) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.get(`${baseURL}/friend/sent/${userId}`, {
            headers: {Authorization: `Bearer ${userToken.userToken}`},
        });
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListInvitationReceived = async (userId) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.get(
            `${baseURL}/friend/received/${userId}`,
            {
                headers: { Authorization: `Bearer ${userToken.userToken}` },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const AnswerInvitation = async (userId, data: any) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.put(
            `${baseURL}/friend/${userId}/answer`,
            data,
            {
                headers: { Authorization: `Bearer ${userToken.userToken}` },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListMyFriends = async (userId) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.get(`${baseURL}/friend/${userId}`, {
            headers: { Authorization: `Bearer ${userToken.userToken}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const CreateLobby = async (data: any) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.post(`${baseURL}/lobby`, data, {
            headers: { Authorization: `Bearer ${userToken.userToken}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListLobby = async (userId) => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.get(`${baseURL}/lobby/user/${userId}`, {
            headers: { Authorization: `Bearer ${userToken.userToken}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const ListGames = async () => {
    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.get(`${baseURL}/game`, {
            headers: { Authorization: `Bearer ${userToken.userToken}` },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data as Error;
    }
};

export const PlayGame = async (idGame, idLobby, data: any) => {
    console.log('data', data);

    try {
        const tokenString = localStorage.getItem('auth');
        const userToken = JSON.parse(tokenString);
        const response = await axios.patch(
            `${baseURL}/game/${idGame}/lobby/${idLobby}`,
            data,
            {
                headers: { Authorization: `Bearer ${userToken.userToken}` },
            }
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
