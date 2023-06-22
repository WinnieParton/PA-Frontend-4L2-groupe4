import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client/dist/sockjs';
import { over } from 'stompjs';
import { baseURL } from '../../../environnements/environnement';
import './../../assets/css/chat.css';

var stompClient = null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());
    const [publicChats, setPublicChats] = useState([]);
    const [tab, setTab] = useState('CHATROOM');
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
        message: '',
    });
    useEffect(() => {}, [userData]);

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
            status: 'JOIN',
        };
        stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
    };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);

        console.log('payloadData', payloadData);
        console.log('privateChats', privateChats);

        switch (payloadData.status) {
            case 'JOIN':
                if (!privateChats.get(payloadData.senderName)) {
                    privateChats.set(payloadData.senderName, []);
                    setPrivateChats(new Map(privateChats));
                    console.log(' new ', privateChats);
                }
                break;
            case 'MESSAGE':
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    };

    const onPrivateMessage = (payload) => {
        console.log('payloadccccccccccccc', payload);
        var payloadData = JSON.parse(payload.body);
        if (privateChats.get(payloadData.senderName)) {
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        } else {
            let list = [];
            list.push(payloadData);
            privateChats.set(payloadData.senderName, list);
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
                // receiverName: tab,
                senderUser: userData.senderUser,
                lobby: userData.lobby,
                message: userData.message,
                senderName: userData.username,
                receiverName: userData.receivername,
                status: 'MESSAGE',
            };

            if (userData.username !== tab) {
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
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
        <div className="container">
            {userData.connected ? (
                <div className="chat-box">
                    <div className="member-list">
                        <ul>
                            {[...privateChats.keys()].map(
                                (name, index) =>
                                    name != userData.username && (
                                        <li
                                            onClick={() => {
                                                setTab(name);
                                            }}
                                            className="member active"
                                            key={index}
                                        >
                                            {name}
                                        </li>
                                    )
                            )}
                        </ul>
                    </div>
                    {tab !== 'CHATROOM' && (
                        <div className="chat-content">
                            <ul className="chat-messages">
                                {[...privateChats.get(tab)].map(
                                    (chat, index) => (
                                        <li
                                            className={`message ${
                                                chat.senderName ===
                                                    userData.username && 'self'
                                            }`}
                                            key={index}
                                        >
                                            {chat.senderName !==
                                                userData.username && (
                                                <div className="avatar">
                                                    {chat.senderName}
                                                </div>
                                            )}
                                            <div className="message-data">
                                                {chat.message}
                                            </div>
                                            {chat.senderName ===
                                                userData.username && (
                                                <div className="avatar self">
                                                    {chat.senderName}
                                                </div>
                                            )}
                                        </li>
                                    )
                                )}
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
                        </div>
                    )}
                </div>
            ) : (
                <div className="register">Loading ...</div>
            )}
        </div>
    );
};
export default ChatRoom;
