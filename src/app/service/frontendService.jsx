import axios from "axios";
import * as jose from "jose";
import { baseURL } from "../../environnements/environnement";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, {
      email,
      password,
    });
    saveToken(response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
function saveToken(userToken) {
  const decoded = jose.decodeJwt(userToken.token);
  localStorage.setItem(
    "auth",
    JSON.stringify({
      token: decoded,
      status: true,
      userid: decoded.id,
      userName: decoded.name,
      userToken: userToken.token,
    })
  );
}

export const signup = async (data) => {
  try {
    const response = await axios.post(`${baseURL}/auth/signup`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getLobby = async (id) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/lobby/${id}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const researchUser = async (userId, name) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/user/${userId}/name/${name}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const AddFriend = async (userId, data) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.post(`${baseURL}/friend/${userId}`, data, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const AddFriendInLobby = async (id, data) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.post(
      `${baseURL}/invitation/lobby/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${userToken.userToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const GetAllUserInvitations = async (id) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/invitation/${id}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const AnswerLobbyInvitation = async (id, data) => {
  try {
    const userToken = JSON.parse(localStorage.getItem("auth"));
    const response = await axios.patch(`${baseURL}/invitation/${id}`, data, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
  } catch (error) {
    throw error.response?.data;
  }
};

export const ListInvitationSend = async (userId) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/friend/sent/${userId}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const ListInvitationReceived = async (userId) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/friend/received/${userId}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const AnswerInvitation = async (userId, data) => {
  try {
    const tokenString = localStorage.getItem("auth");
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
    throw error.response?.data;
  }
};

export const ListMyFriends = async (userId) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/friend/${userId}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const CreateLobby = async (data) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.post(`${baseURL}/lobby`, data, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const ListLobby = async (userId) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/lobby/user/${userId}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const ListGames = async () => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/game`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const PlayGame = async (idGame, idLobby, data) => {
  try {
    const tokenString = localStorage.getItem("auth");
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
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}

export const runEngine = async (idLobby, data) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.post(`${baseURL}/engine/${idLobby}`, data, {
      headers: {
        Authorization: `Bearer ${userToken.userToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const addGame = async (data) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);

    const response = await axios.post(`${baseURL}/game/create`, data, {
      headers: {
        Authorization: `Bearer ${userToken.userToken}`,
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const UploadVoice = async (data) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.post(`${baseURL}/files/upload`, data, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const readVoices = async (fileName) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/files/download/${fileName}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getGame = async (id) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/game/file/${id}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const SaveScore = async (idLobby, data) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.post(
      `${baseURL}/ranking/lobby/${idLobby}/endgame`,
      data,
      {
        headers: { Authorization: `Bearer ${userToken.userToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getRankingByGame = async (id) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/ranking/game/${id}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const getRankingByUser = async (id) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/ranking/user/${id}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};
export const getLastStateGame = async (id) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(`${baseURL}/game/move/${id}`, {
      headers: { Authorization: `Bearer ${userToken.userToken}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data;
  }
};

export const actionMove = async (iuser, status, idmove) => {
  try {
    const tokenString = localStorage.getItem("auth");
    const userToken = JSON.parse(tokenString);
    const response = await axios.get(
      `${baseURL}/game/rollback/${iuser}/idmove/${idmove}/status/${status}`,
      {
        headers: { Authorization: `Bearer ${userToken.userToken}` },
      }
    );
  } catch (error) {
    throw error.response?.data;
  }
};
