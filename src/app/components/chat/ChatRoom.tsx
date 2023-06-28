import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { over } from 'stompjs';
import { baseURL } from '../../../environnements/environnement';
import './../../assets/css/chat.css';

var stompClient = null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState(
        JSON.parse(localStorage.getItem('info')).info.id
    );
    const [userData, setUserData] = useState({
        username: JSON.parse(localStorage.getItem('auth')).userName,
        receivername:
            JSON.parse(localStorage.getItem('auth')).userid !=
            JSON.parse(localStorage.getItem('info')).info.participants[0].id
                ? JSON.parse(localStorage.getItem('info')).info.participants[0]
                      .name
                : JSON.parse(localStorage.getItem('info')).info.participants[1]
                      .name,
        senderUser: JSON.parse(localStorage.getItem('auth')).userid,
        lobby: JSON.parse(localStorage.getItem('info')).info.id,
        connected: false,
        currentDate: new Date().toLocaleString(),
        message: '',
    });
    useEffect(() => {
        console.log('privateChats', privateChats);
    }, [userData]);

    useEffect(() => {
        registerUser();
    }, []);

    const connect = () => {
        let Sock = new SockJS(`${baseURL}/ws`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onConnected = () => {
        setUserData({ ...userData, connected: true });
        stompClient.subscribe('/chat/lobby', onMessageReceived);
        stompClient.subscribe(
            '/user/' + userData.username + '/private',
            onPrivateMessage
        );
        userJoin();
    };

    const userJoin = () => {
        var chatMessage = {
            senderUser: userData.senderUser,
            lobby: userData.lobby,
            message: userData.message,
            senderName: userData.username,
            receiverName: userData.receivername,
            currentDate: new Date().toLocaleString(),
            status: 'JOIN',
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (!payloadData.status) {
            const key = Object.keys(payloadData)[0];
            privateChats.set(parseInt(key, 10), payloadData[key]);
            setPrivateChats(new Map(privateChats));
        } else {
            publicChats.push(payloadData);
            setPublicChats([...new Set(publicChats)]);
        }
    };

    const onPrivateMessage = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.lobby)) {
            privateChats.get(payloadData.lobby).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.lobby, [...new Set(list)]);
            setPrivateChats(new Map(privateChats));
        }
    };

    const onError = (err) => {
        console.log(err);

        registerUser();
    };

    const handleMessage = (event) => {
        const { value } = event.target;
        setUserData({ ...userData, message: value });
    };
    const sendPrivateValue = () => {
        if (stompClient) {
            var chatMessage = {
                senderUser: userData.senderUser,
                lobby: userData.lobby,
                message: userData.message,
                senderName: userData.username,
                receiverName: userData.receivername,
                currentDate: new Date().toLocaleString(),
                status: 'MESSAGE',
            };
            if (privateChats.has(tab) && Array.isArray(privateChats.get(tab))) {
                privateChats.get(tab).push(chatMessage);
            } else {
                privateChats.set(tab, [chatMessage]);
            }

            setPrivateChats(new Map(privateChats));

            stompClient.send(
                '/app/private-message',
                {},
                JSON.stringify(chatMessage)
            );
            setUserData({ ...userData, message: '' });
        }
    };
    const registerUser = () => {
        connect();
    };
    return (
        <div className="chat-content">
            {userData.connected ? (
                <>
                    <ul className="chat-messages">
                        {privateChats.size > 0 &&
                            privateChats.has(tab) &&
                            Array.isArray(privateChats.get(tab)) &&
                            privateChats.get(tab).map((chat, index) => (
                                <li
                                    className={`message ${
                                        chat.senderName === userData.username &&
                                        'self'
                                    }`}
                                    key={index}
                                >
                                    {chat.senderName !== userData.username && (
                                        <div className="avatar">
                                            {chat.senderName}
                                        </div>
                                    )}
                                    <div className="message-data">
                                        <span className="message-text">
                                            {chat.message}
                                        </span>
                                        <span
                                            className="text-info"
                                            style={{ fontSize: 'small' }}
                                        >
                                            <br /> {chat.currentDate}
                                        </span>
                                    </div>
                                    {chat.senderName === userData.username && (
                                        <div className="avatar self">
                                            {chat.senderName}
                                        </div>
                                    )}
                                </li>
                            ))}
                    </ul>
                    <div className="send-message">
                        <input
                            type="text"
                            className="input-message"
                            placeholder="enter the message"
                            value={userData.message}
                            onChange={handleMessage}
                        />
                        <button
                            type="button"
                            className="send-button"
                            onClick={sendPrivateValue}
                        >
                            send
                        </button>
                    </div>
                </>
            ) : (
                <div className="register">Loading ...</div>
            )}
        </div>
    );
};
export default ChatRoom;
